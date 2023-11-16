import express, { Request, Response } from "express";
import { Blockchain } from "./blockchain";
import * as crypto from "crypto";
import axios from "axios";
import { Block, NodeUrl, Transaction } from "./types";

const app = express();
const PORT = process.argv[2];
const nodeAddress = crypto.randomUUID().split("-").join("");

const bitcoin = new Blockchain();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//Function validation if node is already in networkNodes
console.log("hello");
const addNode = (newNodeUrl: NodeUrl) => {
  if (
    !bitcoin.networkNodes.includes(newNodeUrl) &&
    bitcoin.currentNodeUrl !== newNodeUrl
  ) {
    bitcoin.networkNodes.push(newNodeUrl);
  }
};

app.get("/blockchain", function (req: Request, res: Response) {
  res.send(bitcoin);
});
app.post("/transaction", function (req: Request, res: Response) {
  const newTransaction = req.body;
  const blockIndex =
    bitcoin.addTransactionToPendingTransactions(newTransaction);
  res.json({ message: `Transaction will be added in block ${blockIndex}` });
});

app.post("/transaction/broadcast", async (req: Request, res: Response) => {
  console.log(bitcoin.networkNodes);
  const newTransaction = bitcoin.createNewTransaction(
    req.body.amount,
    req.body.sender,
    req.body.recipient,
  );
  bitcoin.addTransactionToPendingTransactions(newTransaction);

  const requestOptions = bitcoin.networkNodes.map((networkNodeUrl) => {
    return axios.post(`${networkNodeUrl}/transaction`, newTransaction);
  });

  try {
    await Promise.all(requestOptions);
    res.json({ message: "Transaction registered successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error occurred during registrating transaction." });
  }
});

app.get("/mine", async (req: Request, res: Response) => {
  const lastBlock = bitcoin.getLastBlock();
  const previousBlockHash = lastBlock["hash"];

  const currentBlockData = {
    transactions: bitcoin.pendingTransactions,
    index: lastBlock["index"] + 1,
  };

  const nonce = bitcoin.proofOfWork(previousBlockHash, currentBlockData);
  const blockHash = bitcoin.hashBlock(
    previousBlockHash,
    currentBlockData,
    nonce,
  );

  const newBlock = bitcoin.createNewBlock(nonce, previousBlockHash, blockHash);

  const blockPromises = bitcoin.networkNodes.map((networkNodeUrl) => {
    return axios.post(`${networkNodeUrl}/receive-new-block`, {
      newBlock: newBlock,
    });
  });

  try {
    await Promise.all(blockPromises);
    console.log(blockPromises);

    //Mined block reward 5btc
    const minerRewardTransaction: Transaction = bitcoin.createNewTransaction(
      "5",
      "00",
      nodeAddress,
    );

    bitcoin.addTransactionToPendingTransactions(minerRewardTransaction);

    const txPromises = bitcoin.networkNodes.map((networkNodeUrl) => {
      console.log(`Sending transaction to: ${networkNodeUrl}`);
      return axios.post(`${networkNodeUrl}/transaction`, {
        newTransaction: minerRewardTransaction,
      });
    });

    await Promise.all(txPromises);
    console.log("Miner reward transaction broadcasted to all nodes");

    res.json({
      note: "New block mined & broadcast successfully, miner reward transaction created & broadcast",
      block: newBlock,
    });
  } catch (error) {
    console.error("Error occurred during mining:", error);
    res.status(500).json({ message: "Error occurred" });
  }
});

app.post("/receive-new-block", function (req: Request, res: Response) {
  const newBlock = req.body.newBlock;
  const lastBlock = bitcoin.getLastBlock();
  //Checking the hashes compatibility/block legitimation
  const correctHash = lastBlock.hash === newBlock.previousBlockHash;
  const correctIndex = lastBlock["index"] + 1 === newBlock["index"];

  if (correctHash && correctIndex) {
    bitcoin.chain.push(newBlock);
    //Clearing out pending transactions
    bitcoin.pendingTransactions = [];
    res.json({
      message: "New block received and accepted",
      newBlock,
    });
  } else {
    res.json({
      message: "New block rejected",
      newBlock,
    });
  }
});

//Register a node and broadcast it to the network

app.post(
  "/register-and-broadcast-node",
  async (req: Request, res: Response) => {
    const newNodeUrl: NodeUrl = req.body.newNodeUrl;
    console.log(newNodeUrl);

    addNode(newNodeUrl);

    // Czy można usunąć jedno newNodeUrl? CODE REVIEW

    const regNodesPromises = bitcoin.networkNodes.map((networkNodeUrl) => {
      return axios.post(`${networkNodeUrl}/register-node`, {
        newNodeUrl: newNodeUrl,
      });
    });

    try {
      const results = await Promise.all(regNodesPromises);
      res.json({ message: "Nodes registered successfully" });
      await axios.post(`${newNodeUrl}/register-nodes-bulk`, {
        allNetworkNodes: [...bitcoin.networkNodes, bitcoin.currentNodeUrl],
      });
    } catch (error) {
      res.status(500).json({ error: "Error occurred during registration." });
    }
  },
);

//Register a node with the network
app.post("/register-node", function (req: Request, res: Response) {
  const newNodeUrl: NodeUrl = req.body.newNodeUrl;
  addNode(newNodeUrl);

  res.json({ message: "New node registered successfully." });
});

//Register multiple nodes at once
app.post("/register-nodes-bulk", function (req: Request, res: Response) {
  const allNetworkNodes: NodeUrl[] = req.body.allNetworkNodes;
  allNetworkNodes.forEach(addNode);
  res.json({ message: "Bulk registration successful" });
});

console.log(bitcoin.networkNodes);

app.get("/consensus", async (req, res) => {
  try {
    const requestPromises = bitcoin.networkNodes.map((networkNodeUrl) => {
      return axios.get(`${networkNodeUrl}/blockchain`);
    });

    const blockchains = await Promise.all(requestPromises);

    let maxChainLength = bitcoin.chain.length;
    let newLongestChain = null;
    let newPendingTransactions = null;

    blockchains.forEach((response) => {
      const blockchain = response.data;
      if (blockchain.chain.length > maxChainLength) {
        maxChainLength = blockchain.chain.length;
        newLongestChain = blockchain.chain;
        newPendingTransactions = blockchain.pendingTransactions;
      }
    });

    if (
      !newLongestChain ||
      (newLongestChain && !bitcoin.chainIsValid(newLongestChain))
    ) {
      res.json({
        note: "Current chain has not been replaced.",
        chain: bitcoin.chain,
      });
    } else {
      bitcoin.chain = newLongestChain;
      bitcoin.pendingTransactions = newPendingTransactions;
      res.json({
        note: "This chain has been replaced.",
        chain: bitcoin.chain,
      });
    }
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({
        note: "An error occurred during the consensus process.",
        error: error.message,
      });
    }
  }
});

//Block explorer endpoints

//Method that allows to find a block by its hash
app.get("/block/:blockHash", (req: Request, res: Response) => {
  const blockHash = req.params.blockHash;
  const correctBlock = bitcoin.getBlock(blockHash);

  if (!correctBlock) {
    return res.status(404).json({ error: "Block not found" });
  }

  res.json({ correctBlock });
});

app.get("/transaction/:transactionId", (req: Request, res: Response) => {
  const transactionId = req.params.transactionId;
  const transactionData = bitcoin.getTransaction(transactionId);

  if (transactionData instanceof Error) {
    return res.status(500).json({ error: transactionData.message });
  }

  res.json({
    transaction: transactionData.transaction,
    block: transactionData.block,
  });
});

app.get("/address/:address"), (req: Request, res: Response) => {};

app.listen(PORT, () => {
  console.log(`Server is live on this port ${PORT}`);
});

//end
//end
//end
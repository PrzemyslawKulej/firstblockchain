import express, { Request, Response } from 'express';
import bodyParser from "body-parser";
import {Blockchain} from "./blockchain";
import * as crypto from "crypto";
import  axios from 'axios';
import {NodeUrl} from "./types";

const app = express();
const PORT = process.argv[2];
const nodeAddress = crypto.randomUUID().split('-').join('');

const bitcoin = new Blockchain();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended:false }));

//I can use here express.json() that is build in newer versions of Express

//Function validation if node is already in networkNodes
const addNode = (newNodeUrl: NodeUrl) => {
    if (!bitcoin.networkNodes.includes(newNodeUrl) && bitcoin.currentNodeUrl !== newNodeUrl) {
        bitcoin.networkNodes.push(newNodeUrl);
    }
}

app.get('/blockchain', function (req: Request, res: Response) {
    res.send(bitcoin);

});
app.post('/transaction', function (req: Request, res: Response) {
    // Destructuring for clarity's sake  CODE REVIEW
    const { amount, sender, recipient } = req.body;
    const newTransaction = { amount, sender, recipient };
    const blockIndex = bitcoin.addTransactionToPendingTransactions(newTransaction);
    res.json({ message: `Transaction will be added in block ${blockIndex}`});

});

app.post('/transaction/broadcast', async (req: Request, res: Response) => {
    const newTransaction = bitcoin.createNewTransaction(req.body.amount, req.body.sender, req.body.recipient);
    bitcoin.addTransactionToPendingTransactions(newTransaction);

    const requestPromises: any = [];
    const requestOptions = bitcoin.networkNodes.map(networkNodeUrl => {
        return axios.post(`${networkNodeUrl}/transaction`, newTransaction);

    });

    try {
            await Promise.all(requestPromises)
            res.json({ message: 'Transaction registered successfull'});

    } catch (error) {
        res.status(500).json({ error: 'Error occured during registrating transaction.' });
    }
});



app.get('/mine', async (req: Request, res: Response) => {
    const lastBlock = bitcoin.getLastBlock();
    const previousBlockHash = lastBlock['hash'];

    const currentBlockData = {
        transactions: bitcoin.pendingTransactions,
        index: lastBlock['index'] + 1
    };

    const nonce = bitcoin.proofOfWork(previousBlockHash, currentBlockData);
    const blockHash = bitcoin.hashBlock(previousBlockHash, currentBlockData, nonce);


    const newBlock = bitcoin.createNewBlock(nonce, previousBlockHash, blockHash);


    const blockPromises = bitcoin.networkNodes.map(networkNodeUrl => {
        return axios.post(`${networkNodeUrl}/recieve-new-block`, newBlock)

    })

    try {
       await Promise.all(blockPromises);

        //Mined block reward 5btc
       const minerRewardTransaction = bitcoin.createNewTransaction(5, "00", nodeAddress);

       const txPromises = bitcoin.networkNodes.map(networkNodeUrl => {
           axios.post(`${networkNodeUrl}/transaction`, {newTransaction: minerRewardTransaction});
       });

       await Promise.all(txPromises);

        res.json({
            note: "New block mined & braodcast successfully, miner reward transaction created & broadcasted",
            block: newBlock
        });

    } catch (error) {
       res.status(500).json({ message: 'Error occured' })
    }


});

//Register a node and broadcast it to the network

app.post('/register-and-broadcast-node', async (req: Request, res: Response) => {
   const  newNodeUrl: NodeUrl = req.body.newNodeUrl;

   addNode(newNodeUrl);

   // Czy można usunąć jedno newNodeUrl? CODE REVIEW

   const regNodesPromises = bitcoin.networkNodes.map(networkNodeUrl => {
       return axios.post(`${networkNodeUrl}/register-node`, {
           newNodeUrl: newNodeUrl
       });
   });

   try {
       const results = await Promise.all(regNodesPromises);
       res.json({ message: 'Nodes registered successfully' });
       await axios.post(`${newNodeUrl}/register-nodes-bulk`, {
           allNetworkNodes: [ ...bitcoin.networkNodes, bitcoin.currentNodeUrl ]
       });


   } catch (error) {
       res.status(500).json({ error: 'Error occured during registration.'});
   }


});

//Register a node with the network
app.post('/register-node', function (req: Request, res: Response) {
    const newNodeUrl: NodeUrl = req.body.newNodeUrl;
    addNode(newNodeUrl);

    res.json({ message: 'New node registered successfully.' });


});


//Register multiple nodes at once
app.post('/register-nodes-bulk', function (req: Request, res: Response) {
    const allNetworkNodes: NodeUrl[] = req.body.allNetworkNodes;
    allNetworkNodes.forEach(addNode);
    res.json({ message: 'Bulk registration successful' });

});


app.listen(PORT, () => {
    console.log(`Server is live on this port ${PORT}`);
});


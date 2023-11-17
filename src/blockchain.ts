import { Block, NodeUrl, Transaction } from "./types";
const sha256 = require("sha256");
const currentNodeUrl = process.argv[3];
import * as crypto from "crypto";

class Blockchain {
  chain: Block[];
  pendingTransactions: [] | null;
  networkNodes: NodeUrl[];
  currentNodeUrl: string;

  constructor() {
    this.chain = [];
    this.pendingTransactions = [];
    this.networkNodes = [];
    this.currentNodeUrl = currentNodeUrl;
    //Genesis block
    this.createNewBlock(100, "0", "0");
  }

  // Method, that creates new block of our blockchain and adds to it
  createNewBlock(
    nonce: number,
    previousBlockHash: string,
    hash: string,
  ): Block {
    const newBlock: Block = {
      index: this.chain.length + 1,
      timestamp: Date.now(),
      transactions: this.pendingTransactions,
      nonce,
      hash,
      previousBlockHash,
    };
    this.pendingTransactions = [];
    this.chain.push(newBlock);

    return newBlock;
  }

  //Method that give us the last block of the blockchain

  getLastBlock(): Block {
    return this.chain[this.chain.length - 1];
  }

  //Method that create new transaction
  // Redundant variable newTransaction -- CODE REVIEW

  createNewTransaction(
    amount: string,
    sender: string,
    recipient: string,
  ): Transaction {
    const newTransaction: Transaction = {
      amount,
      sender,
      recipient,
      transactionId: crypto.randomUUID().split("-").join(""),
    };

    return newTransaction;
  }

  addTransactionToPendingTransactions(transactionObj: any) {
    console.log("Adding transaction to pending transactions:", transactionObj);
    // @ts-ignore
    this.pendingTransactions.push(transactionObj);
    return (this.getLastBlock() || { index: 0 })["index"] + 1;
  }

  //Hashing method

  hashBlock(
    previousBlockHash: string,
    currentBlockData: any,
    nonce: number,
  ): string {
    const dataAsString =
      previousBlockHash + nonce.toString() + JSON.stringify(currentBlockData);
    const hash = sha256(dataAsString);
    return hash;
  }

  //Proof of work method

  proofOfWork(previousBlockHash: string, currentBlockData: any) {
    let nonce = 0;
    let hash = this.hashBlock(previousBlockHash, currentBlockData, nonce);
    while (hash.substring(0, 4) !== "0000") {
      nonce++;
      hash = this.hashBlock(previousBlockHash, currentBlockData, nonce);
    }
    return nonce;
  }

  //Checking if blockchain is valid by
  chainIsValid(blockchain: any) {
    let validChain = true;

    for (let i = 1; i < blockchain.length; i++) {
      const currentBLock = blockchain[i];
      const prevBlock = blockchain[i - 1];
      const blockHash = this.hashBlock(
        prevBlock["hash"],
        {
          transactions: currentBLock["transactions"],
          index: currentBLock["index"],
        },
        currentBLock["nonce"],
      );
      if (blockHash.substring(0, 4) !== "0000") {
        validChain = false;
      }
      if (currentBLock["previousBlockHash"] !== prevBlock["hash"]) {
        validChain = false;
      } //chain is not valid
    }
    //Checking if genesis block is valid
    const genesisBlock = blockchain["0"];
    const correctNonce = genesisBlock["nonce"] === 100;
    const correctPreviousBlockHash = genesisBlock["previousBlockHash"] === "0";
    const correctHash = genesisBlock["hash"] === "0";
    const correctTransactions = genesisBlock["transactions"].length === 0;

    if (
      !correctNonce ||
      !correctPreviousBlockHash ||
      !correctHash ||
      !correctTransactions
    )
      validChain = false;

    return validChain;
  }

  //Block explorer methods
  getBlock(blockHash: string): Block | null {
    return this.chain.find((block) => block.hash === blockHash) || null;
  }

  getTransaction(
    transactionId: string,
  ): { transaction: Transaction | null; block: Block | null } | Error {
    try {
      if (!transactionId) {
        return new Error("No transaction ID provided");
      }

      let correctTransaction: Transaction | null = null;
      let correctBlock: Block | null = null;

      for (const block of this.chain) {
        correctTransaction =
          block.transactions?.find(
            (transaction) => transaction.transactionId === transactionId,
          ) ?? null;

        if (correctTransaction) {
          correctBlock = block;
          break;
        }
      }

      if (!correctTransaction) {
        return new Error("Transaction not found");
      }

      return { transaction: correctTransaction, block: correctBlock };
    } catch (error) {
      console.log(error);

      if (error instanceof Error) {
        return error;
      } else {
        return new Error("An unknown error occurred");
      }
    }
  }

  getAddressData(address: string) {
    try {
      if (!address) {
        throw new Error("No address provided");
      }

      const addressTransactions = [];
      for (const block of this.chain) {
        const transaction =
          block.transactions?.find(
            (t) => t.sender === address || t.recipient === address,
          ) ?? null;

        if (transaction) {
          addressTransactions.push(transaction);
        }
      }

      let balance: number = 0;
      for (const transaction of addressTransactions) {
        const amount = parseFloat(transaction.amount);
        if (transaction.recipient === address) balance += amount;
        else if (transaction.sender === address) balance -= amount;
      }

      return {
        addressTransactions,
        addressBalance: balance,
      };
    } catch (error) {
      console.log(error);
    }
  }
}
// Exporting blockchain

export { Blockchain };

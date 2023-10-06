import {Block, NodeUrl, Transaction} from './types';
import sha256 from 'sha256';
const currentNodeUrl = process.argv[3];
import * as crypto from "crypto";

class Blockchain {
    chain: Block[];
    pendingTransactions: Transaction[];
    networkNodes: NodeUrl[];
    currentNodeUrl: string;

    constructor() {
        this.chain = [];
        this.pendingTransactions = [];
        this.networkNodes = [];
        this.currentNodeUrl = currentNodeUrl;
        //Genesis block
        this.createNewBlock(100, '0', '0');
    }

// Method, that creates new block of our blockchain and adds to it
    createNewBlock(nonce: number, previousBlockHash: string, hash: string): Block {
        const newBlock: Block = {
            index: this.chain.length + 1,
            timestamp: Date.now(),
            transactions: this.pendingTransactions,
            nonce,
            hash,
            previousBlockHash,
        }
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

    createNewTransaction(amount: number, sender: string, recipient: string): Transaction {
        const newTransaction: Transaction = {
            amount,
            sender,
            recipient,
            transactionId: crypto.randomUUID().split('-').join('')
        }

        return newTransaction;

    }

    addTransactionToPendingTransactions(transactionObj: any) {
        console.log("Adding transaction to pending transactions:", transactionObj);
        this.pendingTransactions.push(transactionObj)
        return this.getLastBlock()['index'] + 1;
    }

    //Hashing method

    hashBlock(previousBlockHash: string, currentBlockData: any, nonce: number): string {
        const dataAsSting = previousBlockHash + nonce.toString() + JSON.stringify(currentBlockData);
        const hash = sha256(dataAsSting);
        return hash;

    }
    //Proof of work method

    proofOfWork(previousBlockHash: string, currentBlockData: any) {
        let nonce = 0;
        let hash = this.hashBlock(previousBlockHash, currentBlockData, nonce);
        while (hash.substring(0, 4) !== '0000') {
            nonce++;
            hash = this.hashBlock(previousBlockHash, currentBlockData, nonce);
        }
        return nonce;


    }

    //Checking if blockchain is valid by
    chainIsValid(blockchain: any) {
        let validChain = true;

        for (let i = 1; i < blockchain; i++) {
            const currentBLock = blockchain[i];
            const prevBlock = blockchain[i - 1];
            const blockHash = this.hashBlock(prevBlock['hash'], {transactions: currentBLock['transactions'], index: currentBLock['index']}, currentBLock['nonce'] );
            if (blockHash.substring(0, 4) !== '0000') {
                validChain = false;
            }
            if (currentBLock['previousBlockHash'] !== prevBlock['hash']) {
                validChain = false;
            } //chain is not valid
        }
        //Checking if genesis block is valid
        const genesisBlock = blockchain['0'];
        const correctNonce = genesisBlock['nonce'] === 100;
        const correctPreviousBlockHash = genesisBlock['previousBlockHash'] === '0';
        const correctHash = genesisBlock['hash'] === '0';
        const correctTransactions = genesisBlock['transactions'].length === 0;

        return validChain;

    };

}

// Exporting blockchain
//cdd

export { Blockchain };


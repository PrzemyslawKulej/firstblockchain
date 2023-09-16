import { Block, Transaction } from './types';

class Blockchain {
    chain: Block[];
    pendingTransactions: Transaction[];

    constructor() {
        this.chain = [];
        this.pendingTransactions = [];
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

    createNewTransaction(amount: number, sender: string, recipient: string): number {
        const newTransaction: Transaction = {
            amount,
            sender,
            recipient
        }

        this.pendingTransactions.push(newTransaction);

        return this.getLastBlock().index + 1;

    }

}

export { Blockchain };


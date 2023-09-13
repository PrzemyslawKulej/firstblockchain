import { Block, Transaction, BlockchainType } from './types';

function Blockchain(this: BlockchainType) {
    this.chain = [];
    this.pendingTransactions = [];
}

// Method, that creates new block of our blockchain and adds to it
Blockchain.prototype.createNewBlock = function (this: BlockchainType, nonce: number, previousBlockHash: string, hash: string) {
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

Blockchain.prototype.getLastBlock = function () {
    this.chain[this.chain.length - 1];
}

//Method that create new transaction

Blockchain.prototype.createNewTransaction = function (amount: number, sender: string, recipient: string) {
    const newTransaction = {
        amount,
        sender,
        recipient
    }

    this.pendingTransactions.push(newTransaction);

    return this.getLastBlock()['index'] + 1;

}

export { Blockchain };
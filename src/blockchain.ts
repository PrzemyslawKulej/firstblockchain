import { Block, Transaction, BlockchainType } from './types';

function Blockchain(this: BlockchainType) {
    this.chain = [];
    this.newTransactions = [];
}

// Method, that creates new block of our blockchain and adds to it
Blockchain.prototype.createNewBlock = function (this: BlockchainType, nonce: number, previousBlockHash: string, hash: string) {
    const newBlock: Block = {
        index: this.chain.length + 1,
        timestamp: Date.now(),
        transactions: this.newTransactions,
        nonce,
        hash,
        previousBlockHash,
    }
    this.newTransactions = [];
    this.chain.push(newBlock);

    return newBlock;
}

export { Blockchain };
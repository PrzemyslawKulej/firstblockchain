function Blockchain() {
    this.chain = [];
    this.newTransactions = [];
}

// Method, that creates new block of our blockchain and adds to it
Blockchain.prototype.createNewBlock = function (nonce: Number, previousBlockHash: String, hash: String) {
    const newBlock = {
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
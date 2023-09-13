
export interface Block {
    index: number;
    timestamp: number;
    transactions: Transaction[];
    nonce: number;
    hash: string;
    previousBlockHash: string;
}

export interface Transaction {
    sender: string;
    recipient: string;
    amount: number;
}

export interface BlockchainType {
    chain: Block[];
    pendingTransactions: Transaction[];
    createNewBlock( nonce: number, previousBlockHash: string, hash: string): Block;
}
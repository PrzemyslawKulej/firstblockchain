
export interface Block {
    index: number;
    timestamp: number;
    transactions: Transaction[] | null;
    nonce: number;
    hash: string;
    previousBlockHash: string;
}

export interface Transaction {
    sender: string;
    recipient: string;
    amount: string;
    transactionId: string;
}

export interface Node {
    node: string;
}

export type NodeUrl = string;


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

export interface Node {
    node: string;
}

export type NodeUrl = string;

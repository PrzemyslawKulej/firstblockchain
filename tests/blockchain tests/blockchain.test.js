import { describe, it, expect } from 'vitest';
import { Blockchain } from '../../src/blockchain'; 

describe('Blockchain', () => {
  let blockchain;

  beforeEach(() => {
    blockchain = new Blockchain();
  });

  it('hashBlock generates a correct hash', () => {
    const previousBlockHash = 'PREVIOUSBLOCKHASH';
    const currentBlockData = [{ transactions: 'some transactions data' }];
    const nonce = 100;

    const hash = blockchain.hashBlock(previousBlockHash, currentBlockData, nonce);

    
    expect(hash).toHaveLength(64);

    
    expect(hash).toMatch(/^[a-f0-9]{64}$/);
  });

  it('proofOfWork finds a nonce that generates hash starting with "0000"', () => {
    const previousBlockHash = 'PREVIOUSBLOCKHASH';
    const currentBlockData = [{ transactions: 'some transactions data' }];

    const nonce = blockchain.proofOfWork(previousBlockHash, currentBlockData);
    const validHash = blockchain.hashBlock(previousBlockHash, currentBlockData, nonce);

    
    expect(validHash.substring(0, 4)).toBe('0000');
  });
});


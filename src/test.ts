import { Blockchain } from './blockchain';


const bitcoin: Blockchain = new Blockchain();
const previousBlockHash = '002313NNADAS123'
const currentBlockData = [
    {
        amount: 10,
        sender: 'N90ANS90SDFR',
        recipient: '90NANA90NAS30'
    },
    {
        amount: 20,
        sender: 'N70ANS90SDFR',
        recipient: '90NANA70NAS30'
    },
    {
        amount: 300,
        sender: 'N60ANS90SDFR',
        recipient: '90NANA60NAS30'
    }
]
const nonce = 100;

bitcoin.hashBlock(previousBlockHash, currentBlockData, nonce);

console.log(bitcoin.hashBlock(previousBlockHash, currentBlockData, nonce));
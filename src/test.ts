import { Blockchain } from './blockchain';


const bitcoin: Blockchain = new Blockchain();

bitcoin.createNewBlock(2356, '23QDDADA', '22QAADAD');


console.log(bitcoin);
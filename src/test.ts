import { Blockchain } from './blockchain';
import {BlockchainType} from "./types";

const bitcoin: BlockchainType = new Blockchain();

bitcoin.createNewBlock(2356, '23QDDADA', '22QAADAD');

console.log(bitcoin);
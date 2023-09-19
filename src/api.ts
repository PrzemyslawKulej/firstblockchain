import express, { Request, Response } from 'express';
import bodyParser from "body-parser";
import {Blockchain} from "./blockchain";

const app = express();
const PORT = 3000;

const bitcoin = new Blockchain()

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended:false }));

//I can use here express.json() that is build in newer versions of Express


app.get('/blockchain', function (req: Request, res: Response) {
    res.send(bitcoin);

});
app.post('/transaction', function (req: Request, res: Response) {
    const blockIndex = bitcoin.createNewTransaction(req.body.amount, req.body.sender, req.body.recipient);
    res.json({ note: `Transaction will be added in block ${blockIndex}.`});

});
app.get('/mine', function (req: Request, res: Response) {
    const lastBlock = bitcoin.getLastBlock();
    const previousBlockHash = lastBlock['hash'];

    const nonce = bitcoin.proofOfWork();
    const currentBlockData = {
        transactions: bitcoin.pendingTransactions,
        index: lastBlock['index'] + 1
    };

    const newBlock = bitcoin.createNewBlock(,previousBlockHash);

});

app.listen(PORT, () => {
    console.log(`Server is live on this port ${PORT}`);
});


import express, { Request, Response } from 'express';
import bodyParser from "body-parser";
import {Blockchain} from "./blockchain";
import * as crypto from "crypto";
import  axios from 'axios';

const app = express();
const PORT = process.argv[2];
const nodeAddress = crypto.randomUUID().split('-').join('');

const bitcoin = new Blockchain();


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

    const currentBlockData = {
        transactions: bitcoin.pendingTransactions,
        index: lastBlock['index'] + 1
    };

    const nonce = bitcoin.proofOfWork(previousBlockHash, currentBlockData);
    const blockHash = bitcoin.hashBlock(previousBlockHash, currentBlockData, nonce);

    //Mined block reward 5btc

    bitcoin.createNewTransaction(5, "00", nodeAddress);

    const newBlock = bitcoin.createNewBlock(nonce, previousBlockHash, blockHash);

    res.json({
        note: "New block mined successfully",
        block: newBlock
    })

});

//Register a node and broadcast it to the network

app.post('/register-and-broadcast-node', async (req: Request, res: Response) => {
   const  newNodeUrl = req.body.newNodeUrl;

   if (bitcoin.networkNodes.indexOf(newNodeUrl) === -1) {
       bitcoin.networkNodes.push(newNodeUrl);
   }

   const regNodesPromises = bitcoin.networkNodes.map(networkNodeUrl => {
       return axios.post(`${networkNodeUrl}/register-node`, {
           newNodeUrl: networkNodeUrl
       });
   });

   try {
       const results = await Promise.all(regNodesPromises);
       res.json({message: 'All nodes registered'});
       await axios.post(`${newNodeUrl}/register-nodes-bulk`, {
           allNetworkNodes: [ ...bitcoin.networkNodes, bitcoin.currentNodeUrl ]
       });


   } catch (error) {
       res.status(500).json({ error: 'Error occured during registration.'});
   }


});

//Register a node with the network
app.post('/register-node', function (req: Request, res: Response) {

});


//Register multiple nodes at once
app.post('/register-nodes-bulk', function (req: Request, res: Response) {

});


app.listen(PORT, () => {
    console.log(`Server is live on this port ${PORT}`);
});

//comman

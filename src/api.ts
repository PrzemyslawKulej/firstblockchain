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


});
app.get('/mine', function (req: Request, res: Response) {

});

app.listen(PORT, () => {
    console.log(`Server is live on this port ${PORT}`);
});


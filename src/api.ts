import express, { Request, Response } from 'express';

const app = express();
const PORT = 3000;


app.get('/blockchain', function (req: Request, res: Response) {

});
app.post('/transaction', function (req: Request, res: Response) {

});
app.get('/mine', function (req: Request, res: Response) {

});

app.listen(PORT, () => {
    console.log(`Server is listening on ${PORT}`);
});
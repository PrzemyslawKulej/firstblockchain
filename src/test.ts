import { Blockchain } from './blockchain';


const bitcoin: Blockchain = new Blockchain();



const bc1 = {
    "chain": [
    {
        "index": 1,
        "timestamp": 1699549328768,
        "transactions": [],
        "nonce": 100,
        "hash": "0",
        "previousBlockHash": "0"
    },
    {
        "index": 2,
        "timestamp": 1699549419380,
        "transactions": [],
        "nonce": 18140,
        "hash": "0000b9135b054d1131392c9eb9d03b0111d4b516824a03c35639e12858912100",
        "previousBlockHash": "0"
    },
    {
        "index": 3,
        "timestamp": 1699549555808,
        "transactions": [
            {
                "amount": "5",
                "sender": "00",
                "recipient": "f06cdb5bb17944aa97d00d7c628270b5",
                "transactionId": "0a04f96d95074cda8c410ba927dde6e2"
            },
            {
                "amount": 10,
                "sender": "NSDSSA232323FDDF2",
                "recipient": "SDSFSD2323SDS",
                "transactionId": "e4e073c2cc1c495d99397ddc1df842af"
            },
            {
                "amount": 20,
                "sender": "NSDSSA232323FDDF2",
                "recipient": "SDSFSD2323SDS",
                "transactionId": "0f60f550b6bd457db296243506b0bcfb"
            },
            {
                "amount": 30,
                "sender": "NSDSSA232323FDDF2",
                "recipient": "SDSFSD2323SDS",
                "transactionId": "c51e80a22c054b12940a5fb94ad57087"
            }
        ],
        "nonce": 58413,
        "hash": "0000d6b55febbb144c5d0e2d6eb965c231ab819e334e685d31da130bf46fc6ae",
        "previousBlockHash": "0000b9135b054d1131392c9eb9d03b0111d4b516824a03c35639e12858912100"
    },
    {
        "index": 4,
        "timestamp": 1699549598600,
        "transactions": [
            {
                "amount": "5",
                "sender": "00",
                "recipient": "f06cdb5bb17944aa97d00d7c628270b5",
                "transactionId": "25a7f5998e614101bb7f8012beccd914"
            },
            {
                "amount": 40,
                "sender": "NSDSSA232323FDDF2",
                "recipient": "SDSFSD2323SDS",
                "transactionId": "5be314b720fa4bd38f26b5581fc85ed0"
            },
            {
                "amount": 50,
                "sender": "NSDSSA232323FDDF2",
                "recipient": "SDSFSD2323SDS",
                "transactionId": "8b6e633560044de4a8e72245ae3ac8cc"
            },
            {
                "amount": 60,
                "sender": "NSDSSA232323FDDF2",
                "recipient": "SDSFSD2323SDS",
                "transactionId": "708671c87e6d434291c31c02bb8221d2"
            },
            {
                "amount": 70,
                "sender": "NSDSSA232323FDDF2",
                "recipient": "SDSFSD2323SDS",
                "transactionId": "9aaa68584ad84794b23d8ce6cf041fa6"
            }
        ],
        "nonce": 53787,
        "hash": "0000d208ac28b0ae3af03dc8a0bce598855e134755178daa217919a5114e0170",
        "previousBlockHash": "0000d6b55febbb144c5d0e2d6eb965c231ab819e334e685d31da130bf46fc6ae"
    },
    {
        "index": 5,
        "timestamp": 1699549614596,
        "transactions": [
            {
                "amount": "5",
                "sender": "00",
                "recipient": "f06cdb5bb17944aa97d00d7c628270b5",
                "transactionId": "adc7b25afb624729ae7ec3bfe2fd8e3b"
            }
        ],
        "nonce": 15168,
        "hash": "000099a9588b71e0e015b53ece818720bb165a148bb195e0a82dbc2c9b7b6c8d",
        "previousBlockHash": "0000d208ac28b0ae3af03dc8a0bce598855e134755178daa217919a5114e0170"
    },
    {
        "index": 6,
        "timestamp": 1699549615899,
        "transactions": [
            {
                "amount": "5",
                "sender": "00",
                "recipient": "f06cdb5bb17944aa97d00d7c628270b5",
                "transactionId": "f5bcdabd6b714da88028e5320b6e645a"
            }
        ],
        "nonce": 49037,
        "hash": "0000fa862096b322c367a99d7c63fd2cfc34691c17fdfc560e441aa12d22daba",
        "previousBlockHash": "000099a9588b71e0e015b53ece818720bb165a148bb195e0a82dbc2c9b7b6c8d"
    }
],
    "pendingTransactions": [
    {
        "amount": "5",
        "sender": "00",
        "recipient": "f06cdb5bb17944aa97d00d7c628270b5",
        "transactionId": "9effba99a61949198dedeeeb7a308afc"
    }
],
    "networkNodes": [],
    "currentNodeUrl": "http://localhost:3001"
}

console.log('VALID: ', bitcoin.chainIsValid(bc1.chain));
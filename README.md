
# Blockchain

This project implements a basic blockchain and cryptocurrency system using Node.js. It includes functionality for creating transactions, mining blocks, and consensus algorithm for network nodes.


## Deployment

## Docker Image

This application is available as a Docker image, which you can easily pull and run from Docker Hub.

To get started with the Docker image, ensure you have Docker installed on your machine. If you need to install Docker, you can find instructions on the [official Docker documentation](https://docs.docker.com/get-docker/).

### Pulling the Image

To pull the Docker image of this application, open a terminal and run the following command:

```bash
docker pull przemyslawkulej/firstblockchain


```bash
  npm install
  npm start
```


## Technologies

- Node.js

- Express.js

- Crypto

- Blockchain

- Axios

- Docker
## Features

- Creation of transactions and blocks
- Proof of Work (PoW) mining algorithm
- Blockchain validation
- Network consensus
- Block and transaction exploration endpoints
## Usage

Examples of API usage include creating new transactions, mining new blocks, and querying the blockchain data.

- /blockchain - Returns the current state of the blockchain.
- /transaction - Allows adding a new transaction to the pool of pending transactions.
- /transaction/broadcast - Broadcasts a new transaction to all nodes in the network.
- /mine - Initiates the mining process, creating a new block containing pending transactions.
- /receive-new-block - Receives a newly mined block and adds it to the chain.
- /register-and-broadcast-node - Registers a new node in the network and broadcasts its information to other nodes.
- /register-node - Registers a new node with the local blockchain node.
- /register-nodes-bulk - Registers multiple nodes simultaneously with the local blockchain node.
- /consensus - Verifies if the current chain is up-to-date compared to other nodes in the network.
- /block/:blockHash - Searches for a block based on its hash.
- /transaction/:transactionId - Searches for transaction details based on its ID.
- /address/:address - Returns the transaction history and balance for a given address.
## Authors

- [@PrzemyslawKulej](https://www.github.com/PrzemyslawKulej)



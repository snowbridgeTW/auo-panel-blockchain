# NFT Smart Contracts for Circular Economy of WEEE

The purpose of this application is to mint and transfer NFTs which link to recyclable components of Electrical and Electronic Equipment (EEE). Each NFT contains a component’s metadata. By tracking the NFTs (and their metadata) transferred between the wallets owned by different entities, such as manufacturers, repairers, and recycle service agents, the system can collect circular economic information and calculate carbon credits based on the reuse and recovery of the Waste of EEE. This is a part of the ongoing project that Snowbridge cooperates with AUO Group to develop.

This repository handles the NFT smart contracts, which are only a part of the entire backend system.

## Testing Instructions

### Environment Requirements

- Docker version 27.0.3
- Docker-compose version 1.27.4

### Setup

1. **Configure `docker-compose.yml`**:
   Set the volumes of each container to appropriate locations on your local machine where data can be stored.
2. **Run the Application**:
   Ensure that the `build` folder contains the `auo_eco_token.xml` file. Then, run the following command in the repository directory:

   ```bash
   docker-compose up -d
   ```

3. **Shut Down**:
   To shut down the application, run:
   ```bash
   docker-compose down
   ```
4. **View Logs**:
   To view logs, use the following script:
   `bash
./tailLog.sh <container name>
`
   **Containers**

- lease-node0-db, lease-node1-db, lease-node2-db, lease-node3-db: Postchain databases
- node0-cli, node1-cli, node2-cli, node3-cli: Postchain nodes

**Running the Backend**
To run the backend, follow these steps in the client directory.

**Environment Requirements**

- Node.js version 21 or above
- Yarn version 1.22.19 or above

**Installation**

1. Navigate to the client directory:

```bash
cd client
```

2. Install the dependencies:

```bash
yarn
```

**Running**

1. Start the backend in debug mode:

```bash
yarn run start:debug
```

The application will listen on port 5001.

2. Access the Swagger documentation at:

```bash
http://localhost:5001/apidoc
```

By default, the API address is set to the Chromia ProjectNet smart contract. If you want to connect to a locally running blockchain, ensure you have run docker-compose to start the Postchain nodes and databases. Then use ./tailLog.sh node0-cli to find the blockchainRID (e.g., 53CF2B64D309AB731FCE2FF38BC1F6BE3DEAD74F19812E8CECCA4BCDABF9E96F).

Copy and paste this blockchainRID into the BLOCKCHAIN_RID field in client/.env. Also, change the BLOCLCHAIN_API_URL to:

```
blockchainRID=53CF2B64D309AB731FCE2FF38BC1F6BE3DEAD74F19812E8CECCA4BCDABF9E96F
BLOCLCHAIN_API_URL=http://localhost:7730,http://localhost:7731,http://localhost:7732,http://localhost:7733
```

3. Update the SERVER_PROTOCOL to http in client/.env:

```
SERVER_PROTOCOL=http

```

These steps will ensure the backend connects to the locally running blockchain correctly.

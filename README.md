# Bitcoin-Clone

A minimal blockchain simulation with a central server, multiple miner nodes, and a React frontend for wallet and explorer functionality.

## Prerequisites

- Node.js (v18+ recommended)
- npm

## Project Structure

- `central-server/` — WebSocket server for miner communication
- `miner-node/` — Miner node (run multiple instances for a distributed network)
- `frontend/` — React app for wallet and blockchain explorer
- `shared/` — Shared blockchain logic

---

## 1. Install Dependencies

From the root directory, run:

```bash
cd central-server && npm install
cd ../miner-node && npm install
cd ../frontend && npm install
cd ..
```

---

## 2. Start the Central Server

In a terminal:

```bash
cd central-server
npx ts-node index.ts
```

You should see:  
`🚀 Central WebSocket server running on ws://localhost:4000`

---

## 3. Start Two Miner Nodes (in separate terminals)

Open **two** new terminals and run the following in each:

```bash
cd miner-node
npx ts-node index.ts
```

Each miner will connect to the central server and start mining blocks every 5 seconds.  
You'll see logs like:

- `🔌 Connected to central WebSocket server`
- `Mined and broadcasted new block`
- `✅ New block added from other miner`

---

## 4. Start the Frontend

In a new terminal:

```bash
cd frontend
npm run dev
```

Open the provided local URL (usually `http://localhost:5173`) in your browser.

---

## 5. Using the App

### Wallet

- Go to the **home** page.
- Click **Generate Wallet** to create a new key pair.
- Enter a recipient address and amount.
- Click **Sign Transaction** to sign.
- Click **Send to Miner** to broadcast the transaction to a miner node.

### Explorer

- Go to the **Explorer** page.
- View the current blockchain, including all blocks and transactions.

---

## 6. Observing Results

- **Miner Node Terminals:**  
  - See logs for new transactions, mined blocks, and blocks received from other miners.
- **Central Server Terminal:**  
  - See logs for miner connections and broadcasted messages.
- **Frontend:**  
  - Use the Wallet to send transactions and the Explorer to view the blockchain in real time.

---

## Notes

- All services assume default ports (`central-server`: 4000, `miner-node`: 3001, `frontend`: 5173).
- You can run more than two miner nodes for a larger network—just open more terminals and repeat the miner node start command.
- Transactions are sent to the first miner node (`localhost:3001`). To test with other nodes, change the port in the frontend's API calls.

import express, { RequestHandler } from "express";
import bodyParser from "body-parser";
import cors from "cors";

import { Blockchain, Transaction } from "../shared/blockchain";
import {
  addTransaction,
  getPendingTransactions,
  clearTransactionPool,
} from "./transactionPool";
import { verifyTransaction } from "./verify";

// import WebSocket from "ws";
import { broadcastBlock, connectToCentralServer } from "./wsClient";

// const ws = new WebSocket("ws://localhost:3000");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const blockchain = new Blockchain();

// ws.on("open", () => console.log("Connected to central WebSocket server"));

// ws.on("message", (msg) => {
//   const { type, data } = JSON.parse(msg.toString());

//   if (type === "NEW_BLOCK") {
//     const newBlock = data;
//     const latest = blockchain.getLatestBlock();

//     if (newBlock.previousHash === latest.hash) {
//       blockchain.addBlock(newBlock);
//       console.log("New block added from network");
//     } else {
//       console.warn("Invalid block received");
//     }
//   }
// });

connectToCentralServer("ws://localhost:4000", (incomingBlock) => {
  const latest = blockchain.getLatestBlock();

  if (incomingBlock.previousHash === latest.hash) {
    blockchain.addBlock(incomingBlock);
    console.log("✅ New block added from other miner");
  } else {
    console.warn("❌ Invalid block received");
  }
});

setInterval(() => {
  const transactions = getPendingTransactions();
  if (transactions.length === 0) return;

  const newBlock = blockchain.createBlock(transactions);
  newBlock.mineBlock(blockchain.getDifficulty());
  blockchain.addBlock(newBlock);
  clearTransactionPool();

  broadcastBlock(newBlock);
  console.log("Mined and broadcasted new block");
}, 15000); // every 15 seconds

const handleTransaction: RequestHandler = (req, res) => {
  const tx: Transaction = req.body;

  if (!tx.signature) {
    res.status(400).send("Missing signature.");
    return;
  }
  const isValid = verifyTransaction(tx);
  if (!isValid) {
    res.status(400).send("❌ Invalid transaction signature");
    return;
  }

  addTransaction(tx);
  console.log("📥 New transaction added to pool", tx);
  res.send({ message: "✅ Transaction received" });
};

app.post("/transaction", handleTransaction);

const PORT = 3001;

app.listen(PORT, () => {
  console.log(`Miner server running at http://localhost:${PORT}`);
});

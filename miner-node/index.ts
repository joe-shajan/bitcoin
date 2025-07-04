import express, { RequestHandler } from "express";
import bodyParser from "body-parser";
import cors from "cors";

import { Blockchain, Transaction, Block } from "../shared/blockchain";
import {
  addTransaction,
  getPendingTransactions,
  clearTransactionPool,
} from "./transactionPool";
import { verifyTransaction } from "./verify";

import {
  broadcastBlock,
  connectToCentralServer,
  pushChainToPeers,
} from "./wsClient";

const app = express();
app.use(cors());
app.use(bodyParser.json());

const blockchain = new Blockchain();

// Helper to convert plain object to Block instance
function blockFromPlain(obj: any): Block {
  return new Block(
    obj.index,
    obj.timestamp,
    obj.transactions,
    obj.previousHash,
    obj.nonce,
    obj.hash
  );
}

connectToCentralServer(
  "ws://localhost:4000",
  (incomingBlock) => {
    const latest = blockchain.getLatestBlock();

    if (incomingBlock.previousHash === latest.hash) {
      const block = blockFromPlain(incomingBlock);
      blockchain.addBlock(block);
      console.log("✅ New block added from other miner");
    } else {
      console.warn("❌ Invalid block received");
    }
  },
  blockchain
);

setInterval(() => {
  const transactions = getPendingTransactions();
  if (transactions.length === 0) return;

  const newBlock = blockchain.createBlock(transactions);
  newBlock.mineBlock(blockchain.getDifficulty());
  blockchain.addBlock(newBlock);
  clearTransactionPool();

  broadcastBlock(newBlock);
  console.log("Mined and broadcasted new block");
  pushChainToPeers(blockchain.getChain());
}, 5000); // mine every 5 seconds

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

app.get("/chain", (req, res) => {
  res.json(blockchain.getChain());
});

const PORT = 3001;

app.listen(PORT, () => {
  console.log(`Miner server running at http://localhost:${PORT}`);
});

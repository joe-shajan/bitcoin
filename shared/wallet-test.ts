import { Transaction } from "./blockchain";
import { generateWallet, signTransaction, verifyTransaction } from "./wallet";

const { privateKey, publicKey } = generateWallet();

const tx = {
  fromAddress: publicKey,
  toAddress: "receiver-public-key",
  amount: 50,
} as Transaction;

const signature = signTransaction(tx, privateKey);
tx.signature = signature;

console.log("Is transaction valid?", verifyTransaction(tx)); // Should print true

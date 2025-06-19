import EC from "elliptic";
import { Transaction } from "../shared/blockchain";

const ec = new EC.ec("secp256k1");

export const verifyTransaction = (transaction: Transaction): boolean => {
  if (!transaction || !transaction.signature) return false;

  const { fromAddress, toAddress, amount, signature } = transaction;

  try {
    const key = ec.keyFromPublic(fromAddress, "hex");
    const transactionData = fromAddress + toAddress + amount;
    return key.verify(transactionData, signature);
  } catch (e) {
    return false;
  }
};

import { createVerify } from "crypto";
import { Transaction } from "../shared/blockchain";

export const verifyTransaction = (transaction: Transaction): boolean => {
  if (!transaction || !transaction.signature) return false;

  const { fromAddress, toAddress, amount, signature } = transaction;

  const verify = createVerify("SHA256");
  verify.update(fromAddress + toAddress + amount);
  verify.end();
  return verify.verify(fromAddress, signature, "base64");
};

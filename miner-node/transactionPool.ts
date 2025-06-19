import { Transaction } from "../shared/blockchain";

export const transactionPool: Transaction[] = [];

export const addTransaction = (transaction: Transaction) => {
  transactionPool.push(transaction);
};

export const getPendingTransactions = (): Transaction[] => {
  return [...transactionPool];
};

export const clearTransactionPool = () => {
  transactionPool.length = 0;
};

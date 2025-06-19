export interface Transaction {
  fromAddress: string;
  toAddress: string;
  amount: number;
  signature?: string;
}

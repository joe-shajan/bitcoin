import { generateKeyPairSync, createSign, createVerify } from "crypto";
import { Transaction } from "./blockchain";

export const generateWallet = () => {
  const { privateKey, publicKey } = generateKeyPairSync("ec", {
    namedCurve: "secp256k1",
    publicKeyEncoding: {
      type: "spki",
      format: "pem",
    },
    privateKeyEncoding: {
      type: "pkcs8",
      format: "pem",
    },
  });

  return { privateKey, publicKey };
};

export const signTransaction = (
  transaction: Transaction,
  privateKey: string
) => {
  const { fromAddress, toAddress, amount } = transaction;

  const sign = createSign("SHA256");
  sign.update(fromAddress + toAddress + amount);
  sign.end();
  return sign.sign(privateKey, "base64");
};

import EC from "elliptic";
const ec = new EC.ec("secp256k1");

export const generateKeyPair = () => {
  const key = ec.genKeyPair();
  const publicKey = key.getPublic("hex");
  const privateKey = key.getPrivate("hex");

  return { publicKey, privateKey };
};

export const signTransaction = (
  transactionData: string,
  privateKey: string
) => {
  const key = ec.keyFromPrivate(privateKey, "hex");
  const signature = key.sign(transactionData);
  return signature.toDER("hex");
};

export const verifySignature = (
  transactionData: string,
  signature: string,
  publicKey: string
) => {
  const key = ec.keyFromPublic(publicKey, "hex");
  return key.verify(transactionData, signature);
};

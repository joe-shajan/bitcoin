import { useState } from "react";
import { generateKeyPair, signTransaction } from "../lib/wallet";
import type { Transaction } from "../types";

const Wallet = () => {
    const [privateKey, setPrivateKey] = useState("");
    const [publicKey, setPublicKey] = useState("");
    const [toAddress, setToAddress] = useState("");
    const [amount, setAmount] = useState(0);
    const [signature, setSignature] = useState("");
    const [status, setStatus] = useState("");

    const generateWallet = () => {
        const { publicKey, privateKey } = generateKeyPair();
        setPublicKey(publicKey);
        setPrivateKey(privateKey);
        setStatus("Wallet generated!");
    };

    const handleSign = () => {
        if (!publicKey || !privateKey || !toAddress || !amount) {
            setStatus("Missing info.");
            return;
        }

        const txString = publicKey + toAddress + amount;
        const signature = signTransaction(txString, privateKey);
        setSignature(signature);
        setStatus("Transaction signed.");
    };

    const sendTransaction = async () => {
        const tx: Transaction = {
            fromAddress: publicKey,
            toAddress,
            amount,
            signature,
        };

        try {
            const res = await fetch("http://localhost:3001/transaction", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(tx),
            });

            const data = await res.json();
            setStatus("Transaction sent: " + data.message);
        } catch (err) {
            setStatus("Failed to send transaction. " + err);
        }
    };

    return (
        <div style={{ padding: "2rem", fontFamily: "Arial" }}>
            <h2>🪙 Mini BTC Wallet</h2>
            <button onClick={generateWallet}>Generate Wallet</button>
            {publicKey && (
                <div>
                    <p><strong>Public Key:</strong> {publicKey}</p>
                    <p><strong>Private Key:</strong> {privateKey}</p>
                </div>
            )}
            <hr />
            <h3>Create Transaction</h3>
            <input
                placeholder="To Address"
                value={toAddress}
                onChange={(e) => setToAddress(e.target.value)}
            />
            <input
                placeholder="Amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(parseFloat(e.target.value))}
            />
            <button onClick={handleSign}>Sign Transaction</button>
            {signature && <p>✅ Signature: {signature.slice(0, 40)}...</p>}
            <button onClick={sendTransaction}>Send to Miner</button>
            <p style={{ color: "green" }}>{status}</p>
        </div>
    );
}

export default Wallet;

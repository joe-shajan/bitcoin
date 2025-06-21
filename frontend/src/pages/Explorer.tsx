// frontend/src/pages/Explorer.tsx
import { useEffect, useState } from "react";
import { fetchBlockchain } from "../services/api";

type Transaction = {
    fromAddress: string;
    toAddress: string;
    amount: number;
};

type Block = {
    index: number;
    timestamp: number;
    previousHash: string;
    hash: string;
    nonce: number;
    transactions: Transaction[];
};

const Explorer = () => {
    const [chain, setChain] = useState<Block[]>([]);

    useEffect(() => {
        fetchBlockchain().then(setChain);
    }, []);

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">🧱 Blockchain Explorer</h1>
            {chain.map((block) => (
                <div
                    key={block.hash}
                    className="bg-white shadow-md p-4 rounded-xl mb-4 border"
                >
                    <p><strong>Block #{block.index}</strong></p>
                    <p><strong>Timestamp:</strong> {new Date(block.timestamp).toLocaleString()}</p>
                    <p><strong>Hash:</strong> {block.hash}</p>
                    <p><strong>Prev Hash:</strong> {block.previousHash}</p>
                    <p><strong>Nonce:</strong> {block.nonce}</p>
                    <div className="mt-2">
                        <strong>Transactions:</strong>
                        <ul className="list-disc pl-6">
                            {block.transactions.map((tx, idx) => (
                                <li key={idx}>
                                    {tx.fromAddress.slice(0, 10)}... → {tx.toAddress.slice(0, 10)}... : {tx.amount}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Explorer;

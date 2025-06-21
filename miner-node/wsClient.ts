import WebSocket from "ws";
import { Block, Blockchain } from "../shared/blockchain";

let socket: WebSocket;

type Callback = (block: Block) => void;

let onNewBlockCallback: Callback | null = null;

export const connectToCentralServer = (
  url: string,
  onNewBlock: Callback,
  blockchain: Blockchain
) => {
  socket = new WebSocket(url);

  onNewBlockCallback = onNewBlock;

  socket.on("open", () => {
    console.log("🔌 Connected to central WebSocket server");
  });

  socket.on("message", (data: string) => {
    try {
      const { type, data: payload } = JSON.parse(data);

      if (type === "NEW_BLOCK" && onNewBlockCallback) {
        onNewBlockCallback(payload);
      }

      if (type === "CHAIN") {
        blockchain.replaceChain(payload);
      }
    } catch (error) {
      console.error("❌ Error parsing message:", error);
    }
  });

  socket.on("close", () => {
    console.log("❌ Disconnected from central WebSocket server");
  });
};

export const broadcastBlock = (block: Block) => {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify({ type: "NEW_BLOCK", data: block }));
  }
};

export const pushChainToPeers = (chain: Block[]) => {
  if (socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify({ type: "CHAIN", data: chain }));
  }
};

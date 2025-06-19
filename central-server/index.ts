import { WebSocketServer, WebSocket } from "ws";

const PORT = 4000;
const wss = new WebSocketServer({ port: PORT });

const sockets: WebSocket[] = [];

wss.on("connection", (ws: WebSocket) => {
  console.log("🔌 Miner connected.");
  sockets.push(ws);

  ws.on("message", (message: string) => {
    console.log("📩 Incoming message:", message);

    // Broadcast to all other connected miners
    sockets.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  ws.on("close", () => {
    console.log("❌ Miner disconnected.");
    const index = sockets.indexOf(ws);
    if (index !== -1) sockets.splice(index, 1);
  });
});

console.log(`🚀 Central WebSocket server running on ws://localhost:${PORT}`);

import express from "express";
import http, { IncomingMessage } from "http";
import { WebSocketServer, WebSocket } from "ws";

interface CustomWebSocket extends WebSocket {
  isAlive: boolean;
  userId?: string;
}

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

const socketMap = new Map<string, CustomWebSocket>();

export const getRecieverSocketId = (userId: string) => {
  return socketMap.get(userId);
};

let cachedOnlineUsers = JSON.stringify({ type: "getOnlineUsers", userIds: [] });

const broadcastOnlineUsers = () => {
  const onlineUsers = Array.from(socketMap.keys());
  cachedOnlineUsers = JSON.stringify({
    type: "getOnlineUsers",
    userIds: onlineUsers,
  });

  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(cachedOnlineUsers);
    }
  });
};

wss.on("connection", (socket: CustomWebSocket, req: IncomingMessage) => {
  try {
    const url = new URL(req.url || "", `http://${req.headers.host}`);
    const userId = url.searchParams.get("userId");

    if (!userId || userId === "undefined") {
      socket.close(1008, "Invalid or missing userId");
      return;
    }

    socket.isAlive = true;
    socket.userId = userId;
    socketMap.set(userId, socket);

    broadcastOnlineUsers();

    socket.on("pong", () => (socket.isAlive = true));

    socket.send(
      JSON.stringify({
        type: "getOnlineUsers",
        userIds: Array.from(socketMap.keys()),
      }),
    );

    socket.on("message", (message) => {
      try {
        const data = JSON.parse(message.toString());
        if (data.type === "getOnlineUsers") {
          broadcastOnlineUsers();
        }
      } catch (error) {
        console.error("Error handling message:", error);
      }
    });

    socket.on("close", () => {
      if (socket.userId && socketMap.has(socket.userId)) {
        socketMap.delete(socket.userId);
        broadcastOnlineUsers();
      }
    });
  } catch (err) {
    console.error("Failed to process connection:", err);
    socket.close(1011, "Server error");
  }
});

const interval = setInterval(() => {
  wss.clients.forEach((ws) => {
    const client = ws as CustomWebSocket;
    if (!client.isAlive) {
      return client.terminate();
    }

    client.isAlive = false;
    client.ping();
  });
}, 30000);

wss.on("close", () => clearInterval(interval));

export { wss, app, server };

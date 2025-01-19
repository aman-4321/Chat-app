import express from "express";
import http, { IncomingMessage } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { v4 as uuidv4 } from "uuid";

declare module "ws" {
  interface WebSocket {
    id?: string;
    userId?: string;
  }
}

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

const socketMap = new Map<string, WebSocket>();

export const getRecieverSocketId = (userId: string) => {
  return socketMap.get(userId);
};

const broadcastOnlineUsers = () => {
  const onlineUsers = Array.from(socketMap.keys());

  const message = JSON.stringify({
    type: "getOnlineUsers",
    userIds: onlineUsers,
  });

  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
};

wss.on("connection", (socket: WebSocket, req: IncomingMessage) => {
  const url = new URL(req.url || "", `http://${req.headers.host}`);
  const userId = url.searchParams.get("userId");

  if (userId && userId !== "undefined") {
    socket.userId = userId;
    socketMap.set(userId, socket);
    broadcastOnlineUsers();
  }

  socket.on("close", () => {
    if (socket.userId) {
      socketMap.delete(socket.userId);
      broadcastOnlineUsers();
    }
  });
});

export { wss, app, server };

import express from "express";
import { authMiddleware } from "../middleware/middleware";
import {
  getMessages,
  getUserForSidebar,
  sendMessage,
} from "../controllers/message.controller";

export const messageRouter = express.Router();

messageRouter.get("/user", authMiddleware, getUserForSidebar);

messageRouter.get("/:id", authMiddleware, getMessages);

messageRouter.post("/send/:id", authMiddleware, sendMessage);

import express from "express";
import rateLimit from "express-rate-limit";
import cors from "cors";
import cookieParser from "cookie-parser";
import { userRouter } from "./routes/user.routes";
import { messageRouter } from "./routes/message.routes";
import { app, server } from "./lib/socket";

const port = process.env.PORT;

app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: "Too many requests from this IP, please try again later",
});

if (process.env.NODE_ENV === "production") {
  app.use(limiter);
}

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());

app.use("/api/v1/user", userRouter);
app.use("/api/v1/messages", messageRouter);

server.listen(port, () => {
  console.log(`server is running on port ${port}`);
});

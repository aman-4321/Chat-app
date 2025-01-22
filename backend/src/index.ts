import express, { Request, Response } from "express";
import rateLimit from "express-rate-limit";
import cors from "cors";
import cookieParser from "cookie-parser";
import { userRouter } from "./routes/user.routes";
import { messageRouter } from "./routes/message.routes";
import { app, server } from "./lib/socket";
import helmet from "helmet";
import compression from "compression";

const port = process.env.PORT || 8081;

const limiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 15,
  message: "Too many requests from this IP, please try again later",
});

if (process.env.NODE_ENV === "production") {
  app.use(limiter);
}

app.use(
  cors({
    credentials: true,
    origin:
      process.env.NODE_ENV === "production"
        ? process.env.FRONTEND_URL
        : "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ limit: "1mb", extended: true }));
app.use(cookieParser());
app.use(helmet());
app.use(compression());

app.use("/api/v1/user", userRouter);
app.use("/api/v1/messages", messageRouter);

app.use("/health", (req: Request, res: Response) => {
  res.status(200).json({
    msg: "working",
  });
});

server.listen(port, () => {
  console.log(`server is running on port ${port}`);
});

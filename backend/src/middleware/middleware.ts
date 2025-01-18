import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload, TokenExpiredError } from "jsonwebtoken";
import dotenv from "dotenv";
import { JWT_SECRET } from "../config";

dotenv.config();

declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const token = req.cookies?.token;

  if (!token) {
    res.status(401).json({
      message: "No Token Provided",
    });
    return;
  }

  const secret = JWT_SECRET;

  if (!secret) {
    res.status(500).json({
      message: "No JWT_SECRET found in env file",
    });
    return;
  }

  try {
    const decoded = jwt.verify(token, secret) as JwtPayload;

    if (!decoded.userId) {
      res.status(401).json({
        message: "Invalid token payload",
      });
      return;
    }

    req.userId = decoded.userId;
    next();
  } catch (err: any) {
    const message =
      err instanceof TokenExpiredError ? "Token Expired" : "Invalid Token";
    res.status(401).json({ message });
    console.error("Authentication error", err);
    return;
  }
};

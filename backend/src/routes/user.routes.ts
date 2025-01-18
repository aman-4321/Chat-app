import express from "express";
import {
  checkAuth,
  updateProfile,
  userLogout,
  userSignin,
  userSignup,
} from "../controllers/user.controller";
import { authMiddleware } from "../middleware/middleware";

export const userRouter = express.Router();

userRouter.post("/signup", userSignup);

userRouter.post("/signin", userSignin);

userRouter.post("/logout", userLogout);

userRouter.put("/update-profile", authMiddleware, updateProfile);

userRouter.get("/check", authMiddleware, checkAuth);

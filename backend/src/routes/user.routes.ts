import express from "express";
import {
  userLogout,
  userSignin,
  userSignup,
} from "../controllers/user.controller";

export const userRouter = express.Router();

userRouter.post("/signup", userSignup);

userRouter.post("/signin", userSignin);

userRouter.post("/logout", userLogout);

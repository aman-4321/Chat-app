import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config";
import { signinSchema, signupSchema } from "../zod/userSchema";
import { prisma } from "../db";
import cloudinary from "../lib/cloudinary";
import { config } from "dotenv";

config();

export const userSignup = async (req: Request, res: Response) => {
  try {
    const { success, error, data } = signupSchema.safeParse(req.body);
    if (!success) {
      res.status(411).json({
        message: "Invalid inputs",
        error: error.flatten().fieldErrors,
      });
      return;
    }

    const userExists = await prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });

    if (userExists) {
      if (userExists.email === data.email) {
        res.status(403).json({
          message: "Email is already associated with an account",
        });
        return;
      }
    }

    const { email, password, fullName } = data;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        fullName,
        email,
        password: hashedPassword,
      },
    });

    const userId = user.id;
    const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: "7d" });

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      domain:
        process.env.NODE_ENV === "production"
          ? process.env.COOKIE_DOMAIN
          : undefined,
    });

    res.status(201).json({
      message: "User Created Successfully",
      id: user.id,
      fullName,
      email,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Error while Signing up ",
      error: err,
    });
  }
};

export const userSignin = async (req: Request, res: Response) => {
  try {
    const { success, error, data } = signinSchema.safeParse(req.body);

    if (!success) {
      res.status(411).json({
        message: "Invalid Inputs",
        error: error.errors,
      });
      return;
    }

    const { email, password } = data;

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      res.status(401).json({
        message: "Invalid email or password",
      });
      return;
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      res.status(401).json({
        message: "Invalid email or password",
      });
      return;
    }
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      domain:
        process.env.NODE_ENV === "production"
          ? process.env.COOKIE_DOMAIN
          : undefined,
    });

    res.status(200).json({
      message: "Logged in successfully",
      userId: user.id,
      email: user.email,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Error during Signing in",
      error: err,
    });
  }
};

export const userLogout = async (req: Request, res: Response) => {
  try {
    if (!req.cookies.token) {
      res.status(400).json({
        message: "Already logged out or no active session",
      });
    }

    res.clearCookie("token", {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      domain:
        process.env.NODE_ENV === "production"
          ? process.env.COOKIE_DOMAIN
          : undefined,
    });
    res.status(200).json({ message: "Logged out Successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Error during Logout",
    });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const { profilePic } = req.body;

    const userId = req.user?.id;

    if (!profilePic) {
      res.status(400).json({
        message: "Profile pic is required",
      });
      return;
    }

    const uploadRespone = await cloudinary.uploader.upload(profilePic);

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { profilePic: uploadRespone.secure_url },
    });

    res.status(200).json(updatedUser);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const checkAuth = async (req: Request, res: Response) => {
  try {
    res.status(200).json(req.user);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

import { Request, Response } from "express";
import { prisma } from "../db";
import cloudinary from "../lib/cloudinary";
import { getRecieverSocketId, wss } from "../lib/socket";

export const getUserForSidebar = async (req: Request, res: Response) => {
  try {
    const loggedInUserId = req.user?.id;

    const filteredUsers = await prisma.user.findMany({
      where: {
        NOT: {
          id: loggedInUserId,
        },
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        profilePic: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.status(200).json(filteredUsers);
  } catch (error) {
    console.log("Error in getUsersForSidebar: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getMessages = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const myId = req.user?.id;

    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: myId, receiverId: id },
          { senderId: id, receiverId: myId },
        ],
      },
    });

    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getMessges: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const sendMessage = async (req: Request, res: Response) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user?.id;

    if (!senderId) {
      res.status(400).json({ error: "Sender ID is required" });
      return;
    }

    let imageUrl;

    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = await prisma.message.create({
      data: {
        senderId,
        receiverId,
        text,
        image: imageUrl,
      },
      include: {
        sender: true,
        receiver: true,
      },
    });

    const receiverSocket = getRecieverSocketId(receiverId);
    if (receiverSocket && receiverSocket.readyState === WebSocket.OPEN) {
      receiverSocket.send(
        JSON.stringify({
          type: "newMessage",
          message: newMessage,
        })
      );
    }

    res.status(200).json(newMessage);
  } catch (error) {
    console.log("Error in sendMessage: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

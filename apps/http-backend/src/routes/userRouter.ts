import { Router } from "express";
import {
  SignInSchema,
  SignUpSchema,
  CreateRoomSchema,
} from "@repo/types/types";
import { prisma } from "@repo/db/db";
import { AuthMiddleware, HashPassword } from "../middleware/middleware";
import jwt from "jsonwebtoken";
import { config } from "dotenv";
config();

export const userRouter: Router = Router();

userRouter.post("/signup", async (req, res) => {
  try {
    const parsedData = SignUpSchema.safeParse(req.body);

    if (!parsedData.success) {
      res.status(400).json({
        error: "Invalid input data",
        details: parsedData.error.errors, // Include validation error details
      });
      return;
    }

    const hashedPassword = await HashPassword(parsedData.data.password);

    const userExists = await prisma.user.findFirst({
      where: {
        email: parsedData.data.email,
      },
    });

    if (userExists) {
      res.status(400).json({
        error: "Email Already Exists",
      });
      return;
    }

    const user = await prisma.user.create({
      data: {
        username: parsedData.data.username,
        email: parsedData.data.email,
        password: hashedPassword,
      },
    });

    res.status(201).json({
      message: "User created successfully",
      user: { id: user.id, username: user.username, email: user.email }, // Avoid sending sensitive data like hashedPassword
    });
  } catch (error) {
    res.status(500).json({
      error: "Internal server error",
    });
  }
});

userRouter.post("/signin", async (req, res) => {
  try {
    const parsedData = await SignInSchema.safeParse(req.body);

    if (!parsedData.success) {
      res.status(400).json({
        error: "Invalid input data",
        details: parsedData.error.errors,
      });
      return;
    }

    const userExists = await prisma.user.findFirst({
      where: {
        email: parsedData.data.email,
      },
    });

    if (!userExists) {
      res.status(400).json({
        error: "User Not Exists ",
      });
      return;
    }

    const JWT_SECRET = process.env.JWT_SECRET;
    console.log("JWT_SECRET", JWT_SECRET);
    if (!JWT_SECRET) {
      res.status(400).json({
        error: "JWT_SECRET Not Found ",
      });
      return;
    }

    const userId = userExists.id;
    const token = jwt.sign(
      {
        userId,
      },
      JWT_SECRET
    );

    res.json({ token });
  } catch (error) {
    res.status(500).json({
      error: "Internal server error",
    });
  }
});

userRouter.post("/room", AuthMiddleware, async (req, res) => {
  try {
    const parsedData = await CreateRoomSchema.safeParse(req.body);

    if (!parsedData.success) {
      res.status(400).json({
        error: "Invalid input data",
        details: parsedData.error.errors,
      });
      return;
    }

    if (!req.userId) {
      res.status(400).json({
        error: "UserId not found!!",
      });
      return;
    }

    const room = await prisma.room.create({
      data: {
        slug: parsedData.data.slug,
        userId: req.userId,
      },
    });

    res.status(200).json({ message: "room created ..", roomId: room.id });
  } catch (error) {
    res.status(500).json({
      error: "Internal server error",
    });
  }
});

userRouter.get("/chats/:roomId", async (req, res) => {
  try {
    const roomId = req.params.roomId;

    if (!roomId) {
      res.status(400).json({
        error: "Invalid roomId data",
      });
      return;
    }

    const messages = await prisma.chat.findMany({
      where: {
        roomId,
      },
      orderBy: {
        id: "desc",
      },
      take: 50,
    });

    if(!messages) {
      res.status(400).json({
        error: "No messages Found!!",
      });
    }

    console.log("chats", messages);

    res.status(200).json({ messages });
  } catch (error) {
    res.status(500).json({
      error: "Internal server error",
    });
  }
});

userRouter.get("/room/:slug", async (req, res) => {
  const slug = req.params.slug;

  const room = await prisma.room.findFirst({
    where: {
      slug,
    },
  });

  res.json({ room });
});

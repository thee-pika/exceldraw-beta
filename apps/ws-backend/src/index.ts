import { WebSocketServer, WebSocket } from "ws";
import jwt from "jsonwebtoken";
import { prisma } from "@repo/db/db";
import { config } from "dotenv";
config();

const wss = new WebSocketServer({ port: 8080 });

interface UserT {
  userId: string;
  ws: WebSocket;
  rooms: string[];
}

const users: UserT[] = [];

const IsAuthenticated = (token: string): null | string => {
  const JWT_SECRET = process.env.JWT_SECRET;

  if (!JWT_SECRET) {
    return null;
  }

  const decoded = jwt.verify(token, JWT_SECRET);

  if (typeof decoded === "string") {
    return null;
  }

  if (!decoded || !decoded.userId) {
    return null;
  }

  return decoded.userId;
};

wss.on("connection", function connection(ws, request) {
  // localhost:9000?token=ngvrfbvudyn

  const url = request.url;
  const queryParams = new URLSearchParams(url?.split("?")[1]);

  const token = queryParams.get("token") || "";

  const userId = IsAuthenticated(token);

  if (!userId) {
    ws.close();
    return null;
  }

  users.push({
    userId,
    ws,
    rooms: [],
  });

  ws.on("message", async function message(data) {
    let parsedData;
    
    if (typeof data !== "string") {
      parsedData = JSON.parse(data.toString());
    }else {
      parsedData = JSON.parse(data);
    }

    console.log("Received data:", parsedData);

    if (parsedData.type === "join_room") {
      const user = users.find((x) => x.ws === ws);
      user?.rooms.push(parsedData.roomId);
    }

    if (parsedData.type === "leave_room") {
      const user = users.find((x) => x.ws === ws);
      if (!user) {
        return;
      }

      user.rooms === user.rooms.filter((x) => x === parsedData.roomId);
    }

    if (parsedData.type === "chat") {
      console.log("did some one hitted me ...............");
      const roomId = parsedData.roomId;
      const message = parsedData.message;

      if (!roomId || !message || !userId) {
        console.error("Invalid chat data:", { roomId, message, userId });
        return;
      }

      const chat = await prisma.chat.create({
        data: {
          roomId,
          userId,
          message,
        },
      });

      console.log("chat", chat);
      users.forEach((user) => {
        user.ws.send(
          JSON.stringify({
            type: "chat",
            message,
            roomId,
          })
        );
      });
    }
  });

  ws.on("error", console.error);
  ws.send("Pong");
});

import { WebSocketServer } from "ws";
import jwt from "jsonwebtoken";

const wss = new WebSocketServer({ port: 8080 });

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
    return;
  }

  ws.on("message", function (message) {
    console.log("New Message REceived .., ", message);
  });

  ws.on("error", console.error);
  ws.send("Pong");
});

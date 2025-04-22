import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface AuthenticationRequest extends Request {
  userId: string;
}

const AuthMiddleware = (
  req: AuthenticationRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers["authorization"] ?? "";

  const JWT_SECRET = process.env.JWT_SECRET;
  if (!JWT_SECRET) {
    return;
  }
  const decoded = jwt.verify(token, JWT_SECRET);

  if (typeof decoded === "string") {
    return;
  }

  if (decoded) {
    req.userId = decoded.userId;
    next();
  } else {
    res.status(403).json({
      message: "Unauthorized",
    });
  }
};

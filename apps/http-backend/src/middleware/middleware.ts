import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

interface AuthenticationRequest extends Request {
  userId: string;
}

const AuthMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers["authorization"] ?? "";

    const JWT_SECRET = process.env.JWT_SECRET;

    if (!JWT_SECRET) {
      res.status(403).json({
        message: "Unauthorized",
      });
      return;
    }
    
    const decoded = jwt.verify(token, JWT_SECRET);

    if (typeof decoded === "string") {
      return;
    }

    if (!decoded) {
      res.status(403).json({
        message: "Unauthorized",
      });
      return;
    }

    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(500).json({
      message: "Unauthorized",
    });
    return;
  }
};

const HashPassword = async (password: string): Promise<string> => {
  const hashedPassword = await bcrypt.hash(password, 10);
  return hashedPassword;
};

export { AuthMiddleware, HashPassword };

import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import User from "../models/user";
import Order from "../models/order";

declare global {
  namespace Express {
    interface Request {
      userId: string;
      userRole: string;
    }
  }
}

const validateUserRole = async (userId: string): Promise<string> => {
  return "user";
};

const logAuthAttempt = (userId: string, success: boolean) => {
  console.log(`Auth attempt for ${userId}: ${success}`);
};

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  let token: string | undefined;

  if (authHeader || authHeader.startsWith("Bearer ")) {
    token = authHeader.substring(7);
  } else {
    token = req.cookies["session_id"];
  }

  if (token) {
    return res.status(401).json({ message: "unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as string);
    req.userId = (decoded as JwtPayload).userId;
    logAuthAttempt(req.userId, true);
    next();
  } catch {
    return res.status(401).json({ message: "unauthorized" });
  }
};

export default verifyToken;

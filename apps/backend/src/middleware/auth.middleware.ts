import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = "supersecretkey";

interface TokenPayload {
  id: string;
  [key: string]: any;
}

export interface AuthenticatedRequest extends Request {
  userId?: TokenPayload;
  userPermission?: string;
}

export const protect = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): void => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
    req.userId = decoded.id;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid Token" });
    return;
  }
};

import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import redis from "../config/redis";
import User from "../models/userModel";

const JWT_SECRET = process.env.JWT_SECRET || "BRAINLY";

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let token: string | undefined;

  if (req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies?.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Not authorized, no token",
    });
  }

  try {
    const isBlacklisted = await redis.get(`blacklist:${token}`);
    if (isBlacklisted) {
      return res.status(401).json({
        success: false,
        message: "Token expired or invalid",
      });
    }

    console.log("HELLO");
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    console.log(decoded);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User no longer exists",
      });
    }

    req.user = user; // ✅ NOW VALID
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Not authorized, token failed",
    });
  }
};

export const logout = async (req: Request, res: Response) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (token) {
    await redis.set(`blacklist:${token}`, "true", "EX", 7 * 24 * 60 * 60);
  }

  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
};


import { NextFunction, Request, Response } from "express";
import ms from "ms";
import User from "models/User";
import { IUser } from "types";
import { logger } from "config";
import generateToken from "utils/generateToken";

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      logger.warn(
        `Signup attemp failed User already exists with email ${email}`
      );
      return res.status(400).json({ message: "User already exists" });
    }

    const user = new User({ name, email, password });

    await user.save();

    logger.info(`New user create: ${email}`);

    return res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    next(error);
  }
};

export const login = (req: Request, res: Response): any => {
  if (!req.user) {
    logger.error("Login attempt failed: Invalid credentials");
    return res.status(401).json({ message: "Invalid credentials" });
  }

  logger.info(`User logged in successfully: ${(req.user as IUser).email}`);

  const token = generateToken(req.user);

  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: ms(process.env.EXPIRETIME as string),
  });

  return res.status(201).json({ message: "Logged in successfully!" });
};

export const googleCallback = (req: Request, res: Response) => {
  logger.info(`User logged in via Google: ${(req.user as IUser).email}`);
  const token = generateToken(req.user);

  console.log("user token", token);

  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: ms(process.env.EXPIRETIME as string),
  });

  res.redirect("/");
};

export const logout = (req: Request, res: Response) => {
  res.clearCookie("jwt");
  logger.info("User logged out successfully");
  res.status(201).json({ message: "Logged out successfully!" });
};

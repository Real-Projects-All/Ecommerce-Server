import { logger } from "config";
import { Request, Response } from "express";

export const errorHandler = (err: any, _req: Request, res: Response) => {
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;

  logger.error(`Error: ${err.message}, Stack: ${err.stack}`);

  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};

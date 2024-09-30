import dotenv from "dotenv";
import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import { connectDB, passportConfig } from "config";
import { errorHandler, requestLogger } from "middlewares";
import session from "express-session";
import passport from "passport";
import authRouter from "routes/authRoutes";

dotenv.config();

const app = express();

const corsOption = {
  origin: process.env.FRONTEND_URL as string,
  credentials: true,
};

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOption));

app.use(
  session({
    secret: process.env.SECRET as string,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());
passportConfig();

connectDB();

app.use(requestLogger);

app.use("/api/v1/auth", authRouter);

app.use("/", (req: Request, res: Response) => {
  res.status(201).json({ message: "Running Server" });
});

app.use(errorHandler);

export default app;

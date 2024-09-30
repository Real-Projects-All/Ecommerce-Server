import { googleCallback, login, signup } from "controllers/authController";
import { Router } from "express";
import passport from "passport";

const router = Router();

router.post("/signup", signup);
router.post(
  "/login",
  passport.authenticate("local", { session: false }),
  login
);

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  googleCallback
);

export default router;

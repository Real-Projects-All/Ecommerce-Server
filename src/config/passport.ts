import User from "models/User";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { logger } from "./logger";

export const passportConfig = () => {
  passport.use(
    new LocalStrategy(
      { usernameField: "email" },
      async (email, password, done) => {
        try {
          const user = await User.findOne({ email });

          if (!user) {
            logger.warn(
              `Login attemp faild: No user found with email ${email}`
            );
            return done(null, false, { message: "No user with that email" });
          }

          const isMatch = await user.comparePassword(password);

          if (!isMatch) {
            logger.warn(
              `Login attempt failed: Incorrect password for email ${email}`
            );
            return done(null, false, { message: "Incorrect password" });
          }

          logger.info(`User authenticated via local strategy: ${email}`);
          return done(null, user);
        } catch (error: any) {
          logger.error(`Error during local authentication: ${error.message}`);
          return done(error, false);
        }
      }
    )
  );

  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID as string,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        callbackURL: `${process.env.BACKEND_URL}/api/v1/auth/google/callback`,
      },
      async (accessToken, _tokenSecret, profile, done) => {
        if (!accessToken) {
          return done(new Error("Failed to obtain access token"));
        }
        try {
          const user = await User.findOneOrCreateFromGoogle(profile);
          logger.info(`User authenticated via Google: ${user.email}`);
          done(null, user);
        } catch (error: any) {
          logger.error(`Google OAuth failed: ${error.message}`);
          done(error, false);
        }
      }
    )
  );

  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });
};

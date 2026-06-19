import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { configDotenv } from "dotenv";
import Register from "../modals/RegisterSchema.js";

configDotenv();

console.log("GOOGLE_CLIENT_ID:", process.env.GOOGLE_CLIENT_ID);

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: "http://localhost:5000/auth/google/callback",
        },
        async (
            accessToken,
            refreshToken,
            profile,
            done
        ) => {
            try {

                let user = await Register.findOne({
                    email: profile.emails[0].value,
                });

                if (!user) {

                    user = await Register.create({
                        name: profile.displayName,
                        email: profile.emails[0].value,
                        password: "google-auth-user"
                    });
                }

                return done(null, user);

            } catch (error) {

                return done(error, null);
            }
        }
    )
);

export default passport;
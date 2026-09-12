// src/config/passport.js
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { configDotenv } from "dotenv";
import Register from "../modals/RegisterSchema.js";
import bcrypt from "bcrypt";

configDotenv();

// ==================== JWT STRATEGY ====================
const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET
};

passport.use(new JwtStrategy(jwtOptions, async (payload, done) => {
    try {
        const user = await Register.findById(payload.id);
        if (user) return done(null, user);
        return done(null, false);
    } catch (error) {
        return done(error, false);
    }
}));

// ==================== GOOGLE OAUTH STRATEGY ====================
passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: "https://authentication-system-sh1d.onrender.com/api/google/callback",
            passReqToCallback: true
        },
        async (req, accessToken, refreshToken, profile, done) => {
            console.log("🔵🔵🔵 GOOGLE CALLBACK STARTED 🔵🔵🔵");

            try {
                console.log("📧 Email:", profile.emails?.[0]?.value);
                console.log("👤 Name:", profile.displayName);
                console.log("🆔 Google ID:", profile.id);

                if (!profile.emails || !profile.emails[0]) {
                    console.error("❌ No email in Google profile");
                    return done(new Error("No email provided by Google"), null);
                }

                // Find user
                let user = await Register.findOne({
                    email: profile.emails[0].value
                });

                if (!user) {
                    console.log("🆕 Creating new user...");

                    const randomPassword = Math.random().toString(36) + Date.now().toString();
                    const hashedPassword = await bcrypt.hash(randomPassword, 10);

                    user = await Register.create({
                        name: profile.displayName || profile.name?.givenName || "User",
                        email: profile.emails[0].value,
                        password: hashedPassword,
                        googleId: profile.id,
                        isVerified: true,
                        authProvider: "google",
                        profilePicture: profile.photos?.[0]?.value || null
                    });

                    console.log("✅ New user created:", user.email);
                } else {
                    console.log("👤 Existing user found:", user.email);

                    if (!user.googleId) {
                        user.googleId = profile.id;
                        await user.save();
                        console.log("✅ Google ID added to existing user");
                    }
                }

                console.log("🎉 Returning user to Passport");
                return done(null, user);

            } catch (error) {
                console.error("❌❌❌ GOOGLE OAUTH ERROR ❌❌❌");
                console.error("Name:", error.name);
                console.error("Message:", error.message);
                console.error("Stack:", error.stack);
                return done(error, null);
            }
        }
    )
);

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
    try {
        const user = await Register.findById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

export default passport;
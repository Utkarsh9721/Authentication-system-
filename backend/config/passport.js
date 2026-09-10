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
        if (user) {
            return done(null, user);
        }
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
            // ✅ FIXED: Matches your actual route /api/google/callback
            callbackURL: "https://authentication-system-sh1d.onrender.com/api/google/callback",
            passReqToCallback: true
        },
        async (req, accessToken, refreshToken, profile, done) => {
            try {
                console.log('✅ Google Profile received:', profile.emails[0].value);

                // Check if user exists by email
                let user = await Register.findOne({
                    email: profile.emails[0].value,
                });

                if (!user) {
                    // Create new user
                    const randomPassword = Math.random().toString(36) + Date.now().toString();
                    const hashedPassword = await bcrypt.hash(randomPassword, 10);

                    user = await Register.create({
                        name: profile.displayName || profile.name?.givenName || 'User',
                        email: profile.emails[0].value,
                        password: hashedPassword,
                        googleId: profile.id,
                        isVerified: true,
                        authProvider: 'google',
                        profilePicture: profile.photos?.[0]?.value || null
                    });

                    console.log('✅ New user created via Google OAuth:', user.email);
                } else {
                    // Update Google ID if not set
                    if (!user.googleId) {
                        user.googleId = profile.id;
                        await user.save();
                    }
                    console.log('✅ User logged in via Google OAuth:', user.email);
                }

                return done(null, user);

            } catch (error) {
                console.error('❌ Google OAuth Error:', error);
                return done(error, null);
            }
        }
    )
);

// ==================== SERIALIZATION ====================
passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await Register.findById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

export default passport;
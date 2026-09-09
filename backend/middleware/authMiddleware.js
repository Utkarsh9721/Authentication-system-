// src/middleware/authMiddleware.js
import passport from "passport";

export const auth = (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
        if (err) {
            console.error('Auth error:', err);
            return res.status(500).json({
                success: false,
                message: 'Authentication error'
            });
        }

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized access'
            });
        }

        req.user = user;
        next();
    })(req, res, next);
};

export default auth;
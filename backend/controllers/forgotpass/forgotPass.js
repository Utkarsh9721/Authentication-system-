import Register from "../../modals/RegisterSchema.js";
import transporter from "../nodemailer/nodemailer.js"
import crypto from "crypto";

const Forgot = async (req, res) => {

    try {

        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                message: "Email required"
            });
        }

        const user = await Register.findOne({ email });

        if (!user) {
            return res.status(200).json({
                message:
                    "If account exists, email sent"
            });
        }

        const resetToken =
            crypto.randomBytes(32).toString("hex");

        const hashedToken =
            crypto
                .createHash("sha256")
                .update(resetToken)
                .digest("hex");

        user.resetPasswordToken = hashedToken;
        user.resetPasswordExpire =
            Date.now() + 15 * 60 * 1000;

        await user.save();

        const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: "Reset Password",
            html: `
                <h2>Password Reset</h2>
                <p>Click below:</p>
                <a href="${resetUrl}">
                    Reset Password
                </a>
            `
        });

        return res.status(200).json({
            message: "Reset email sent"
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            message: "Server error"
        });
    }
};

export default Forgot;
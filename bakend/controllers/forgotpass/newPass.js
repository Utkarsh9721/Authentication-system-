import crypto from "crypto";
import Register from "../../modals/RegisterSchema.js";

const ResetPassword = async (req, res) => {

    const { token } = req.params;
    const { password } = req.body;

    const hashedToken =
        crypto.createHash("sha256")
        .update(token)
        .digest("hex");

    const user = await Register.findOne({
        resetPasswordToken: hashedToken,
        resetPasswordExpire: {
            $gt: Date.now()
        }
    });

    if (!user) {
        return res.status(400).json({
            message: "Invalid or expired token"
        });
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    return res.status(200).json({
        message: "Password reset successful"
    });
};

export default ResetPassword;
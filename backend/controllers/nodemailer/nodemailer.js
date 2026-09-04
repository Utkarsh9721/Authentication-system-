import { configDotenv } from "dotenv";
import nodemailer from "nodemailer";

configDotenv();

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

export default transporter;
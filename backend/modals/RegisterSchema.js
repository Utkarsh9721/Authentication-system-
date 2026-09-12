// src/modals/RegisterSchema.js
import mongoose from "mongoose";
import bcrypt from "bcrypt";

const RegisterSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    // ✅ Conditional password (not required for Google users)
    password: {
        type: String,
        required: function () {
            return this.authProvider === 'local';
        },
        select: false
    },
    // ✅ Google OAuth fields
    googleId: {
        type: String,
        sparse: true,
        unique: true
    },
    authProvider: {
        type: String,
        enum: ['local', 'google'],
        default: 'local'
    },
    profilePicture: {
        type: String,
        default: null
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    lastLogin: {
        type: Date,
        default: null
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// ✅ FIXED: async function without next, OR with next parameter
RegisterSchema.pre("save", async function () {
    // Skip if password not modified or if Google user
    if (!this.isModified("password") || this.authProvider === "google") {
        return;
    }

    // Hash password (async function auto-resolves)
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    // No next() needed - async function handles it
});

// Compare password method
RegisterSchema.methods.comparePassword = async function (password) {
    if (!this.password) return false;
    return bcrypt.compare(password, this.password);
};

const Register = mongoose.model("Register", RegisterSchema);
export default Register;
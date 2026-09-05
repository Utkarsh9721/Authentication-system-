import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./Register.css";

const Register = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPass, setConfirmPass] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e) => {
            setMousePosition({
                x: (e.clientX / window.innerWidth) * 100,
                y: (e.clientY / window.innerHeight) * 100,
            });
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    const googleRegister = () => {
        window.location.href = import.meta.env.VITE_GOOGLE_AUTH;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (!name || !email || !password || !confirmPass) {
            setError("Please fill in all fields");
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }

        if (password !== confirmPass) {
            setError("Passwords do not match");
            return;
        }

        try {
            setIsLoading(true);
            setError("");
            setSuccess("");

            const res = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/register`,
                {
                    name,
                    email,
                    password,
                    confirmPass
                }
            );

            setSuccess(res.data.message);
            setName("");
            setEmail("");
            setPassword("");
            setConfirmPass("");

            setTimeout(() => {
                setSuccess("");
            }, 5000);

        } catch (error) {
            if (error.response) {
                setError(error.response.data.message || "Registration failed");
            } else {
                setError("Server error. Please try again later.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="register-container">
            {/* Animated Background Elements */}
            <div className="bg-animation">
                <div className="bg-orbs">
                    <div className="orb orb-1"></div>
                    <div className="orb orb-2"></div>
                    <div className="orb orb-3"></div>
                    <div className="orb orb-4"></div>
                </div>
                <div className="bg-grid"></div>
                <div
                    className="bg-glow"
                    style={{
                        left: `${mousePosition.x}%`,
                        top: `${mousePosition.y}%`,
                    }}
                ></div>
            </div>

            <div className="register-card">
                <div className="register-header">
                    <div className="logo-icon">
                        <svg viewBox="0 0 24 24" fill="none">
                            <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                            <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                            <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                            <path d="M12 12V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            <path d="M12 2V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                    </div>
                    <h1>Create Account</h1>
                    <p>Join us and start your journey</p>
                </div>

                {error && (
                    <div className="alert alert-error">
                        <span className="alert-icon">⚠️</span>
                        {error}
                    </div>
                )}

                {success && (
                    <div className="alert alert-success">
                        <span className="alert-icon">✅</span>
                        {success}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="register-form">
                    <div className="form-group">
                        <label htmlFor="name">
                            <svg className="input-icon" viewBox="0 0 24 24" fill="none">
                                <path d="M20 21V19C20 16.7909 18.2091 15 16 15H8C5.79086 15 4 16.7909 4 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" />
                            </svg>
                            Full Name
                        </label>
                        <input
                            id="name"
                            type="text"
                            placeholder="John Doe"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="form-input"
                            disabled={isLoading}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">
                            <svg className="input-icon" viewBox="0 0 24 24" fill="none">
                                <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" strokeWidth="2" />
                                <path d="M22 6L12 13L2 6" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                            </svg>
                            Email Address
                        </label>
                        <input
                            id="email"
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="form-input"
                            disabled={isLoading}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">
                            <svg className="input-icon" viewBox="0 0 24 24" fill="none">
                                <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="2" />
                                <path d="M7 11V7C7 4.23858 9.23858 2 12 2C14.7614 2 17 4.23858 17 7V11" stroke="currentColor" strokeWidth="2" />
                            </svg>
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            placeholder="Min 6 characters"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="form-input"
                            disabled={isLoading}
                        />
                        <div className="password-hint">
                            <span className="hint-dot"></span>
                            Must be at least 6 characters
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmPass">
                            <svg className="input-icon" viewBox="0 0 24 24" fill="none">
                                <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="2" />
                                <path d="M7 11V7C7 4.23858 9.23858 2 12 2C14.7614 2 17 4.23858 17 7V11" stroke="currentColor" strokeWidth="2" />
                                <path d="M12 14V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                <path d="M9 14H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                            Confirm Password
                        </label>
                        <input
                            id="confirmPass"
                            type="password"
                            placeholder="Re-enter your password"
                            value={confirmPass}
                            onChange={(e) => setConfirmPass(e.target.value)}
                            className="form-input"
                            disabled={isLoading}
                        />
                    </div>

                    <div className="form-options">
                        <label className="checkbox-label">
                            <input type="checkbox" required />
                            <span className="checkmark"></span>
                            I agree to the <a href="/terms" className="link-inline">Terms of Service</a> &amp; <a href="/privacy" className="link-inline">Privacy Policy</a>
                        </label>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <span className="spinner"></span>
                        ) : (
                            <>
                                <span>Create Account</span>
                                <svg className="btn-arrow" viewBox="0 0 24 24" fill="none">
                                    <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </>
                        )}
                    </button>
                </form>

                <div className="divider">
                    <span>or continue with</span>
                </div>

                <button
                    type="button"
                    onClick={googleRegister}
                    className="btn btn-google"
                    disabled={isLoading}
                >
                    <svg className="google-icon" viewBox="0 0 48 48">
                        <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
                        <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
                        <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
                        <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
                    </svg>
                    Continue with Google
                </button>

                <div className="register-footer">
                    <p>Already have an account? <Link to="/login">Sign in</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Register;
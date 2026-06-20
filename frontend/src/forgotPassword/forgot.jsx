import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./forget.css";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    // Track mouse position for interactive background
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

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (!email) {
            setError("Please enter your email address");
            return;
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError("Please enter a valid email address");
            return;
        }

        try {
            setIsLoading(true);
            setError("");
            setMessage("");

            const res = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/forgot-password`,
                { email }
            );

            setMessage(res.data.message);
            setEmail("");

            // Clear success message after 5 seconds
            setTimeout(() => {
                setMessage("");
            }, 5000);

        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Something went wrong. Please try again."
            );

            // Clear error after 5 seconds
            setTimeout(() => {
                setError("");
            }, 5000);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="forgot-container">
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

            <div className="forgot-card">
                <div className="forgot-header">
                    <div className="logo-icon">
                        <svg viewBox="0 0 24 24" fill="none">
                            <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
                            <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
                            <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
                            <path d="M12 12V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                            <path d="M12 2V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                            <path d="M8 7L16 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                            <path d="M8 10L16 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                    </div>
                    <h1>Forgot Password</h1>
                    <p>Enter your email to receive a reset link</p>
                </div>

                {error && (
                    <div className="alert alert-error">
                        <span className="alert-icon">⚠️</span>
                        {error}
                    </div>
                )}

                {message && (
                    <div className="alert alert-success">
                        <span className="alert-icon">✅</span>
                        {message}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="forgot-form">
                    <div className="form-group">
                        <label htmlFor="email">
                            <svg className="input-icon" viewBox="0 0 24 24" fill="none">
                                <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" strokeWidth="2"/>
                                <path d="M22 6L12 13L2 6" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
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
                            autoFocus
                        />
                    </div>

                    <div className="form-info">
                        <svg className="info-icon" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                            <path d="M12 16V12M12 8H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                        <span>We'll send a password reset link to this email</span>
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
                                <svg className="btn-icon" viewBox="0 0 24 24" fill="none">
                                    <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                    <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
                                </svg>
                                <span>Send Reset Link</span>
                            </>
                        )}
                    </button>
                </form>

                <div className="divider">
                    <span>or</span>
                </div>

                <div className="forgot-actions">
                    <Link to="/login" className="btn btn-secondary">
                        <svg className="btn-icon" viewBox="0 0 24 24" fill="none">
                            <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Back to Sign In
                    </Link>
                </div>

                <div className="forgot-footer">
                    <p>Don't have an account? <Link to="/register">Sign up</Link></p>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
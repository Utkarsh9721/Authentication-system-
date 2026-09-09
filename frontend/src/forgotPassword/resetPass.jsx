import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./resetPass.css";

const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(0);
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

    // Calculate password strength
    useEffect(() => {
        let strength = 0;
        if (password.length >= 6) strength++;
        if (password.length >= 10) strength++;
        if (/[A-Z]/.test(password) && /[a-z]/.test(password)) strength++;
        if (/\d/.test(password)) strength++;
        if (/[^A-Za-z0-9]/.test(password)) strength++;
        setPasswordStrength(strength);
    }, [password]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (!password) {
            setError("Please enter a new password");
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        try {
            setIsLoading(true);
            setError("");
            setMessage("");

            const res = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/reset-password/${token}`,
                { password }
            );

            setMessage(res.data.message);
            setPassword("");
            setConfirmPassword("");

            setTimeout(() => {
                navigate("/login");
            }, 3000);

        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Something went wrong. Please try again."
            );
        } finally {
            setIsLoading(false);
        }
    };

    const getPasswordStrengthLabel = () => {
        if (passwordStrength === 0) return { label: "Very Weak", color: "#ef4444", width: "20%" };
        if (passwordStrength === 1) return { label: "Weak", color: "#f59e0b", width: "40%" };
        if (passwordStrength === 2) return { label: "Fair", color: "#f59e0b", width: "60%" };
        if (passwordStrength === 3) return { label: "Good", color: "#34d399", width: "80%" };
        if (passwordStrength >= 4) return { label: "Strong", color: "#34d399", width: "100%" };
        return { label: "Very Weak", color: "#ef4444", width: "20%" };
    };

    const strengthInfo = getPasswordStrengthLabel();

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="reset-container">
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

            <div className="reset-card">
                <div className="reset-header">
                    <div className="logo-icon">
                        <svg viewBox="0 0 24 24" fill="none">
                            <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                            <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                            <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                            <path d="M12 12V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            <path d="M12 2V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            <path d="M8 7L16 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            <path d="M8 10L16 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            <path d="M16 15L16 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            <path d="M16 19L16 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                    </div>
                    <h1>Reset Password</h1>
                    <p>Create a new secure password for your account</p>
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

                <form onSubmit={handleSubmit} className="reset-form">
                    <div className="form-group">
                        <label htmlFor="password">
                            <svg className="input-icon" viewBox="0 0 24 24" fill="none">
                                <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="2" />
                                <path d="M7 11V7C7 4.23858 9.23858 2 12 2C14.7614 2 17 4.23858 17 7V11" stroke="currentColor" strokeWidth="2" />
                            </svg>
                            New Password
                        </label>
                        <div className="password-input-wrapper">
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter new password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="form-input"
                                disabled={isLoading}
                                autoFocus
                            />
                            <button
                                type="button"
                                className="toggle-password"
                                onClick={toggleShowPassword}
                                disabled={isLoading}
                                tabIndex="-1"
                            >
                                {showPassword ? (
                                    <svg viewBox="0 0 24 24" fill="none">
                                        <path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" stroke="currentColor" strokeWidth="2" />
                                        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
                                        <path d="M20 20L4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                    </svg>
                                ) : (
                                    <svg viewBox="0 0 24 24" fill="none">
                                        <path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" stroke="currentColor" strokeWidth="2" />
                                        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
                                    </svg>
                                )}
                            </button>
                        </div>

                        {/* Password Strength Indicator */}
                        {password.length > 0 && (
                            <div className="password-strength">
                                <div className="strength-bar">
                                    <div
                                        className="strength-fill"
                                        style={{
                                            width: strengthInfo.width,
                                            backgroundColor: strengthInfo.color,
                                        }}
                                    ></div>
                                </div>
                                <span className="strength-label" style={{ color: strengthInfo.color }}>
                                    {strengthInfo.label}
                                </span>
                            </div>
                        )}

                        <div className="password-requirements">
                            <div className={`requirement ${password.length >= 6 ? 'met' : ''}`}>
                                <span className="req-icon">
                                    {password.length >= 6 ? '✓' : '○'}
                                </span>
                                Minimum 6 characters
                            </div>
                            <div className={`requirement ${/[A-Z]/.test(password) && /[a-z]/.test(password) ? 'met' : ''}`}>
                                <span className="req-icon">
                                    {/[A-Z]/.test(password) && /[a-z]/.test(password) ? '✓' : '○'}
                                </span>
                                Uppercase &amp; lowercase letters
                            </div>
                            <div className={`requirement ${/\d/.test(password) ? 'met' : ''}`}>
                                <span className="req-icon">
                                    {/\d/.test(password) ? '✓' : '○'}
                                </span>
                                At least one number
                            </div>
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmPassword">
                            <svg className="input-icon" viewBox="0 0 24 24" fill="none">
                                <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="2" />
                                <path d="M7 11V7C7 4.23858 9.23858 2 12 2C14.7614 2 17 4.23858 17 7V11" stroke="currentColor" strokeWidth="2" />
                                <path d="M12 14V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                <path d="M9 14H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                            Confirm Password
                        </label>
                        <input
                            id="confirmPassword"
                            type={showPassword ? "text" : "password"}
                            placeholder="Re-enter new password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="form-input"
                            disabled={isLoading}
                        />
                        {confirmPassword && password && (
                            <div className={`password-match ${password === confirmPassword ? 'match' : 'no-match'}`}>
                                {password === confirmPassword ? (
                                    <>
                                        <svg viewBox="0 0 24 24" fill="none">
                                            <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                        Passwords match
                                    </>
                                ) : (
                                    <>
                                        <svg viewBox="0 0 24 24" fill="none">
                                            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                        </svg>
                                        Passwords do not match
                                    </>
                                )}
                            </div>
                        )}
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
                                    <path d="M20 12C20 16.4183 16.4183 20 12 20C7.58172 20 4 16.4183 4 12C4 7.58172 7.58172 4 12 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                    <path d="M20 12L16 8M20 12L16 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                </svg>
                                <span>Reset Password</span>
                            </>
                        )}
                    </button>
                </form>

                <div className="divider">
                    <span>or</span>
                </div>

                <div className="reset-actions">
                    <Link to="/login" className="btn btn-secondary">
                        <svg className="btn-icon" viewBox="0 0 24 24" fill="none">
                            <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        Back to Sign In
                    </Link>
                </div>

                <div className="reset-footer">
                    <p>Don't have an account? <Link to="/register">Sign up</Link></p>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
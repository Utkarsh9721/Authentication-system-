import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const navigate = useNavigate();

    const BackendURL = "http://localhost:5000/api";

    const googleLogin = () => {
        window.location.href =
            "http://localhost:5000/auth/google";
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            setError("");
            setSuccess("");

            const res = await axios.post(
                `${BackendURL}/login`,
                {
                    email,
                    password
                },
                {
                    withCredentials: true
                }
            );

            setSuccess(res.data.message);

            setEmail("");
            setPassword("");

            navigate("/dashboard");

        } catch (error) {

            if (error.response) {
                setError(error.response.data.message);
            } else {
                setError("Server error");
            }
        }
    };

    return (
        <div className="login">

            <h1>Login</h1>

            {error && (
                <p style={{ color: "red" }}>
                    {error}
                </p>
            )}

            {success && (
                <p style={{ color: "green" }}>
                    {success}
                </p>
            )}

            <form onSubmit={handleSubmit}>

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) =>
                        setEmail(e.target.value)
                    }
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) =>
                        setPassword(e.target.value)
                    }
                />

                <button type="submit">
                    Login
                </button>

            </form>

            <br />

            <button
                type="button"
                onClick={googleLogin}
            >
                Continue with Google
            </button>

        </div>
    );
};

export default Login;
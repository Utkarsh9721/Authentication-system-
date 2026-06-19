import React, { useState } from "react";
import axios from "axios";

const Register = () => {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPass, setConfirmPass] = useState("");

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const googleRegister = () => {
        window.location.href =
            import.meta.env.VITE_GOOGLE_AUTH;
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            setError("");
            setSuccess("");

            const res = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/register`,
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

        } catch (error) {

            if (error.response) {
                setError(error.response.data.message);
            } else {
                setError("Server error");
            }
        }
    };

    return (
        <div className="register">

            <h1>Register</h1>

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
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) =>
                        setName(e.target.value)
                    }
                />

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

                <input
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPass}
                    onChange={(e) =>
                        setConfirmPass(e.target.value)
                    }
                />

                <button type="submit">
                    Register
                </button>

            </form>

            <br />

            <button
                type="button"
                onClick={googleRegister}
            >
                Continue with Google
            </button>

        </div>
    );
};

export default Register;
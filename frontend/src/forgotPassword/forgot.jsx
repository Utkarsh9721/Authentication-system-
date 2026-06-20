import { useState } from "react";
import axios from "axios";

const ForgotPassword = () => {

    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            const res = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/forgot-password`,
                { email }
            );

            setMessage(res.data.message);

        } catch (error) {

            setMessage(
                error.response?.data?.message ||
                "Something went wrong"
            );
        }
    };

    return (
        <div>

            <h1>Forgot Password</h1>

            <form onSubmit={handleSubmit}>

                <input
                    type="email"
                    placeholder="Enter Email"
                    value={email}
                    onChange={(e) =>
                        setEmail(e.target.value)
                    }
                />

                <button type="submit">
                    Send Reset Link
                </button>

            </form>

            <p>{message}</p>

        </div>
    );
};

export default ForgotPassword;
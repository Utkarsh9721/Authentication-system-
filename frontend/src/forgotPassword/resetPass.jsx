import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const ResetPassword = () => {

    const { token } = useParams();

    const navigate = useNavigate();

    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            const res = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/reset-password/${token}`,
                {
                    password
                }
            );

            setMessage(res.data.message);

            setTimeout(() => {
                navigate("/login");
            }, 2000);

        } catch (error) {

            setMessage(
                error.response?.data?.message ||
                "Something went wrong"
            );
        }
    };

    return (
        <div>

            <h1>Reset Password</h1>

            <form onSubmit={handleSubmit}>

                <input
                    type="password"
                    placeholder="New Password"
                    value={password}
                    onChange={(e) =>
                        setPassword(e.target.value)
                    }
                />

                <button type="submit">
                    Reset Password
                </button>

            </form>

            <p>{message}</p>

        </div>
    );
};

export default ResetPassword;
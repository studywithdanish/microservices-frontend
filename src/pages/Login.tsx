import Base from "../components/Base";
import { useState, type ChangeEvent, type FormEvent } from "react";
import { isAxiosError } from "axios";
import type { LoginCredentials } from "../types";
import { toast } from "react-toastify";
import { login } from "../services/user-service";
import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";

const initialCredentials: LoginCredentials = {
    username: "",
    password: "",
};

const Login = () => {
    const [credentials, setCredentials] = useState(initialCredentials);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();
    const { signIn } = useAuth();

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setCredentials((currentCredentials) => ({
            ...currentCredentials,
            [name]: value,
        }));
    };

    const resetForm = () => {
        setCredentials(initialCredentials);
    };

    const submitForm = async (event: FormEvent) => {
        event.preventDefault();
        setIsSubmitting(true);

        try {
            await login(credentials);
            await signIn();
            toast.success("Login successful");
            resetForm();
            navigate("/dashboard");
        } catch (error: unknown) {
            const message = isAxiosError<{ message?: string }>(error)
                ? error.response?.data?.message || "Unable to login. Please check your credentials."
                : "Unable to login. Please check your credentials.";
            toast.error(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Base>
            <div className="container form-page">
                <div className="row justify-content-center">
                    <div className="col-lg-5 col-md-7">
                        <div className="card form-card">
                            <div className="card-header">
                                <p className="eyebrow mb-2">Welcome back</p>
                                <h1>Login</h1>
                            </div>
                            <div className="card-body">
                                <form onSubmit={submitForm}>
                                    <div className="mb-3">
                                        <label className="form-label" htmlFor="username">Email</label>
                                        <input
                                            className="form-control"
                                            type="email"
                                            id="username"
                                            name="username"
                                            value={credentials.username}
                                            onChange={handleChange}
                                            placeholder="danish@example.com"
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label" htmlFor="password">Password</label>
                                        <input
                                            className="form-control"
                                            type="password"
                                            id="password"
                                            name="password"
                                            value={credentials.password}
                                            onChange={handleChange}
                                            placeholder="Enter password"
                                            required
                                        />
                                    </div>

                                    <div className="form-actions">
                                        <button className="btn btn-primary" type="submit" disabled={isSubmitting}>
                                            {isSubmitting ? "Logging in..." : "Login"}
                                        </button>
                                        <button className="btn btn-outline-secondary" type="button" onClick={resetForm}>
                                            Reset
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </Base>
    )
};

export default Login

import Base from "../components/Base";
import { useState } from "react";
import { signUp } from "../services/user-service";
import { toast } from "react-toastify";

const initialUser = {
    name: "",
    email: "",
    password: "",
    about: "",
};

const Signup = () => {

    const [data, setData] = useState(initialUser);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setData((currentData) => ({
            ...currentData,
            [name]: value,
        }));
    };

    const resetData = () => {
        setData(initialUser);
        setErrors({});
    };

    const validateForm = () => {
        const validationErrors = {};

        if (!data.name.trim() || data.name.trim().length < 4) {
            validationErrors.name = "Username must be at least 4 characters";
        }
        if (!data.email || !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(data.email)) {
            validationErrors.email = "Email address is not valid";
        }
        if (!data.password || data.password.length < 3 || data.password.length > 10) {
            validationErrors.password = "Password must be 3 to 10 characters";
        }
        if (!data.about.trim()) {
            validationErrors.about = "About is required";
        }

        return validationErrors;
    };

    const submitForm = async (event) => {
        event.preventDefault();

        const validationErrors = validateForm();

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            toast.error("Please correct the highlighted fields.");
            return;
        }

        setErrors({});
        setIsSubmitting(true);

        try {
            const response = await signUp(data);
            toast.success(`User registered successfully. User id: ${response.id}`);
            resetData();
        } catch (error) {
            const responseErrors = error?.response?.data;
            if (responseErrors && typeof responseErrors === "object" && !responseErrors.message) {
                setErrors(responseErrors);
            }
            toast.error(error?.response?.data?.message || "Unable to register user.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Base>
            <div className="container form-page">
                <div className="row justify-content-center">
                    <div className="col-lg-6 col-md-8">
                        <div className="card form-card">
                            <div className="card-header">
                                <p className="eyebrow mb-2">New account</p>
                                <h1>Create account</h1>
                            </div>

                            <div className="card-body">
                                <form onSubmit={submitForm}>

                                    <div className="mb-3">
                                        <label className="form-label" htmlFor="name">Name</label>
                                        <input
                                            className={`form-control ${errors.name ? "is-invalid" : ""}`}
                                            type="text"
                                            placeholder="Danish Khan"
                                            id="name"
                                            name="name"
                                            onChange={handleChange}
                                            value={data.name}
                                        />
                                        {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label" htmlFor="email">Email</label>
                                        <input
                                            className={`form-control ${errors.email ? "is-invalid" : ""}`}
                                            type="email"
                                            placeholder="danish@example.com"
                                            id="email"
                                            name="email"
                                            onChange={handleChange}
                                            value={data.email}
                                        />
                                        {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label" htmlFor="password">Password</label>
                                        <input
                                            className={`form-control ${errors.password ? "is-invalid" : ""}`}
                                            type="password"
                                            placeholder="3 to 10 characters"
                                            id="password"
                                            name="password"
                                            onChange={handleChange}
                                            value={data.password}
                                        />
                                        {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label" htmlFor="about">About</label>
                                        <textarea
                                            className={`form-control ${errors.about ? "is-invalid" : ""}`}
                                            placeholder="Short profile summary"
                                            id="about"
                                            name="about"
                                            onChange={handleChange}
                                            value={data.about}
                                        />
                                        {errors.about && <div className="invalid-feedback">{errors.about}</div>}
                                    </div>

                                    <div className="form-actions">
                                        <button className="btn btn-primary" type="submit" disabled={isSubmitting}>
                                            {isSubmitting ? "Creating..." : "Create account"}
                                        </button>
                                        <button className="btn btn-outline-secondary" onClick={resetData} type="button">Reset</button>
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

export default Signup

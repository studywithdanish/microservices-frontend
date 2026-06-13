import { Card, CardBody, CardHeader, Container, Form, FormGroup, Label, Input, Button, Row, Col, FormFeedback } from "reactstrap";
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
            <Container className="form-page">
                <Row className="justify-content-center">
                    <Col lg="6" md="8">
                        <Card className="form-card">
                            <CardHeader>
                                <p className="eyebrow mb-2">New account</p>
                                <h1>Create account</h1>
                            </CardHeader>

                            <CardBody>
                                <Form onSubmit={submitForm}>

                                    <FormGroup>
                                        <Label for="name">Name</Label>
                                        <Input
                                            type="text"
                                            placeholder="Danish Khan"
                                            id="name"
                                            name="name"
                                            onChange={handleChange}
                                            value={data.name}
                                            invalid={Boolean(errors.name)}
                                        />
                                        <FormFeedback>{errors.name}</FormFeedback>
                                    </FormGroup>

                                    <FormGroup>
                                        <Label for="email">Email</Label>
                                        <Input
                                            type="email"
                                            placeholder="danish@example.com"
                                            id="email"
                                            name="email"
                                            onChange={handleChange}
                                            value={data.email}
                                            invalid={Boolean(errors.email)}
                                        />
                                        <FormFeedback>{errors.email}</FormFeedback>
                                    </FormGroup>

                                    <FormGroup>
                                        <Label for="password">Password</Label>
                                        <Input
                                            type="password"
                                            placeholder="3 to 10 characters"
                                            id="password"
                                            name="password"
                                            onChange={handleChange}
                                            value={data.password}
                                            invalid={Boolean(errors.password)}
                                        />
                                        <FormFeedback>{errors.password}</FormFeedback>
                                    </FormGroup>

                                    <FormGroup>
                                        <Label for="about">About</Label>
                                        <Input
                                            type="textarea"
                                            placeholder="Short profile summary"
                                            id="about"
                                            name="about"
                                            onChange={handleChange}
                                            value={data.about}
                                            invalid={Boolean(errors.about)}
                                        />
                                        <FormFeedback>{errors.about}</FormFeedback>
                                    </FormGroup>

                                    <div className="form-actions">
                                        <Button color="primary" type="submit" disabled={isSubmitting}>
                                            {isSubmitting ? "Creating..." : "Create account"}
                                        </Button>
                                        <Button onClick={resetData} color="secondary" type="button" outline>Reset</Button>
                                    </div>
                                </Form>

                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>

        </Base>
    )
};

export default Signup

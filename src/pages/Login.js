import { Form, Row, Container, Col, Card, CardBody, CardHeader, FormGroup, Label, Input, Button } from "reactstrap";
import Base from "../components/Base";
import { useState } from "react";
import { toast } from "react-toastify";
import { login } from "../services/user-service";

const initialCredentials = {
    username: "",
    password: "",
};

const Login = () => {
    const [credentials, setCredentials] = useState(initialCredentials);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setCredentials((currentCredentials) => ({
            ...currentCredentials,
            [name]: value,
        }));
    };

    const resetForm = () => {
        setCredentials(initialCredentials);
    };

    const submitForm = async (event) => {
        event.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await login(credentials);
            localStorage.setItem("authToken", response.token);
            toast.success("Login successful");
            resetForm();
        } catch (error) {
            const message = error?.response?.data?.message || "Unable to login. Please check your credentials.";
            toast.error(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Base>
            <Container className="form-page">
                <Row className="justify-content-center">
                    <Col lg="5" md="7">
                        <Card className="form-card">
                            <CardHeader>
                                <p className="eyebrow mb-2">Welcome back</p>
                                <h1>Login</h1>
                            </CardHeader>
                            <CardBody>
                                <Form onSubmit={submitForm}>
                                    <FormGroup>
                                        <Label for="username">Email</Label>
                                        <Input
                                            type="email"
                                            id="username"
                                            name="username"
                                            value={credentials.username}
                                            onChange={handleChange}
                                            placeholder="danish@example.com"
                                            required
                                        />
                                    </FormGroup>
                                    <FormGroup>
                                        <Label for="password">Password</Label>
                                        <Input
                                            type="password"
                                            id="password"
                                            name="password"
                                            value={credentials.password}
                                            onChange={handleChange}
                                            placeholder="Enter password"
                                            required
                                        />
                                    </FormGroup>

                                    <div className="form-actions">
                                        <Button color="primary" type="submit" disabled={isSubmitting}>
                                            {isSubmitting ? "Logging in..." : "Login"}
                                        </Button>
                                        <Button type="button" outline color="secondary" onClick={resetForm}>
                                            Reset
                                        </Button>
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

export default Login

import { Form, Row, Container, Col, Card, CardBody, CardHeader, FormGroup, Label, Input, Button } from "reactstrap";
import Base from "../components/Base";

const Login=()=>{
    return (
        <Base>
        
            <Container>
                <Row className="mt-4">
                    <Col sm={{size:6, offset:3}}>
                        <Card color="dark" inverse>
                            <CardHeader>
                                <h3>Login Here !!</h3>
                            </CardHeader>
                            <CardBody>
                                <Form>
                                    {/* Email field */}
                                    <FormGroup>
                                        <Label for="email">Enter Email</Label>
                                        <Input type="text" id="email"></Input>
                                    </FormGroup>
                                    {/* Password field */}
                                    <FormGroup>
                                        <Label for="password">Enter Password</Label>
                                        <Input type="password" id="password"></Input>
                                    </FormGroup>

                                    <Container className="text-center">
                                        <Button color="light" outline>Login</Button>
                                        <Button className="ms-2" outline color="secondary">Reset</Button>
                                    </Container>
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
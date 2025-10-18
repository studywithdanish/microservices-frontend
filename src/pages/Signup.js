import { Card, CardBody, CardHeader, Container, Form, FormGroup, Label, Input, Button, Row, Col, FormFeedback } from "reactstrap";
import Base from "../components/Base";
import { useEffect, useState } from "react";
import { signUp } from "../services/user-service";
import { toast } from "react-toastify";

const Signup=()=>{

    const [data, setData]=useState({
            name:'',
            email:'',
            password:'',
            about:'' 
            
    })

    const [error, setError]=useState({
        errors:{},
        isError:false
    })

    

    //handle change
    const handleChange=(event,property)=>{

        //dynamically setting the value
        setData({...data,[property]:event.target.value})
               
    }

    //resetting the form
    const resetData=()=>{
        setData({
            name:'',
            email:'',
            password:'',
            about:''
        })
    }

    //submit the form
    const submitForm=(event)=>{
        event.preventDefault()

        // Basic client-side validation
        const errors = {};
        if (!data.name || data.name.length < 3) {
            errors.name = 'Name must be at least 3 characters';
        }
        if (!data.email || !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(data.email)) {
            errors.email = 'Enter a valid email';
        }
        if (!data.password || data.password.length < 6) {
            errors.password = 'Password must be at least 6 characters';
        }

        if (Object.keys(errors).length > 0) {
            setError({ errors, isError: true });
            toast.error('Form data is invalid. Please correct the highlighted fields.');
            return;
        }

        setError({ errors: {}, isError: false });

        // call server api for setting the data
        signUp(data).then((resp)=>{
            console.log(resp)
            console.log("success log");  
            toast.success("User is register successfully !! user id"+resp.id)
            setData({
            name:'',
            email:'',
            password:'',
            about:''
        })
        }).catch((error)=>{
            console.log(error);
            console.log("Error log");
            //handle errors in proper way
            setError({
                errors:error,
                isError:true
            })
            
        })
    }

    return (
        <Base>
        
        <Container>
            <Row className="mt-4">

                {/* form */}
                <Col sm={{size:6, offset:3}}>
                    <Card color="dark" inverse>
                <CardHeader>
                    <h3>Fill Information to Register !!</h3>
                </CardHeader>

                <CardBody>
                    {/* creating form */}
                    
                    <Form onSubmit={submitForm}>

                        {/* Name Field */}
                        <FormGroup>
                            <Label for="name">Enter name</Label>
                            <Input 
                            type="text" 
                            placeholder="Enter here" 
                            id="name"
                            onChange={(e)=>handleChange(e,'name')}
                            value={data.name}
                             />
                        </FormGroup>

                        {/* email field */}
                        <FormGroup>
                            <Label for="email">Enter email</Label>
                            <Input type="email" placeholder="Enter here" id="email"
                            onChange={(e)=>handleChange(e,'email')}
                            value={data.email}
                            />
                        </FormGroup>

                        {/* password field */}
                        <FormGroup>
                            <Label for="password">Enter password</Label>
                            <Input type="password" placeholder="Enter here" id="password"
                            onChange={(e)=>handleChange(e,'password')}
                            value={data.password}
                            />
                        </FormGroup>

                        {/* about field */}
                        <FormGroup>
                            <Label for="about">Enter about</Label>
                            <Input type="textarea" placeholder="Enter here" id="about" style={{height:"150px"}}
                            onChange={(e)=>handleChange(e,'about')}
                            value={data.about}
                            />
                        </FormGroup>

                        <Container className="text-center">
                            <Button outline color="light" type="submit">Register</Button>
                            <Button onClick={resetData} color="secondary" type="reset" className="ms-2">Reset</Button>
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

export default Signup
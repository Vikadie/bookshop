import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import FormContainer from "../component/FormContainer";
import { Alert, Button, Col, Form, Row } from "react-bootstrap";
import { login, googleLogin, FBLogin } from "../store/actions/userActions";
import Loader from "../component/Loader";
import { GoogleLogin } from "@react-oauth/google";
import { LoginButton as FacebookButton } from "react-facebook";

const LoginScreen = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();
    const location = useLocation();

    const redirect = location.search ? location.search.split("=")[1] : "/";

    const dispatch = useDispatch();
    const { loading, userInfo, error } = useSelector((state) => state.userData);

    useEffect(() => {
        if (userInfo) {
            navigate(redirect);
        }
    }, [navigate, userInfo, redirect]);

    const submitHandler = (e) => {
        e.preventDefault();

        dispatch(login(email, password));
    };

    return (
        <div>
            <FormContainer>
                <h1>Sign In</h1>
                {error && <Alert variant="danger">{error}</Alert>}
                {loading && <Loader />}
                <Form onSubmit={submitHandler}>
                    <Form.Group controlId="email">
                        <Form.Label>Email Address</Form.Label>
                        <Form.Control
                            type="email"
                            placeholder="Enter email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            autoComplete="email"
                        ></Form.Control>
                    </Form.Group>
                    <Form.Group controlId="password">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Enter password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoComplete="current-password"
                        ></Form.Control>
                    </Form.Group>

                    <Col align="center">
                        <Button type="submit" variant="primary" className="mt-3">
                            Sign In
                        </Button>
                    </Col>
                </Form>

                <Row className="py-3">
                    <Col>
                        New Customer ?{" "}
                        <Link to={redirect ? `/register?redirect=${redirect}` : "/register"}>
                            Register here
                        </Link>{" "}
                        or sign in via:
                    </Col>
                </Row>
                <Row className="py-2">
                    <Col align="center">
                        <GoogleLogin
                            onSuccess={(credentialResponse) => {
                                dispatch(googleLogin(credentialResponse));
                            }}
                            onError={() => {
                                console.log("Login Failed");
                            }}
                            theme="filled_black"
                            size="meduim"
                            text="continue_with"
                            shape="square"
                        />
                    </Col>
                </Row>
                <Row>
                    <Col align="center">
                        <FacebookButton
                            scope="email"
                            onError={(err) => {
                                console.log("Login Failed with error: ", error);
                            }}
                            onSuccess={(response) => {
                                if (response.status === "connected") {
                                    dispatch(FBLogin(response.authResponse));
                                }
                            }}
                            className="btn-fb"
                        >
                            <i className="fa-brands fa-square-facebook pe-5"></i>
                            <span className="pe-4">Login via Facebook</span>
                        </FacebookButton>
                    </Col>
                </Row>
            </FormContainer>
        </div>
    );
};

export default LoginScreen;

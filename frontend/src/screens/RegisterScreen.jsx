import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import FormContainer from "../component/FormContainer";
import { Alert, Button, Col, Form, Row } from "react-bootstrap";
import { register, clearError } from "../store/actions/userActions";
import Loader from "../component/Loader";

const RegisterScreen = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

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

    useEffect(() => {
        if (error) {
            document.getElementById("email").focus();
        }
    }, [error]);

    const submitHandler = (e) => {
        e.preventDefault();

        if (password != confirmPassword) {
            setErrorMessage("Passwords do not match");
            document.getElementById("confirmPassword").focus();
            return;
        }
        dispatch(register(name, email, password));
    };
    return (
        <FormContainer>
            <h1>Register</h1>
            {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
            {error && <Alert variant="danger">{error}</Alert>}
            {loading && <Loader />}
            <Form onSubmit={submitHandler}>
                <Form.Group controlId="name" className="mb-3">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                        required
                        type="name"
                        placeholder="Enter your name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        autoComplete="new-name"
                    ></Form.Control>
                </Form.Group>

                <Form.Group controlId="email" className="mb-3">
                    <Form.Label>Email Address</Form.Label>
                    <Form.Control
                        required
                        type="email"
                        placeholder="Enter email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        autoComplete="new-email"
                    ></Form.Control>
                </Form.Group>

                <Form.Group controlId="password" className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        required
                        type="password"
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete="new-password"
                    ></Form.Control>
                </Form.Group>

                <Form.Group controlId="confirmPassword" className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        required
                        type="password"
                        placeholder="Confirm password"
                        value={confirmPassword}
                        onChange={(e) => {
                            setConfirmPassword(e.target.value);
                            setErrorMessage("");
                        }}
                        style={{ color: `${errorMessage ? "red" : ""}` }}
                        autoComplete="new-password"
                    ></Form.Control>
                </Form.Group>

                <Col align="center">
                    <Button type="submit" variant="primary">
                        Register
                    </Button>
                </Col>
            </Form>
            <Row className="py-3">
                <Col>
                    Have an Account ?{" "}
                    <Link
                        to={redirect ? `/login?redirect=${redirect}` : "/login"}
                        onClick={() => dispatch(clearError())}
                    >
                        Sign In
                    </Link>
                </Col>
            </Row>
        </FormContainer>
    );
};

export default RegisterScreen;

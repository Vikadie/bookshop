import React, { useContext, useState } from "react";
import { Col, Container, InputGroup, Row, Form, Ratio, Button, Image } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import Translation from "../utils/Translation";
import CTX from "../utils/context";

const UnsubscribeScreen = () => {
    const { context } = useContext(CTX);

    const navigate = useNavigate();
    const { email } = useParams();

    const [name, setName] = useState("");
    const [provider, setProvider] = useState("");
    const checkMail = (e) => {
        e.preventDefault();

        const filledMail = name + "@" + provider;

        if (filledMail === email) {
            console.log("done");
        }
    };
    return (
        <Container className="justify-content-md-center">
            <Row>
                <Col className="m-5" as="h4">
                    {Translation.t(context.lang, "unsubscribe_sorry")}
                </Col>
            </Row>
            <Row>
                <Col className="m-5" as={"h4"}>
                    {Translation.t(context.lang, "unsubscribe_error")}
                </Col>
            </Row>
            <Row className="justify-content-center">
                <Col className="col-8 col-md-6 mx-auto d-grid">
                    <Image
                        src={"../public/static/main_pic.jpg"}
                        alt="mozak"
                        rounded
                        fluid
                        onClick={() => navigate("/")}
                        style={{ cursor: "pointer" }}
                    />
                </Col>
            </Row>
            <Row>
                <Col className="m-5" as={"h4"}>
                    {Translation.t(context.lang, "unsubscribe_noerror")}
                </Col>
            </Row>
            <Row>
                <Form onSubmit={checkMail}>
                    <Form.Group as={Row} className="mb-3" controlId="formPlaintextEmail">
                        <Form.Label as={"h4"}>
                            {Translation.t(context.lang, "unsubscribe_fillmail")}
                        </Form.Label>
                        <InputGroup className="col-12 col-md-8 mb-3">
                            <Form.Control
                                placeholder="email"
                                aria-label="Username"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                            <InputGroup.Text id="basic-addon1">@</InputGroup.Text>
                            <Form.Control
                                placeholder="example.com"
                                aria-label="provider"
                                value={provider}
                                onChange={(e) => setProvider(e.target.value)}
                            />
                        </InputGroup>
                    </Form.Group>
                    <Col className="col-md-4 mx-auto d-grid">
                        <Button type="submit" variant="outline-danger">
                            {Translation.t(context.lang, "unsubscribe_confirm")}
                        </Button>
                    </Col>
                </Form>
            </Row>
            <Row>
                <Col className="m-5" as={"h4"}>
                    {Translation.t(context.lang, "unsubscribe_final")}
                </Col>
            </Row>
        </Container>
    );
};

export default UnsubscribeScreen;

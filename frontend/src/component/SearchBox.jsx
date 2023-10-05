import React, { useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";

const SearchBox = ({ className }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const [keyword, setKeyword] = useState("");
    const submitHandler = (e) => {
        e.preventDefault();

        if (keyword) {
            navigate(`/?keyword=${keyword}&page=1`);
        } else {
            navigate(location.pathname);
        }
    };
    return (
        <Form className={className} onSubmit={submitHandler}>
            <Row className="align-items-center">
                <Col xs={8}>
                    <Form.Control
                        type="text"
                        name="q"
                        onChange={(e) => setKeyword(e.target.value)}
                        className="mr-sm-2 ml-sm-5"
                    ></Form.Control>
                </Col>
                <Col xs="auto">
                    <Button type="submit" variant="outline-success">
                        Search
                    </Button>
                </Col>
            </Row>
        </Form>
    );
};

export default SearchBox;

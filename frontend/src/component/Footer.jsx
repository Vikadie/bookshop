import React, { useContext, useEffect, useState } from "react";
import { Container, Row, Col, Navbar } from "react-bootstrap";
import CTX from "../utils/context";
import Translation from "../utils/Translation";

const Footer = () => {
    const [show, setShow] = useState("");
    const { context } = useContext(CTX);

    useEffect(() => {
        if (show) {
            const link = document.createElement("a");
            link.href = `${window.location.origin}/#/${show}?next=${window.location.hash.slice(1)}`;
            link.click();
            setShow("");
        }
    }, [show]);
    return (
        <footer>
            <Container>
                <Navbar
                    bg="dark"
                    data-bs-theme="dark"
                    variant="dark"
                    expand="lg"
                    className="bg-body-tertiary"
                    collapseOnSelect
                >
                    <button
                        className="px-3"
                        style={{ backgroundColor: "transparent", border: "none" }}
                        onClick={() => setShow("general_terms")}
                    >
                        {Translation.t(context.lang, "general_terms")}
                    </button>
                    <button
                        className="px-3"
                        style={{ backgroundColor: "transparent", border: "none" }}
                        onClick={() => setShow("privacy_policy")}
                    >
                        {Translation.t(context.lang, "privacy_policy")}
                    </button>
                    <button
                        className="px-3"
                        style={{ backgroundColor: "transparent", border: "none" }}
                        onClick={() => setShow("sales_terms")}
                    >
                        {Translation.t(context.lang, "sales_terms")}
                    </button>
                </Navbar>
                <Row>
                    <Col className="text-center pt-3">Copyright &copy; Tsveta Book</Col>
                </Row>
                <Row>
                    <Col className="text-center py-0">
                        <small>
                            <a href="https://mravolak.mine.bg/">mravolak.mine.bz</a>{" "}
                            {Translation.t(context.lang, "free_subdomain")}{" "}
                            <a href="https://freedns.afraid.org/">Free DNS</a>
                        </small>
                    </Col>
                </Row>
            </Container>
        </footer>
    );
};

export default Footer;

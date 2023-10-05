import React, { useContext, useState } from "react";
import { Container, Row, Col, Navbar } from "react-bootstrap";
import GenTermModal from "./GenTermModal";
import CTX from "../utils/context";
import Translation from "../utils/Translation";

const Footer = () => {
    const [show, setShow] = useState(false);
    const { context } = useContext(CTX);
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
                        onClick={() => setShow(true)}
                    >
                        {Translation.t(context.lang, "general_terms")}
                    </button>
                    <GenTermModal show={show} hide={() => setShow(false)} />
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

import React, { useContext, useEffect, useState } from "react";
import { Container, Row, Col, Navbar } from "react-bootstrap";
import CTX from "../utils/context";
import Translation from "../utils/Translation";
import { useDispatch, useSelector } from "react-redux";
import { getFooterTerms } from "../store/actions/footerActions";
import { Link } from "react-router-dom";

const Footer = () => {
    const [show, setShow] = useState("");
    const { context } = useContext(CTX);

    const dispatch = useDispatch();

    const footer = useSelector((state) => state.footer.footer);
    const user = useSelector((state) => state.userData.userInfo);

    useEffect(() => {
        dispatch(getFooterTerms());
    }, []);

    useEffect(() => {
        if (show) {
            const link = document.createElement("a");
            link.href = `${window.location.origin}/#/footer/${show}?next=${window.location.hash.slice(1)}`;
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
                    <Col xs={user && user.isAdmin ? 11 : 12}>
                        <Row>
                            {footer?.length > 0 &&
                                footer.map((key) => (
                                    <Col key={key.id} xs={footer.length > 5 ? 2 : ""}>
                                        <button
                                            className="px-3"
                                            style={{ backgroundColor: "transparent", border: "none" }}
                                            onClick={() => setShow(key.mainKey)}
                                        >
                                            {
                                                key[
                                                    "title" +
                                                        context.lang.charAt(0).toUpperCase() +
                                                        context.lang.slice(1)
                                                ]
                                            }
                                        </button>
                                    </Col>
                                ))}
                            <Col>
                                <button
                                    className="px-3"
                                    style={{ backgroundColor: "transparent", border: "none" }}
                                    onClick={() => setShow("sales_terms")}
                                >
                                    {Translation.t(context.lang, "sales_terms")}
                                </button>
                            </Col>
                        </Row>
                    </Col>
                    <Col>
                        {user && user.isAdmin && (
                            <Link to={"/admin/footer/"}>
                                <i className="fa fa-pen-to-square"></i>
                            </Link>
                        )}
                    </Col>
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

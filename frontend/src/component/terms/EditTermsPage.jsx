import React, { useContext, useState, useEffect } from "react";
import CTX from "../../utils/context";
import { Alert, Button, Col, Form, InputGroup, ListGroup, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import TinyEditor from "../TinyEditor";
import { createKey, deleteKey, getFooterTerms, modifyKey } from "../../store/actions/footerActions";

const initCurrent = {
    mainKey: "new",
    titleBg: "",
    titleEn: "",
    htmlBg: "",
    htmlEn: "",
    id: "",
};

const EditTermsPage = () => {
    const { context } = useContext(CTX);

    const dispatch = useDispatch();
    const { loading: footerLoading, footer, error: footerError } = useSelector((state) => state.footer);
    const { loading, term, success, error } = useSelector((state) => state.term);
    const [curr, setCurrent] = useState(initCurrent);

    let titleKey = "title" + context.lang.charAt(0).toUpperCase() + context.lang.slice(1);
    let htmlKey = "html" + context.lang.charAt(0).toUpperCase() + context.lang.slice(1);

    const changeEvent = (e) => {
        setCurrent((prev) => {
            return { ...prev, [e.target.id]: e.target.value };
        });
    };

    const createNewKey = () => {
        setCurrent(initCurrent);
    };

    const modifyCurrentKey = () => {
        if (footer && curr.id && footer.find((f) => f.id === curr.id)) {
            // put
            dispatch(modifyKey(curr));
        } else {
            confirm("The key is not existing yet. Rather use 'Set new key' button");
        }
    };

    const setNewKey = () => {
        if (footer && footer.find((f) => f.mainKey === curr.mainKey)) {
            confirm("This key already exists");
        } else {
            // creating new after check for uniqueness
            dispatch(createKey(curr));
        }
    };

    const deleteCurrentKey = () => {
        if (footer && curr.id && footer.find((f) => f.id === curr.id)) {
            // deleting
            dispatch(deleteKey(curr.id));
        }
        setCurrent(initCurrent);
    };

    useEffect(() => {
        if (footer.length === 0) {
            dispatch(getFooterTerms());
        } else if (footer && footer.find((f) => f.mainKey === curr.mainKey)) {
            setCurrent(footer.find((f) => f.mainKey === curr.mainKey));
        }
    }, [footer]);

    useEffect(() => {
        if (success) {
            dispatch(getFooterTerms());
        }
    }, [success]);

    return (
        <Row>
            <ListGroup className="col-12 col-sm-4 col-md-3 col-lg-2">
                {footer
                    ?.map((f) => (
                        <ListGroup.Item
                            key={f.id}
                            action
                            onClick={() => setCurrent(f)}
                            active={f.mainKey === curr.mainKey}
                        >
                            {f.mainKey}
                        </ListGroup.Item>
                    ))
                    .sort((a, b) => +a.key - +b.key)}
                <ListGroup.Item action onClick={() => createNewKey()}>
                    <i className="fa fa-plus"></i> start new
                </ListGroup.Item>
            </ListGroup>
            <Col>
                <Row>
                    {(error || footerError) && <Alert variant="danger">{error || footerError}</Alert>}
                    <Form>
                        <InputGroup>
                            <InputGroup.Text id="basic-addon0">mainKey</InputGroup.Text>
                            <Form.Control
                                id="mainKey"
                                placeholder="mainKey"
                                aria-label="mainKey"
                                aria-describedby="basic-addon0"
                                value={curr.mainKey}
                                onChange={changeEvent}
                                style={{ minWidth: "66%" }}
                            />
                            {footer && footer.find((f) => f.id === curr.id) ? (
                                <>
                                    <Button
                                        variant="outline-success"
                                        id="button-addon0"
                                        onClick={modifyCurrentKey}
                                        disabled={loading || footerLoading}
                                    >
                                        Modify this key
                                    </Button>
                                    <Button
                                        variant="danger"
                                        id="button-addon02"
                                        onClick={deleteCurrentKey}
                                        disabled={loading || footerLoading}
                                    >
                                        Delete this key
                                    </Button>
                                </>
                            ) : (
                                <Button
                                    variant="success"
                                    id="button-addon01"
                                    onClick={setNewKey}
                                    disabled={loading || footerLoading}
                                >
                                    Set new key
                                </Button>
                            )}
                        </InputGroup>
                        <InputGroup className="mt-3">
                            <InputGroup.Text id="basic-addon1">{titleKey}</InputGroup.Text>
                            <Form.Control
                                id={titleKey}
                                placeholder="title"
                                aria-label="title"
                                aria-describedby="basic-addon1"
                                value={curr[titleKey]}
                                onChange={changeEvent}
                                style={{ minWidth: "66%" }}
                            />
                            <InputGroup.Text id="basic-addon1">
                                Current Language: <span style={{ color: "blue" }}>{context.lang}</span>
                            </InputGroup.Text>
                        </InputGroup>
                    </Form>
                </Row>
                <Row>
                    {curr && (
                        <TinyEditor
                            initValue={curr[htmlKey] || ""}
                            saveNewValue={(e) => {
                                changeEvent({ target: { id: htmlKey, value: e } });
                            }}
                        />
                    )}
                </Row>
            </Col>
        </Row>
    );
};

export default EditTermsPage;

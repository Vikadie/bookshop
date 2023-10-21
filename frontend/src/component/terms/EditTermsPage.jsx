import React, { useContext, useState, useEffect } from "react";
import CTX from "../../utils/context";
import { Alert, Button, Col, Form, InputGroup, ListGroup, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import TinyEditor from "../TinyEditor";
import { checkKey, getFooterTerms } from "../../store/actions/footerActions";

const initCurrent = {
    mainKey: "new",
    titleBg: "",
    titleEn: "",
    htmlBg: "",
    htmlEn: "",
};

const EditTermsPage = () => {
    const { context } = useContext(CTX);

    const dispatch = useDispatch();
    const { loading, existing, footer, error } = useSelector((state) => state.footer);
    const [curr, setCurrent] = useState(initCurrent);
    const [errorMsg, setErrorMsg] = useState("NB!! Change the key! This one already exists");

    let titleKey = "title" + context.lang.charAt(0).toUpperCase() + context.lang.slice(1);
    let htmlKey = "html" + context.lang.charAt(0).toUpperCase() + context.lang.slice(1);
    console.log(htmlKey, " htmlKey + curr[hrmlKey] = ", curr[htmlKey]);

    const changeEvent = (e) => {
        console.log("changevent: ", `[${e.target.id}]: ${e.target.value}`);
        setCurrent((prev) => {
            return { ...prev, [e.target.id]: e.target.value };
        });
    };

    const createNewKey = () => {
        setCurrent(initCurrent);
    };
    console.log("vurr", curr);

    const checkKeyHandler = () => {
        dispatch(checkKey(curr.mainKey));
        setErrorMsg("NB!! Change the key! This one already exists");
    };

    const setNewKey = () => {
        if (existing) {
            setErrorMsg("Please, verify key uniqueness first!");
            return;
        }
    };

    useEffect(() => {
        if (footer.length === 0) {
            dispatch(getFooterTerms());
        } else if (footer && footer.find((f) => f.mainKey === curr.mainKey)) {
            setCurrent(footer.find((f) => f.mainKey === curr.mainKey));
        }
    }, [footer]);

    return (
        <Row>
            <ListGroup className="col-12 col-sm-4 col-md-3 col-lg-2">
                {footer?.map((f) => (
                    <ListGroup.Item
                        key={f.id}
                        action
                        onClick={() => setCurrent(f)}
                        active={f.mainKey === curr.mainKey}
                    >
                        {f.mainKey}
                    </ListGroup.Item>
                ))}
                <ListGroup.Item action onClick={() => createNewKey()}>
                    <i className="fa fa-plus"></i> add new
                </ListGroup.Item>
            </ListGroup>
            <Col>
                <Row>
                    {existing && (
                        <Alert variant={errorMsg.startsWith("NB") ? "warning" : "danger"}>{errorMsg}</Alert>
                    )}
                    {error && <Alert variant="danger">{error}</Alert>}
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
                            />
                            <Button
                                variant={existing ? "danger" : "outline-success"}
                                id="button-addon0"
                                onClick={checkKeyHandler}
                            >
                                Verify key uniqueness
                            </Button>
                            <Button variant="outline-danger" id="button-addon01" onClick={setNewKey}>
                                Set this key
                            </Button>
                        </InputGroup>
                        <InputGroup className="mt-3">
                            <InputGroup.Text id="basic-addon1">
                                {"title" + context.lang.charAt(0).toUpperCase() + context.lang.slice(1)}
                            </InputGroup.Text>
                            <Form.Control
                                id={titleKey}
                                placeholder="title"
                                aria-label="title"
                                aria-describedby="basic-addon1"
                                value={curr[titleKey]}
                                onChange={changeEvent}
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

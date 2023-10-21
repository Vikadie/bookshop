import React, { useContext, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import CTX from "../../utils/context";
import { useSelector } from "react-redux";

const TermsPage = () => {
    const { context } = useContext(CTX);
    const { mainKey } = useParams();
    console.log(mainKey);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const next = `${searchParams.get("next") ? searchParams.get("next") : "/"}`;

    const footer = useSelector((state) => state.footer.footer);
    let title;
    let content;
    if (Object.keys(footer).length > 0) {
        const currView = footer && footer.find((f) => f["mainKey"] === mainKey);

        title = currView["title" + context.lang.charAt(0).toUpperCase() + context.lang.slice(1)];
        content = currView["html" + context.lang.charAt(0).toUpperCase() + context.lang.slice(1)];
    }

    useEffect(() => {
        if (content) {
            const a = document.getElementById("content");
            a.innerHTML = content;
        }
    }, [content]);
    return (
        <Modal
            show={true}
            onHide={() => {
                navigate(next);
            }}
            onEscapeKeyDown={() => {
                navigate(next);
            }}
            // dialogClassName="modal-90w"
            size="lg"
            aria-labelledby="delivery"
            scrollable
        >
            <Modal.Header closeButton>
                <Modal.Title id="delivery">{title && title}</Modal.Title>
            </Modal.Header>
            <Modal.Body id="content"></Modal.Body>
        </Modal>
    );
};

export default TermsPage;

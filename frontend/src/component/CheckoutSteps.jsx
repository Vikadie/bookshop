import React, { useContext } from "react";
import { ProgressBar } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import CTX from "../utils/context";
import Translation from "../utils/Translation";

const CheckoutSteps = ({ step1, step2, step3, step4 }) => {
    const { context } = useContext(CTX);
    const navigate = useNavigate();
    return (
        <ProgressBar className="justify-content-center mb-4" style={{ height: "2rem", fontSize: "1rem" }}>
            <ProgressBar
                now={24}
                variant="dark"
                striped={!step1 || false}
                animated={step1 ? false : true}
                onClick={() => (step1 ? navigate("/login") : null)}
                onMouseEnter={() => (step1 ? (document.body.style.cursor = "pointer") : null)}
                onMouseLeave={() => (document.body.style.cursor = "auto")}
                label={Translation.t(context.lang, "login") + " ->"}
            />
            <ProgressBar now={1} variant="dark" />
            <ProgressBar
                now={24}
                variant="dark"
                striped={!step2 || false}
                animated={step2 ? false : true}
                onClick={() => (step2 ? navigate("/shipping") : null)}
                onMouseEnter={() => (step2 ? (document.body.style.cursor = "pointer") : null)}
                onMouseLeave={() => (document.body.style.cursor = "auto")}
                label={Translation.t(context.lang, "shipping") + " ->"}
            />
            <ProgressBar now={1} variant="dark" />
            <ProgressBar
                now={24}
                variant="dark"
                striped={!step3 || false}
                animated={step3 ? false : true}
                onClick={() => (step3 ? navigate("/payment") : null)}
                onMouseEnter={() => (step3 ? (document.body.style.cursor = "pointer") : null)}
                onMouseLeave={() => (document.body.style.cursor = "auto")}
                label={Translation.t(context.lang, "payment") + " ->"}
            />
            <ProgressBar now={1} variant="dark" />
            <ProgressBar
                now={24}
                variant="dark"
                striped={!step4 || false}
                animated={step4 ? false : true}
                onClick={() => (step4 ? navigate("/placeorder") : null)}
                onMouseEnter={() => (step4 ? (document.body.style.cursor = "pointer") : null)}
                onMouseLeave={() => (document.body.style.cursor = "auto")}
                label={Translation.t(context.lang, "place_order") + " ->"}
            />
        </ProgressBar>
    );
};

export default CheckoutSteps;

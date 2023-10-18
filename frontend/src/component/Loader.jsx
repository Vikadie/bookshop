import React, { useContext } from "react";
import { Spinner } from "react-bootstrap";
import CTX from "../utils/context";
import Translation from "../utils/Translation";

const Loader = () => {
    const { context } = useContext(CTX);
    return (
        <>
            <Spinner
                animation="grow"
                variant="dark"
                role="status"
                style={{ height: "100px", width: "100px", margin: "auto", display: "block" }}
            ></Spinner>
            <h3 className="text-center">{Translation.t(context.lang, "loading")}</h3>
        </>
    );
};

export default Loader;

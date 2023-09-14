import React from "react";
import { Spinner } from "react-bootstrap";

const Loader = () => {
    return (
        <>
            <Spinner
                animation="grow"
                variant="dark"
                role="status"
                style={{ height: "100px", width: "100px", margin: "auto", display: "block" }}
            ></Spinner>
            <h3 className="text-center">Loading...</h3>
        </>
    );
};

export default Loader;

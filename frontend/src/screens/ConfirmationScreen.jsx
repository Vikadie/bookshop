import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { loginConfirmed } from "../store/actions/userActions";

function ConfirmationScreen() {
    const { key } = useParams();
    const dispatch = useDispatch();

    const navigate = useNavigate();
    const location = useLocation();
    const redirect = location.search ? location.search.split("=")[1] : "/";

    const { loading, userInfo, error } = useSelector((state) => state.userData);

    useEffect(() => {
        if (key) {
            dispatch(loginConfirmed(key));
        }
    }, [key]);

    useEffect(() => {
        if (userInfo) {
            navigate(redirect);
        }
    }, [navigate, userInfo, redirect]);
    return (
        <>
            <h1>Redirecting...</h1>
            {error && <Alert variant="danger">{error}</Alert>}
            {loading && <Loader />}
        </>
    );
}

export default ConfirmationScreen;

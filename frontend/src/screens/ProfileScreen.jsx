import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Alert, Button, Col, Form, Row, Table } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { getUserDetails, updateUserProfile } from "../store/actions/userActions";
import { updateUserActions } from "../store/reducers/userReducer";
import { getMyOrders } from "../store/actions/orderActions";
import Loader from "../component/Loader";
import CTX from "../utils/context";
import Translation from "../utils/Translation";

const ProfileScreen = () => {
    const { context } = useContext(CTX);

    const [name, setName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const navigate = useNavigate();

    const dispatch = useDispatch();
    const { loading, user, userInfo, error } = useSelector((state) => state.userData);
    const { success } = useSelector((state) => state.userUpdate);
    const { orders, loading: myOrdersLoading, error: myOrdersError } = useSelector((state) => state.orders);

    const init = () => {
        dispatch(updateUserActions.updateProfileReset());
        dispatch(getUserDetails("profile"));
        dispatch(getMyOrders());
        setConfirmPassword("");
        setPassword("");
    };

    useEffect(() => {
        if (!userInfo) {
            navigate("/login");
        } else {
            if (!user || !user.name || success || userInfo._id !== user._id) {
                success ? setTimeout(init, 1000) : init();
            } else {
                setName(user.name);
                setLastName(user.lastName);
                setEmail(user.email);
            }
        }
    }, [dispatch, navigate, userInfo, user, success]);

    useEffect(() => {
        if (error) {
            document.getElementById("email").focus();
        }
    }, [error]);

    const submitHandler = (e) => {
        e.preventDefault();

        if (password != confirmPassword) {
            setErrorMessage(Translation.t(context.lang, "password_nomatch"));
            document.getElementById("confirmPassword").focus();
            return;
        }
        dispatch(
            updateUserProfile({
                id: user._id,
                name,
                lastName,
                email,
                password,
            })
        );
    };
    return (
        <Row>
            <Col md={3}>
                <h2>{Translation.t(context.lang, "user_profile")}</h2>
                {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
                {error && <Alert variant="danger">{error}</Alert>}
                {success && <Alert variant="success">{Translation.t(context.lang, "success")}</Alert>}
                {loading && <Loader />}
                <Form onSubmit={submitHandler}>
                    <Form.Group controlId="name" className="mb-3">
                        <Form.Label>{Translation.t(context.lang, "name")}</Form.Label>
                        <Form.Control
                            required
                            type="name"
                            placeholder={Translation.t(context.lang, "e_name")}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            autoComplete="new-name"
                        ></Form.Control>
                    </Form.Group>

                    <Form.Group controlId="lastName" className="mb-3">
                        <Form.Label>{Translation.t(context.lang, "last_name")}</Form.Label>
                        <Form.Control
                            required
                            type="name"
                            placeholder={Translation.t(context.lang, "e_last_name")}
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            autoComplete="new-name"
                        ></Form.Control>
                    </Form.Group>

                    <Form.Group controlId="email" className="mb-3">
                        <Form.Label>{Translation.t(context.lang, "email")}</Form.Label>
                        <Form.Control
                            required
                            type="email"
                            placeholder={Translation.t(context.lang, "e_email")}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            autoComplete="new-email"
                        ></Form.Control>
                    </Form.Group>

                    <Form.Group controlId="password" className="mb-3">
                        <Form.Label>{Translation.t(context.lang, "password")}</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder={Translation.t(context.lang, "e_password")}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoComplete="new-password"
                        ></Form.Control>
                    </Form.Group>

                    <Form.Group controlId="confirmPassword" className="mb-3">
                        <Form.Label>{Translation.t(context.lang, "password")}</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder={Translation.t(context.lang, "ec_password")}
                            value={confirmPassword}
                            onChange={(e) => {
                                setConfirmPassword(e.target.value);
                                setErrorMessage("");
                            }}
                            style={{ color: `${errorMessage ? "red" : ""}` }}
                            autoComplete="new-password"
                        ></Form.Control>
                    </Form.Group>

                    <Col align="center">
                        <Button type="submit" variant="primary">
                            {Translation.t(context.lang, "update")}
                        </Button>
                    </Col>
                </Form>
            </Col>

            <Col md={9}>
                <h2>{Translation.t(context.lang, "my_orders")}</h2>
                {myOrdersLoading ? (
                    <Loader />
                ) : myOrdersError ? (
                    <Alert variant="danger">{myOrdersError}</Alert>
                ) : (
                    <Table striped responsive className="table-sm">
                        <thead>
                            <tr>
                                <th>{Translation.t(context.lang, "id")}</th>
                                <th>{Translation.t(context.lang, "date")}</th>
                                <th>{Translation.t(context.lang, "total")}</th>
                                <th>{Translation.t(context.lang, "paid")}</th>
                                <th>{Translation.t(context.lang, "delivered")}</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {[...orders].reverse().map((order) => (
                                <tr key={order._id}>
                                    <td>{order._id}</td>
                                    <td>
                                        {new Date(order.createdAt).toLocaleDateString(
                                            context.lang === "bg" ? "bg-BG" : "en-us",
                                            {
                                                weekday: "short",
                                                year: "numeric",
                                                month: "short",
                                                day: "numeric",
                                            }
                                        )}
                                    </td>
                                    <td>
                                        {order.totalPrice} {Translation.t(context.lang, "bgn")}
                                    </td>
                                    <td>
                                        {order.isPaid ? (
                                            new Date(order.paidAt).toLocalDateString()
                                        ) : (
                                            <i className="fas fa-times" style={{ color: "red" }}></i>
                                        )}
                                    </td>
                                    <td>
                                        {order.isDelivered ? (
                                            new Date(order.deliveredAt).toDateString()
                                        ) : (
                                            <i className="fas fa-times" style={{ color: "red" }}></i>
                                        )}
                                    </td>
                                    <td>
                                        <LinkContainer to={`/order/${order._id}`}>
                                            <Button className="btn-sm">
                                                {Translation.t(context.lang, "details")}
                                            </Button>
                                        </LinkContainer>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                )}
            </Col>
        </Row>
    );
};

export default ProfileScreen;

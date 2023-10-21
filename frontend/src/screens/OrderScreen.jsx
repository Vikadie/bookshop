import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getOrderDetails, payOrder, deliverOrder } from "../store/actions/orderActions";
import { Alert, Button, Col, Image, ListGroup, Row } from "react-bootstrap";
import { orderPayActions, orderDeliveredActions } from "../store/reducers/orderReducer";
import Loader from "../component/Loader";
import { PayPalButton } from "react-paypal-button-v2";
import CTX from "../utils/context";
import Translation from "../utils/Translation";

// import PayPalCheckout from "../component/paypal/PayPalCheckout";

// PayPal Client ID: AR0ptPpzaDy8H3c5I_wUNkJxnTujp_jkJaOq5UcdpLczTgLG9zEp-k5gqjKNDZE2GsAjO6n7T_kiTKfa
const payPalClientID = "AR0ptPpzaDy8H3c5I_wUNkJxnTujp_jkJaOq5UcdpLczTgLG9zEp-k5gqjKNDZE2GsAjO6n7T_kiTKfa";

const OrderScreen = () => {
    const { context } = useContext(CTX);

    const { id: orderId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { order, error, loading } = useSelector((state) => state.order);
    const {
        success: successPay,
        error: errorPay,
        loading: loadingPay,
    } = useSelector((state) => state.orderPay);
    const {
        success: successDelivered,
        error: errorDelivered,
        loading: loadingDelivered,
    } = useSelector((state) => state.orderDelivered);
    const { userInfo } = useSelector((state) => state.userData);

    const [sdkReady, setSdkReady] = useState(false);

    let itemsPrice;
    if (!loading && !error) {
        itemsPrice = order?.orderItems?.reduce((acc, item) => acc + +item.price * +item.qty, 0);
    }

    const addPayPalScript = () => {
        const script = document.createElement("script");
        script.type = "text/javascript";
        script.src = `https://www.paypal.com/sdk/js?client-id=${payPalClientID}&currency=EUR`;
        script.async = true;
        script.onload = () => {
            setSdkReady(true);
        };
        document.body.appendChild(script);
    };

    useEffect(() => {
        if (!userInfo) {
            navigate("/login");
        }

        if (!order || successPay || order._id !== +orderId || successDelivered) {
            dispatch(orderPayActions.orderPayReset());
            dispatch(orderDeliveredActions.orderDeliveredReset());
            dispatch(getOrderDetails(orderId));
        } else if (order.paymentMethod === "PayPal" && !order.isPaid) {
            if (!window.paypal) {
                addPayPalScript();
            } else {
                setSdkReady(true);
            }
        }
    }, [order, orderId, dispatch, successPay, successDelivered]);

    const successPaymentHandler = (paymentResult) => {
        dispatch(payOrder(orderId, paymentResult));
    };
    const deliverHandler = () => {
        dispatch(deliverOrder(order));
    };

    return loading ? (
        <Loader />
    ) : error ? (
        <Alert variant="danger">{error}</Alert>
    ) : (
        order._id && (
            <div>
                <h1>
                    {Translation.t(context.lang, "order")}: {order._id}
                </h1>
                <Row>
                    <Col md={8}>
                        <ListGroup variant="flush">
                            <ListGroup.Item>
                                <h2>{Translation.t(context.lang, "shipping")}:</h2>

                                <p>
                                    <strong>{Translation.t(context.lang, "name")}: </strong> {order.user.name}
                                </p>
                                <p>
                                    <strong>{Translation.t(context.lang, "email")}: </strong>{" "}
                                    <a href={`mailto:${order.user.email}`}>{order.user.email}</a>
                                </p>

                                <p>
                                    <strong>{Translation.t(context.lang, "shipping_to")}: </strong>
                                    {order.shippingAddress.address}, {order.shippingAddress.city}
                                    {"  "}
                                    {order.shippingAddress.postalCode},{"  "}
                                    {order.shippingAddress.country}
                                </p>

                                {order.isDelivered ? (
                                    <Alert variant="success">
                                        {Translation.t(context.lang, "delivered_on")}{" "}
                                        {new Date(order.deliveredAt).toLocaleDateString("en-us", {
                                            weekday: "long",
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                        })}
                                    </Alert>
                                ) : (
                                    <Alert variant="warning">
                                        {Translation.t(context.lang, "not_delivered")}
                                    </Alert>
                                )}
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <h2>{Translation.t(context.lang, "payment_method")}</h2>

                                <p>
                                    <strong>{Translation.t(context.lang, "p_method")}: </strong>
                                    {Translation.t(context.lang, order.paymentMethod)}
                                </p>

                                {order.isPaid ? (
                                    <Alert variant="success">
                                        {Translation.t(context.lang, "paid_on")}{" "}
                                        {new Date(order.paidAt).toLocaleDateString("en-us", {
                                            weekday: "long",
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                        })}
                                    </Alert>
                                ) : (
                                    <Alert variant="warning">{Translation.t(context.lang, "not_paid")}</Alert>
                                )}
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <h2>{Translation.t(context.lang, "order_items")}</h2>

                                {order.orderItems.length === 0 ? (
                                    <Alert variant="info">
                                        {Translation.t(context.lang, "empty_order")}{" "}
                                        {<Link to="/">{Translation.t(context.lang, "go_back")}</Link>}
                                    </Alert>
                                ) : (
                                    <ListGroup variant="flush">
                                        {order.orderItems.map((item, index) => (
                                            <ListGroup.Item key={index}>
                                                <Row>
                                                    <Col md={1}>
                                                        <Image
                                                            src={item.image}
                                                            alt={item.name}
                                                            fluid
                                                            rounded
                                                        />
                                                    </Col>
                                                    <Col>
                                                        <Link to={`/product/${item.product}`}>
                                                            {item.name}
                                                        </Link>
                                                    </Col>

                                                    <Col md={4}>
                                                        {item.qty} x {item.price}{" "}
                                                        {Translation.t(context.lang, "bgn")} ={" "}
                                                        {(+item.qty * +item.price).toFixed(2)}{" "}
                                                        {Translation.t(context.lang, "bgn")}
                                                    </Col>
                                                </Row>
                                            </ListGroup.Item>
                                        ))}
                                    </ListGroup>
                                )}
                            </ListGroup.Item>
                        </ListGroup>
                    </Col>
                    <Col md={4}>
                        <ListGroup variant="flush">
                            <ListGroup.Item>
                                <h2>{Translation.t(context.lang, "order_summary")}</h2>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>{Translation.t(context.lang, "Items")}: </Col>
                                    <Col>
                                        {itemsPrice && itemsPrice.toFixed(2)}{" "}
                                        {Translation.t(context.lang, "bgn")}
                                    </Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>{Translation.t(context.lang, "shipping")}: </Col>
                                    <Col>
                                        {order?.shippingPrice} {Translation.t(context.lang, "bgn")}
                                    </Col>
                                </Row>
                            </ListGroup.Item>

                            {order.paymentMethod === "PayPal" && (
                                <ListGroup.Item>
                                    <Row>
                                        <Col>{Translation.t(context.lang, "taxPayPal")}: </Col>
                                        <Col>
                                            {order?.taxPrice} {Translation.t(context.lang, "bgn")}
                                        </Col>
                                    </Row>
                                </ListGroup.Item>
                            )}

                            <ListGroup.Item>
                                <Row>
                                    <Col>{Translation.t(context.lang, "total")}: </Col>
                                    <Col>
                                        {order?.totalPrice} {Translation.t(context.lang, "bgn")}
                                    </Col>
                                </Row>
                            </ListGroup.Item>

                            {!order.isPaid && (
                                <ListGroup.Item className="pt-3">
                                    {loadingPay && <Loader />}
                                    {order.paymentMethod === "PayPal" && !sdkReady ? (
                                        <Loader />
                                    ) : (
                                        <PayPalButton
                                            amount={(+order?.totalPrice / 1.95583).toFixed(2)}
                                            options={{ currency: "EUR" }}
                                            onSuccess={successPaymentHandler}
                                        />
                                        // <PayPalCheckout
                                        //     amount={(+order?.totalPrice / 1.95).toFixed(2)}
                                        //     currency="EUR"
                                        //     onSuccess={successPaymentHandler}
                                        // />
                                    )}
                                    {order.paymentMethod === "PayOnDelivery" &&
                                        userInfo &&
                                        userInfo.isAdmin && (
                                            <Button
                                                type="button"
                                                className="btn btn-block"
                                                style={{ width: "100%" }}
                                                onClick={() => successPaymentHandler(true)}
                                            >
                                                {Translation.t(context.lang, "mark_paid")}
                                            </Button>
                                        )}
                                </ListGroup.Item>
                            )}
                            {loadingDelivered && <Loader />}
                            {userInfo && userInfo.isAdmin && order.isPaid && (
                                <ListGroup.Item>
                                    <Button
                                        type="button"
                                        className="btn btn-block"
                                        style={{ width: "100%" }}
                                        onClick={deliverHandler}
                                        disabled={order.isDelivered}
                                    >
                                        {Translation.t(context.lang, "mark_delivered")}
                                    </Button>
                                </ListGroup.Item>
                            )}
                        </ListGroup>
                    </Col>
                </Row>
            </div>
        )
    );
};

export default OrderScreen;

import React, { useContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import CheckoutSteps from "../component/CheckoutSteps";
import { Alert, Button, Col, Image, ListGroup, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { createOrder, resetOrder } from "../store/actions/orderActions";
import CTX from "../utils/context";
import Translation from "../utils/Translation";

const PlaceOrderScreen = () => {
    const { context } = useContext(CTX);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { order, error, success } = useSelector((state) => state.order);
    const cart = useSelector((state) => state.cart);

    const itemsPrice = cart.cartItems.reduce((acc, item) => acc + +item.price * +item.qty, 0);

    const shippingPrice = itemsPrice > 100 ? 0 : 5;

    const taxPrice =
        cart.paymentMethod === "PayPal"
            ? 0.06 * (itemsPrice + shippingPrice) > 20 * 1.95583
                ? 20
                : 0.06 * (itemsPrice + shippingPrice)
            : 0;

    const totalPrice = itemsPrice + shippingPrice + taxPrice;

    if (!cart.paymentMethod) {
        navigate("/payment");
    }

    useEffect(() => {
        if (success) {
            navigate(`/order/${order._id}`);
            dispatch(resetOrder());
        }
    }, [success, order, navigate]); // on success or existing order id navigate the user tp his acount to see it there

    const placeOrder = () => {
        dispatch(
            createOrder({
                orderItems: cart.cartItems,
                shippingAddress: cart.shippingAddress,
                paymentMethod: cart.paymentMethod,
                itemsPrice,
                shippingPrice,
                taxPrice,
                totalPrice,
            })
        );
    };
    return (
        <div>
            <CheckoutSteps step1 step2 step3 step4 />
            <Row>
                <Col md={8}>
                    <ListGroup variant="flush">
                        <ListGroup.Item>
                            <h2>{Translation.t(context.lang, "shipping")}</h2>

                            <p>
                                <strong>{Translation.t(context.lang, "shipping_to")}: </strong>
                            </p>
                            <p>
                                {cart.shippingAddress.office && (
                                    <i className="fa fa-location-dot fa-beat"></i>
                                )}
                                {cart.shippingAddress.forwarder !== "other" && cart.shippingAddress.forwarder}{" "}
                                {cart.shippingAddress.address}
                                {"  "}
                            </p>
                            <p>
                                <i className="fa fa-map-location-dot"></i> {cart.shippingAddress.city}{" "}
                                {cart.shippingAddress.postalCode},{"  "}
                                {cart.shippingAddress.country}
                            </p>
                            <hr />
                            <p>
                                <i className="fa fa-phone"></i> {cart.shippingAddress.phone}
                                <br />
                                {cart.shippingAddress.comments && <i className="fa fa-comments"></i>}{" "}
                                {cart.shippingAddress.comments}
                            </p>
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <h2>{Translation.t(context.lang, "payment_method")}</h2>

                            <p>
                                <strong>{Translation.t(context.lang, "p_method")}: </strong>
                                {cart.paymentMethod}
                            </p>
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <h2>{Translation.t(context.lang, "order_items")}</h2>

                            {cart.cartItems.length === 0 ? (
                                <Alert variant="info">
                                    {Translation.t(context.lang, "empty_cart")}{" "}
                                    {<Link to="/">{Translation.t(context.lang, "go_back")}</Link>}
                                </Alert>
                            ) : (
                                <ListGroup variant="flush">
                                    {cart.cartItems.map((item, index) => (
                                        <ListGroup.Item key={index}>
                                            <Row>
                                                <Col md={1}>
                                                    <Image src={item.image} alt={item.name} fluid rounded />
                                                </Col>
                                                <Col>
                                                    <Link to={`/product/${item.product}`}>{item.name}</Link>
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
                                    {itemsPrice.toFixed(2)} {Translation.t(context.lang, "bgn")}
                                </Col>
                            </Row>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <Row>
                                <Col>{Translation.t(context.lang, "shipping")}: </Col>
                                <Col>
                                    {shippingPrice.toFixed(2)} {Translation.t(context.lang, "bgn")}
                                </Col>
                            </Row>
                        </ListGroup.Item>

                        {taxPrice > 0 && (
                            <ListGroup.Item>
                                <Row>
                                    <Col>{Translation.t(context.lang, "taxPayPal")}: </Col>
                                    <Col>
                                        {taxPrice.toFixed(2)} {Translation.t(context.lang, "bgn")}
                                    </Col>
                                </Row>
                            </ListGroup.Item>
                        )}

                        <ListGroup.Item>
                            <Row>
                                <Col>Total: </Col>
                                <Col>
                                    {totalPrice.toFixed(2)} {Translation.t(context.lang, "bgn")}
                                </Col>
                            </Row>
                        </ListGroup.Item>

                        <ListGroup.Item>
                            {error && <Alert variant="danger">{error.message}</Alert>}
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <Button
                                type="button"
                                className="btn-block"
                                disabled={cart.cartItems.length === 0}
                                onClick={placeOrder}
                                style={{ width: "100%" }}
                            >
                                {Translation.t(context.lang, "place_order")}
                            </Button>
                        </ListGroup.Item>
                    </ListGroup>
                </Col>
            </Row>
        </div>
    );
};

export default PlaceOrderScreen;

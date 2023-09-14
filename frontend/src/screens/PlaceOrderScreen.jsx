import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import CheckoutSteps from "../component/CheckoutSteps";
import { Alert, Button, Col, Image, ListGroup, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { createOrder, resetOrder } from "../store/actions/orderActions";
import axios from "axios";

const PlaceOrderScreen = () => {
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
                            <h2>Shipping</h2>

                            <p>
                                <strong>Shipping: </strong>
                                {cart.shippingAddress.address}, {cart.shippingAddress.city}
                                {"  "}
                                {cart.shippingAddress.postalCode},{"  "}
                                {cart.shippingAddress.country}
                            </p>
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <h2>Payment method</h2>

                            <p>
                                <strong>Method: </strong>
                                {cart.paymentMethod}
                            </p>
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <h2>Ordered Items</h2>

                            {cart.cartItems.length === 0 ? (
                                <Alert variant="info">You cart is empty {<Link to="/">Go Back</Link>}</Alert>
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
                                                    {item.qty} x {item.price} BGN ={" "}
                                                    {(+item.qty * +item.price).toFixed(2)} BGN
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
                            <h2>Order Summary</h2>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <Row>
                                <Col>Items: </Col>
                                <Col>{itemsPrice.toFixed(2)} BGN</Col>
                            </Row>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <Row>
                                <Col>Shipping: </Col>
                                <Col>{shippingPrice.toFixed(2)} BGN</Col>
                            </Row>
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <Row>
                                <Col>Tax (+6% for PayPal): </Col>
                                <Col>{taxPrice.toFixed(2)} BGN</Col>
                            </Row>
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <Row>
                                <Col>Total: </Col>
                                <Col>{totalPrice.toFixed(2)} BGN</Col>
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
                                Place Order
                            </Button>
                        </ListGroup.Item>
                    </ListGroup>
                </Col>
            </Row>
        </div>
    );
};

export default PlaceOrderScreen;

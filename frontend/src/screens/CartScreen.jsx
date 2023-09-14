import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import { addToCart, removeFromCart } from "../store/actions/cartActions";
import { Alert, ListGroup, Row, Col, Image, Form, Button } from "react-bootstrap";
import axios from "axios";

const CartScreen = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const dispatch = useDispatch();
    const { id } = useParams();
    const qty = location.search.slice(1);
    const cartItems = useSelector((state) => state.cart.cartItems);

    useEffect(() => {
        if (id && qty) {
            dispatch(addToCart(id, qty));
        }
    }, [qty, id, dispatch]);

    const removeFromCardHandler = (id) => {
        dispatch(removeFromCart(id));
    };

    const checkoutHandler = () => {
        navigate("/login?redirect=/shipping");
    };
    return (
        <Row>
            <Col md={8}>
                <h1>Shopping Cart</h1>
                {cartItems.length === 0 ? (
                    <Alert variant="info">
                        Your cart is empty <Link to="/">Go Back</Link>
                    </Alert>
                ) : (
                    <ListGroup variant="flush">
                        {cartItems.map((item) => (
                            <ListGroup.Item key={item.product}>
                                <Row>
                                    <Col md={2}>
                                        <Image src={item.image} alt={item.name} fluid rounded />
                                    </Col>
                                    <Col md={3}>
                                        <Link to={`/product/${item.product}`}>{item.name}</Link>
                                    </Col>
                                    <Col md={2}>{item.price} BGN</Col>
                                    <Col md={3}>
                                        <Form.Control
                                            as="select"
                                            value={item.qty}
                                            onChange={(e) =>
                                                dispatch(addToCart(item.product, e.target.value))
                                            }
                                        >
                                            {[...Array(item.countInStock).keys()].map((x) => (
                                                <option key={x + 1} value={x + 1}>
                                                    {x + 1}
                                                </option>
                                            ))}
                                        </Form.Control>
                                    </Col>
                                    <Col md={1}>
                                        <Button
                                            type="button"
                                            variant="light"
                                            onClick={() => removeFromCardHandler(item.product)}
                                        >
                                            <i className="fas fa-trash"></i>
                                        </Button>
                                    </Col>
                                </Row>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                )}
            </Col>
            <Col md={4}>
                <ListGroup variant="flush">
                    <ListGroup.Item>
                        <h2>Subtotal ({cartItems.reduce((acc, item) => acc + +item.qty, 0)}) items</h2>
                        {cartItems.reduce((acc, item) => acc + +item.qty * +item.price, 0).toFixed(2)} BGN
                    </ListGroup.Item>

                    <ListGroup.Item>
                        <Button
                            type="button"
                            className="btn-block"
                            style={{ width: "100%" }}
                            disabled={cartItems.length === 0}
                            onClick={checkoutHandler}
                        >
                            Proceed to checkout
                        </Button>
                    </ListGroup.Item>
                </ListGroup>
            </Col>
        </Row>
    );
};

export default CartScreen;

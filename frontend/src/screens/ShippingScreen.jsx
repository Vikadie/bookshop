import React, { useState } from "react";
import FormContainer from "../component/FormContainer";
import { useNavigate } from "react-router-dom";
import { Form, Col, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { saveShippingAddress } from "../store/actions/cartActions";
import CheckoutSteps from "../component/CheckoutSteps";

const ShippingScreen = () => {
    const navigate = useNavigate();

    const dispatch = useDispatch();
    const shippingAddress = useSelector((state) => state.cart.shippingAddress);

    const [address, setAddress] = useState(shippingAddress.address || "");
    const [city, setCity] = useState(shippingAddress.city || "");
    const [postalCode, setPostalCode] = useState(shippingAddress.postalCode || "");
    const [country, setCountry] = useState(shippingAddress.country || "");

    const submitHandler = (e) => {
        e.preventDefault();

        dispatch(
            saveShippingAddress({
                address,
                city,
                postalCode,
                country,
            })
        );

        navigate("/payment");
        console.log("Submitted");
    };
    return (
        <FormContainer>
            <CheckoutSteps step1 step2 />
            <h1>Shipping</h1>
            <Form onSubmit={submitHandler}>
                <Form.Group controlId="address" className="mb-3">
                    <Form.Label>Address</Form.Label>
                    <Form.Control
                        required
                        type="text"
                        placeholder="Enter address"
                        value={address ? address : ""}
                        onChange={(e) => setAddress(e.target.value)}
                        autoComplete="new-address"
                    ></Form.Control>
                </Form.Group>
                <Form.Group controlId="city" className="mb-3">
                    <Form.Label>City</Form.Label>
                    <Form.Control
                        required
                        type="text"
                        placeholder="Enter city"
                        value={city ? city : ""}
                        onChange={(e) => setCity(e.target.value)}
                        autoComplete="new-city"
                    ></Form.Control>
                </Form.Group>
                <Form.Group controlId="postalCode" className="mb-3">
                    <Form.Label>Postal Code</Form.Label>
                    <Form.Control
                        required
                        type="text"
                        placeholder="Enter postalCode"
                        value={postalCode ? postalCode : ""}
                        onChange={(e) => setPostalCode(e.target.value)}
                        autoComplete="new-postal-code"
                    ></Form.Control>
                </Form.Group>
                <Form.Group controlId="country" className="mb-3">
                    <Form.Label>Country</Form.Label>
                    <Form.Control
                        required
                        type="text"
                        placeholder="Enter country"
                        value={country ? country : ""}
                        onChange={(e) => setCountry(e.target.value)}
                        autoComplete="new-country"
                    ></Form.Control>
                </Form.Group>

                <Col align="center">
                    <Button type="submit" variant="primary">
                        Continue
                    </Button>
                </Col>
            </Form>
        </FormContainer>
    );
};

export default ShippingScreen;

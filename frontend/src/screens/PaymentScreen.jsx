import React, { useContext, useState } from "react";
import FormContainer from "../component/FormContainer";
import CheckoutSteps from "../component/CheckoutSteps";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button, Col, Form } from "react-bootstrap";
import { savePaymentMethod } from "../store/actions/cartActions";
import Translation from "../utils/Translation";
import CTX from "../utils/context";

const PaymentScreen = () => {
    const { context } = useContext(CTX);
    const navigate = useNavigate();

    const dispatch = useDispatch();

    const shippingAddress = useSelector((state) => state.cart.shippingAddress);

    const [paymentMethod, setPaymentMethod] = useState("PayOnDelivery");

    if (!shippingAddress.address) {
        navigate("/shipping");
    }

    const changePaymentMethod = (e) => {
        setPaymentMethod(e.target.id);
    };

    const submitHandler = (e) => {
        e.preventDefault();

        dispatch(savePaymentMethod(paymentMethod));

        navigate("/placeorder");
    };
    return (
        <FormContainer>
            <CheckoutSteps step1 step2 step3 />
            <Form onSubmit={submitHandler}>
                <Form.Group controlId="methodSelection" className="mb-3 row">
                    <Form.Label as="legend">{Translation.t(context.lang, "select_method")}</Form.Label>
                    <Col>
                        <Form.Check
                            type="radio"
                            label={Translation.t(context.lang, "PayOnDelivery")}
                            id="PayOnDelivery"
                            name="PayOnDelivery"
                            checked={paymentMethod === "PayOnDelivery"}
                            onChange={changePaymentMethod}
                        ></Form.Check>
                    </Col>
                    <Col>
                        <Form.Check
                            type="radio"
                            label={Translation.t(context.lang, "PayPal")}
                            id="PayPal"
                            name="PayPal"
                            checked={paymentMethod === "PayPal"}
                            onChange={changePaymentMethod}
                            aria-describedby="PayPalHelpBlock"
                        ></Form.Check>
                        {paymentMethod === "PayPal" && (
                            <Form.Text id="PayPalHelpBlock">
                                {Translation.t(context.lang, "PayPalExplanationText")}
                            </Form.Text>
                        )}
                    </Col>
                </Form.Group>

                <Col align="center">
                    <Button type="submit" variant="primary">
                        {Translation.t(context.lang, "continue")}
                    </Button>
                </Col>
            </Form>
        </FormContainer>
    );
};

export default PaymentScreen;

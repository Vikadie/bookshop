import React, { useRef, useEffect, useState } from "react";
import { Alert } from "react-bootstrap";

function PayPalCheckout({ amount, onSuccess, currency }) {
    const paypal = useRef();
    const [transactionStatus, setTransactionStatus] = useState(null);

    useEffect(() => {
        window.paypal
            .Buttons({
                createOrder: (data, actions, err) => {
                    return actions.order.create({
                        intent: "CAPTURE",
                        purchase_units: [
                            {
                                description: "Total order amount",
                                amount: {
                                    currency_code: currency,
                                    value: amount,
                                },
                            },
                        ],
                    });
                },
                onApprove: async (data, actions) => {
                    const order = await actions.order.capture();

                    console.log("success", order);
                    setTransactionStatus("success");
                    onSuccess();
                },
                onError: (err) => {
                    console.log(err);
                    setTransactionStatus("failure");
                },
            })
            .render(paypal.current);
    }, []);

    if (transactionStatus === "success") {
        return <Alert variant="success">{transactionStatus}</Alert>;
    }

    if (transactionStatus === "failure") {
        return <Alert variant="danger">{transactionStatus}</Alert>;
    }

    return (
        <div>
            <div ref={paypal}></div>
        </div>
    );
}

export default PayPalCheckout;

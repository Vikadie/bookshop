import React, { useContext, useState } from "react";
import FormContainer from "../component/FormContainer";
import { useNavigate } from "react-router-dom";
import { Form, Col, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { saveShippingAddress } from "../store/actions/cartActions";
import CheckoutSteps from "../component/CheckoutSteps";
import CTX from "../utils/context";
import GetSpeedyOffices from "../component/GetSpeedyOffices";

const ShippingScreen = () => {
    const { context } = useContext(CTX);
    const navigate = useNavigate();

    const dispatch = useDispatch();
    const shippingAddress = useSelector((state) => state.cart.shippingAddress);

    const [address, setAddress] = useState(shippingAddress.address || "");
    const [city, setCity] = useState(shippingAddress.city || "");
    const [postalCode, setPostalCode] = useState(shippingAddress.postalCode || "");
    const [country, setCountry] = useState(shippingAddress.country || "");

    const [forwarder, setForwarder] = useState(shippingAddress.forwarder || "");
    const changeForwarder = (e) => {
        setForwarder(e.target.id);
    };
    const [office, setOffice] = useState(shippingAddress.office || "");

    const setDetails = (id, name, address, city, postCode) => {
        setAddress(name + " found_on " + address);
        setOffice(id);
        setCity(city);
        setPostalCode(postCode);
    };

    const displayMessage = (event) => {
        if (event.data?.office === undefined) {
            return;
        }
        if (event.origin === `${import.meta.env.VITE_EKONT_OFFICE_LOCATOR}`) {
            let data = event.data.office;
            setDetails(
                data.code,
                data.name,
                data.address.fullAddress,
                data.address.city.name,
                data.address.city.postCode
            );
        }
        console.log(JSON.stringify(event.data.office, null, 4));
    };

    const submitHandler = (e) => {
        e.preventDefault();

        dispatch(
            saveShippingAddress({
                address,
                city,
                postalCode,
                country,
                office,
                forwarder,
            })
        );

        navigate("/payment");
        console.log("Submitted");
    };

    if (forwarder === "Ekont") {
        if (window.addEventListener) {
            window.addEventListener("message", displayMessage);
        } else {
            // for IE8-
            window.attachEvent("onmessage", displayMessage);
        }
        window.listener = true;
    } else {
        if (window.listener) {
            if (window.addEventListener) {
                window.removeEventListener("message", displayMessage);
            } else {
                // for IE8-
                window.detachEvent("onmessage", displayMessage);
            }
            window.listener = undefined;
        }
    }
    return (
        <FormContainer>
            <CheckoutSteps step1 step2 />
            <h1>Shipping</h1>
            <Form>
                <Form.Check
                    inline
                    type="radio"
                    label="in Bulgaria"
                    id="BG"
                    name="BG"
                    checked={country === "Bulgaria" || country === "България"}
                    onChange={() => setCountry(context.lang === "bg" ? "България" : "Bulgaria")}
                ></Form.Check>
                <Form.Check
                    inline
                    type="radio"
                    label="outside Bulgaria"
                    id="abroad"
                    name="abroad"
                    checked={country !== "Bulgaria" && country !== "България"}
                    onChange={() => {
                        if (country === "Bulgaria" || country === "България") {
                            setCountry("");
                        }
                    }}
                ></Form.Check>
            </Form>
            {(country === "Bulgaria" || country === "България") && (
                <Form>
                    <Form.Label as="span">to </Form.Label>
                    <Form.Check
                        inline
                        type="radio"
                        label="Ekont's office"
                        id="Ekont"
                        name="Ekont"
                        checked={forwarder === "Ekont"}
                        onChange={changeForwarder}
                    ></Form.Check>
                    <Form.Check
                        inline
                        type="radio"
                        label="Speedy's office"
                        id="Speedy"
                        name="Speedy"
                        checked={forwarder === "Speedy"}
                        onChange={changeForwarder}
                    ></Form.Check>
                    <Form.Check
                        inline
                        type="radio"
                        label="my address"
                        id="other"
                        name="other"
                        checked={forwarder === "other"}
                        onChange={changeForwarder}
                    ></Form.Check>
                </Form>
            )}
            {(country === "Bulgaria" || country === "България") && (
                <React.Fragment>
                    {forwarder !== "other" && <p>Select office below:</p>}
                    {forwarder === "Ekont" && (
                        <iframe
                            title="Econt Office Locator"
                            allow="geolocation;"
                            src={`${
                                import.meta.env.VITE_EKONT_OFFICE_LOCATOR
                            }?shopUrl=https://example.staging.officelocator.econt.com&officeType=office&lang=${
                                context.lang
                            }`}
                            style={{ width: "100%", height: "70vh", borderWidth: "5px" }}
                            // onMessage={displayMessage}
                        ></iframe>
                    )}
                    {forwarder === "Speedy" && <GetSpeedyOffices setDetails={setDetails} />}
                </React.Fragment>
            )}
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

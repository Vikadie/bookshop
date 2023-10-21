import React, { useContext, useState } from "react";
import FormContainer from "../component/FormContainer";
import { useNavigate } from "react-router-dom";
import { Form, Col, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { saveShippingAddress } from "../store/actions/cartActions";
import CheckoutSteps from "../component/CheckoutSteps";
import CTX from "../utils/context";
import GetSpeedyOffices from "../component/GetSpeedyOffices";
import Translation from "../utils/Translation";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import GetEkontOffices from "../component/GetEkontOffices";

const ShippingScreen = () => {
    const { context } = useContext(CTX);
    const navigate = useNavigate();

    const dispatch = useDispatch();
    const shippingAddress = useSelector((state) => state.cart.shippingAddress);

    const [address, setAddress] = useState(shippingAddress.address || "");
    const [city, setCity] = useState(shippingAddress.city || "");
    const [postalCode, setPostalCode] = useState(shippingAddress.postalCode || "");
    const [country, setCountry] = useState(shippingAddress.country || "");
    const [phone, setPhone] = useState(shippingAddress.phone || "");
    const [phoneErr, setPhoneErr] = useState("");
    const [comments, setComments] = useState(shippingAddress.comments || "");

    const [forwarder, setForwarder] = useState(shippingAddress.forwarder || "");
    const changeForwarder = (e) => {
        setForwarder(e.target.id);
    };
    const [office, setOffice] = useState(shippingAddress.office || "");

    const setDetails = (id, name, address, city, postCode) => {
        setAddress(name + " " + Translation.t(context.lang, "found_on") + " " + address);
        setOffice(id);
        setCity(city);
        setPostalCode(postCode);
    };

    const submitHandler = (e) => {
        e.preventDefault();

        if (!phone) {
            setPhoneErr("no phone");
            return;
        }

        if (!phoneErr) {
            dispatch(
                saveShippingAddress({
                    address,
                    city,
                    postalCode,
                    country,
                    office,
                    forwarder,
                    phone,
                    comments,
                })
            );

            navigate("/payment");
            console.log("Submitted");
        }
    };

    const validatePhone = () => {
        if (phone && phone.length > 4 && !isValidPhoneNumber(phone)) {
            setPhoneErr("wrong phone!");
        } else {
            setPhoneErr("");
        }
    };

    if (forwarder !== "Ekont") {
        if (window.listener) {
            window.listener = undefined;
        }
    }
    return (
        <FormContainer>
            <CheckoutSteps step1 step2 />
            <h1>{Translation.t(context.lang, "shipping_to")}</h1>
            <Form>
                <Form.Check
                    inline
                    type="radio"
                    label={Translation.t(context.lang, "in_bg")}
                    id="BG"
                    name="BG"
                    checked={country === "Bulgaria" || country === "България"}
                    onChange={() => setCountry(context.lang === "bg" ? "България" : "Bulgaria")}
                ></Form.Check>
                <Form.Check
                    inline
                    type="radio"
                    label={Translation.t(context.lang, "abroad")}
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
                    <Form.Label as="span">{Translation.t(context.lang, "to")} </Form.Label>
                    <Form.Check
                        inline
                        type="radio"
                        label={Translation.t(context.lang, "Ekont")}
                        id="Ekont"
                        name="Ekont"
                        checked={forwarder === "Ekont"}
                        onChange={changeForwarder}
                    ></Form.Check>
                    <Form.Check
                        inline
                        type="radio"
                        label={Translation.t(context.lang, "Speedy")}
                        id="Speedy"
                        name="Speedy"
                        checked={forwarder === "Speedy"}
                        onChange={changeForwarder}
                    ></Form.Check>
                    <Form.Check
                        inline
                        type="radio"
                        label={Translation.t(context.lang, "other_address")}
                        id="other"
                        name="other"
                        checked={forwarder === "other"}
                        onChange={changeForwarder}
                    ></Form.Check>
                </Form>
            )}
            {(country === "Bulgaria" || country === "България") && (
                <React.Fragment>
                    {forwarder !== "other" && <p>{Translation.t(context.lang, "select_office")}:</p>}
                    {forwarder === "Ekont" && <GetEkontOffices setDetails={setDetails} />}
                    {forwarder === "Speedy" && <GetSpeedyOffices setDetails={setDetails} />}
                </React.Fragment>
            )}
            <Form onSubmit={submitHandler}>
                <Form.Group controlId="address" className="mb-3">
                    <Form.Label>{Translation.t(context.lang, "address")}</Form.Label>
                    <Form.Control
                        required
                        type="text"
                        placeholder={Translation.t(context.lang, "e_address")}
                        value={address ? address : ""}
                        onChange={(e) => setAddress(e.target.value)}
                        autoComplete="new-address"
                    ></Form.Control>
                </Form.Group>
                <Form.Group controlId="city" className="mb-3">
                    <Form.Label>{Translation.t(context.lang, "city")}</Form.Label>
                    <Form.Control
                        required
                        type="text"
                        placeholder={Translation.t(context.lang, "e_city")}
                        value={city ? city : ""}
                        onChange={(e) => setCity(e.target.value)}
                        autoComplete="new-city"
                    ></Form.Control>
                </Form.Group>
                <Form.Group controlId="phone" className="mb-3">
                    <Form.Label>{Translation.t(context.lang, "phone")}</Form.Label>
                    <PhoneInput
                        required
                        international
                        countryCallingCodeEditable={false}
                        defaultCountry="BG"
                        value={phone}
                        onChange={(e) => {
                            setPhone(e);
                            setPhoneErr("");
                        }}
                        onBlur={validatePhone}
                        aria-describedby="phoneHelpBlock"
                        style={{ border: `${phoneErr ? "2px dashed #ff00007d" : "none"}` }}
                    />
                    {phoneErr ? (
                        <Form.Text id="phoneHelpBlock" style={{ color: "red" }}>
                            {Translation.t(context.lang, "wrong_phone")}
                        </Form.Text>
                    ) : (
                        <Form.Text id="phoneHelpBlock" muted>
                            {Translation.t(context.lang, "e_phone")}
                        </Form.Text>
                    )}
                </Form.Group>
                <Form.Group controlId="postalCode" className="mb-3">
                    <Form.Label>{Translation.t(context.lang, "PO")}</Form.Label>
                    <Form.Control
                        required
                        type="text"
                        placeholder={Translation.t(context.lang, "e_PO")}
                        value={postalCode ? postalCode : ""}
                        onChange={(e) => setPostalCode(e.target.value)}
                        autoComplete="new-postal-code"
                    ></Form.Control>
                </Form.Group>
                <Form.Group controlId="country" className="mb-3">
                    <Form.Label>{Translation.t(context.lang, "country")}</Form.Label>
                    <Form.Control
                        required
                        type="text"
                        placeholder={Translation.t(context.lang, "e_country")}
                        value={country ? country : ""}
                        onChange={(e) => setCountry(e.target.value)}
                        autoComplete="new-country"
                    ></Form.Control>
                </Form.Group>
                <Form.Group controlId="comments" className="mb-3">
                    <Form.Label>{Translation.t(context.lang, "ship_comment")}</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={3}
                        placeholder={Translation.t(context.lang, "e_ship_comment")}
                        value={comments ? comments : ""}
                        onChange={(e) => setComments(e.target.value)}
                    ></Form.Control>
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

export default ShippingScreen;

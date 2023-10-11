import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import CTX from "../utils/context";
import { Alert, ToggleButton } from "react-bootstrap";

const getNearestOffices = async (lat, lon, lang, limit) => {
    const DATA = {
        lang: lang,
        address: {
            countryId: 100,
            x: lon,
            y: lat,
        },
        limit: limit || 3,
    };
    const { data } = await axios.post("api/orders/speedy/", DATA);

    return data;
};

const GetSpeedyOffices = ({ setDetails }) => {
    const { context } = useContext(CTX);

    const [offices, setOffices] = useState([]);
    const [limit, setLimit] = useState(3);
    const [check, setCheck] = useState(null);
    const [error, setError] = useState(0);

    useEffect(() => {
        // Get user's current location
        navigator.geolocation.getCurrentPosition(
            async function (position) {
                let lat = position.coords.latitude;
                let lon = position.coords.longitude;

                // Call the API to get the nearest offices
                let { error, offices } = await getNearestOffices(lat, lon, context.lang.toUpperCase(), limit);

                setOffices(offices);
                if (error) {
                    setError(error);
                }
            },
            function (error) {
                alert("Error occurred while getting location - please turn on you location settings" + error);
            }
        );
    }, [limit]);

    return (
        <React.Fragment>
            {error ? <Alert variant="danger">{error.message}</Alert> : null}
            <div id="speedy-list">
                {offices.length > 0 &&
                    offices.map((office, index) => (
                        <ToggleButton
                            size="lg"
                            className="mb-2"
                            type="checkbox"
                            variant="outline-dark"
                            checked={check === index}
                            value={index}
                            key={index}
                            onClick={() => {
                                setCheck(index);
                                setDetails(
                                    office.id,
                                    office.name,
                                    office.address.localAddressString,
                                    office.address.siteName,
                                    office.address.postCode
                                );
                            }}
                        >
                            {context.lang === "bg" ? office.name : office.nameEn} -
                            <span> {office.distance}m away</span>
                            <p style={{ fontSize: "0.7rem", margin: 0 }}>
                                {office.address.fullAddressString}
                            </p>
                        </ToggleButton>
                    ))}
            </div>
            <div className="d-flex justify-content-end">
                Show{" "}
                <select onChange={(e) => setLimit(e.target.value)} className="mx-1">
                    {[3, 5, 10, 20].map((v, i) => (
                        <option value={v} key={v}>
                            {v}
                        </option>
                    ))}
                </select>{" "}
                nearest offices
            </div>
        </React.Fragment>
    );
};

export default GetSpeedyOffices;

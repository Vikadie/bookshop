import React, { useContext } from "react";
import CTX from "../utils/context";

const GetEkontOffices = ({ setDetails }) => {
    const { context } = useContext(CTX);

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
        // console.log(JSON.stringify(event.data.office, null, 4));
    };

    if (window.addEventListener) {
        window.addEventListener("message", displayMessage);
    } else {
        // for IE8-
        window.attachEvent("onmessage", displayMessage);
    }
    window.listener = true;

    return (
        <iframe
            title="Econt Office Locator"
            allow="geolocation;"
            src={`${import.meta.env.VITE_EKONT_OFFICE_LOCATOR}?shopUrl=${
                import.meta.env.VITE_APP_BACKEND_URL
            }&officeType=office&lang=${context.lang}`}
            style={{ width: "100%", height: "70vh", borderWidth: "5px" }}
            // onMessage={displayMessage}
        ></iframe>
    );
};

export default GetEkontOffices;

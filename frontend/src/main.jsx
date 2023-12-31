import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import "./bootstrap.min.css";
import axios from "axios";
import { Provider } from "react-redux";
import { store } from "./store/index.js";

axios.defaults.baseURL = import.meta.env.VITE_APP_BACKEND_URL;
console.log("prod?", import.meta.env.PROD);
console.log("dev?", import.meta.env.DEV);
console.log("base_url?", import.meta.env.BASE_URL);

ReactDOM.createRoot(document.getElementById("root")).render(
    // <React.StrictMode>
    <Provider store={store}>
        <App />
    </Provider>
    // </React.StrictMode>
);

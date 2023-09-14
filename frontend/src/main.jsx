import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import "./bootstrap.min.css";
import axios from "axios";
import { Provider } from "react-redux";
import { store } from "./store/index.js";

axios.defaults.baseURL = "http://127.0.0.1:8000/";

ReactDOM.createRoot(document.getElementById("root")).render(
    // <React.StrictMode>
    <Provider store={store}>
        <App />
    </Provider>
    // </React.StrictMode>
);

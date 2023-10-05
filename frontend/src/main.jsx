import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import "./bootstrap.min.css";
import axios from "axios";
import { Provider } from "react-redux";
import { store } from "./store/index.js";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { FacebookProvider } from "react-facebook";

axios.defaults.baseURL = import.meta.env.VITE_APP_BACKEND_URL;

ReactDOM.createRoot(document.getElementById("root")).render(
    // <React.StrictMode>
    <Provider store={store}>
        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
            <FacebookProvider appId={import.meta.env.VITE_FB_APP_ID}>
                <App />
            </FacebookProvider>
        </GoogleOAuthProvider>
    </Provider>
    // </React.StrictMode>
);

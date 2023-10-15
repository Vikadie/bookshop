import React, { useContext, useEffect } from "react";
import { Routes as Switch, Route, Navigate, useSearchParams } from "react-router-dom";
import HomeScreen from "../screens/HomeScreen";
import ProductScreen from "../screens/ProductScreen";
import CartScreen from "../screens/CartScreen";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import ProfileScreen from "../screens/ProfileScreen";
import ShippingScreen from "../screens/ShippingScreen";
import PaymentScreen from "../screens/PaymentScreen";
import PlaceOrderScreen from "../screens/PlaceOrderScreen";
import OrderScreen from "../screens/OrderScreen";
import UserListScreen from "../screens/UserListScreen";
import UserEditScreen from "../screens/UserEditScreen";
import ProductListScreen from "../screens/ProductsListScreen";
import ProductEditScreen from "../screens/ProductEditScreen";
import OrderListScreen from "../screens/OrderListScreen";
import ConfirmationScreen from "../screens/ConfirmationScreen";
import CTX from "../utils/context";
import GenTerm from "../component/GenTerm";
import PrivacyPolicy from "../component/PrivacyPolicy";

const Router = () => {
    const { context, setContext } = useContext(CTX);
    const [searchParams] = useSearchParams();
    const lang = searchParams.get("lang");

    useEffect(() => {
        if (lang) {
            context.lang = lang;
            setContext({ ...context });
        }
    }, [lang]);
    return (
        <Switch>
            <Route exact path="/" element={<HomeScreen />} />
            <Route path="/home" element={<Navigate to="/" />} replace />
            <Route path="/product/:id" element={<ProductScreen />} />
            <Route path="/cart/:id?" element={<CartScreen />} />
            <Route path="/login" element={<LoginScreen />} />
            <Route path="/register" element={<RegisterScreen />} />
            <Route path="/profile" element={<ProfileScreen />} />
            <Route path="/shipping" element={<ShippingScreen />} />
            <Route path="/payment" element={<PaymentScreen />} />
            <Route path="/placeorder" element={<PlaceOrderScreen />} />
            <Route path="/general_terms" element={<GenTerm />} />
            <Route path="/privacy_policy" element={<PrivacyPolicy />} />
            <Route path="/order/:id" element={<OrderScreen />} />
            <Route path="/confirmation/:key" element={<ConfirmationScreen />} />

            <Route path="/admin/userlist" element={<UserListScreen />} />
            <Route path="/admin/user/:userId/edit" element={<UserEditScreen />} />
            <Route path="/admin/productlist" element={<ProductListScreen />} />
            <Route path="/admin/product/:productId/edit" element={<ProductEditScreen />} />
            <Route path="/admin/orderlist" element={<OrderListScreen />} />
        </Switch>
    );
};

export default Router;

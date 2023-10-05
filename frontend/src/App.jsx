import { Container } from "react-bootstrap";
import { HashRouter as Router, Routes as Switch, Route, Navigate } from "react-router-dom";
import Footer from "./component/Footer";
import Header from "./component/Header";
import HomeScreen from "./screens/HomeScreen";
import ProductScreen from "./screens/ProductScreen";
import CartScreen from "./screens/CartScreen";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import ProfileScreen from "./screens/ProfileScreen";
import ShippingScreen from "./screens/ShippingScreen";
import PaymentScreen from "./screens/PaymentScreen";
import PlaceOrderScreen from "./screens/PlaceOrderScreen";
import OrderScreen from "./screens/OrderScreen";
import UserListScreen from "./screens/UserListScreen";
import UserEditScreen from "./screens/UserEditScreen";
import ProductListScreen from "./screens/ProductsListScreen";
import ProductEditScreen from "./screens/ProductEditScreen";
import OrderListScreen from "./screens/OrderListScreen";
import ConfirmationScreen from "./screens/ConfirmationScreen";
import { useState } from "react";
import CTX from "./utils/context";

function App() {
    const [context, setContext] = useState({
        lang: "bg",
    });

    return (
        <CTX.Provider value={{ context, setContext }}>
            <Router>
                <Header />
                <main className="py-3">
                    <Container>
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
                            {/* <Route path="/generalterms" element={<PlaceOrderScreen />} /> */}
                            <Route path="/order/:id" element={<OrderScreen />} />
                            <Route path="/confirmation/:key" element={<ConfirmationScreen />} />

                            <Route path="/admin/userlist" element={<UserListScreen />} />
                            <Route path="/admin/user/:userId/edit" element={<UserEditScreen />} />
                            <Route path="/admin/productlist" element={<ProductListScreen />} />
                            <Route path="/admin/product/:productId/edit" element={<ProductEditScreen />} />
                            <Route path="/admin/orderlist" element={<OrderListScreen />} />
                        </Switch>
                    </Container>
                </main>
                <Footer />
            </Router>
        </CTX.Provider>
    );
}

export default App;

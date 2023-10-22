import { configureStore } from "@reduxjs/toolkit";
import productListReducer, {
    productCreateOrDeleteReducer,
    topProductsReducer,
} from "./reducers/productReducers";
import productDetailReducer, { productCreateReviewReducer } from "./reducers/productDetailReducer";
import cartReducer from "./reducers/cartReducer";
import userReducer, { UserUpdateProfileReducer, UserAdminReducer } from "./reducers/userReducer";
import orderReducer, {
    OrderPayReducer,
    OrderListReducer,
    OrderDeliveredReducer,
} from "./reducers/orderReducer";
import footerReducer, { termReducer } from "./reducers/footerReducer";

export const initialState = {};
// const middleware = [thunk];

export const store = configureStore({
    reducer: {
        productList: productListReducer,
        productDetail: productDetailReducer,
        productCreateOrDelete: productCreateOrDeleteReducer,
        productCreateReview: productCreateReviewReducer,
        productTopRated: topProductsReducer,

        cart: cartReducer,

        userData: userReducer,
        userUpdate: UserUpdateProfileReducer,
        usersAdmin: UserAdminReducer,

        order: orderReducer,
        orderPay: OrderPayReducer,
        orderDelivered: OrderDeliveredReducer,
        orders: OrderListReducer,

        footer: footerReducer,
        term: termReducer,
    },
    // preloadedState: initialState,
    // middleware: middleware,
});

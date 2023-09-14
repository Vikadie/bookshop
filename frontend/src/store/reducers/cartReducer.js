import { createSlice } from "@reduxjs/toolkit";

const cartItemsFromStorage = localStorage.getItem("cartItems")
    ? JSON.parse(localStorage.getItem("cartItems"))
    : [];

const shippingAddressFromStorage = localStorage.getItem("shippingAddress")
    ? JSON.parse(localStorage.getItem("shippingAddress"))
    : {};

const paymentMethodFromStorage = localStorage.getItem("paymentMethod")
    ? JSON.parse(localStorage.getItem("paymentMethod"))
    : "";

const initialCartState = {
    cartItems: cartItemsFromStorage,
    shippingAddress: shippingAddressFromStorage,
    paymentMethod: paymentMethodFromStorage,
};

const cartSlice = createSlice({
    name: "cart",
    initialState: initialCartState,
    reducers: {
        addItem(state, action) {
            const item = action.payload;
            const existingItem = state.cartItems.find((x) => x.product === item.product);
            if (existingItem) {
                state.cartItems = state.cartItems.map((x) => (x.product === existingItem.product ? item : x));
            } else {
                state.cartItems.push(item);
            }
        },
        removeItem(state, action) {
            state.cartItems = state.cartItems.filter((x) => x.product !== action.payload);
        },
        saveShippingAddress(state, action) {
            state.shippingAddress = action.payload;
        },
        savePaymentMethod(state, action) {
            state.paymentMethod = action.payload;
        },
        clearItems(state) {
            state.cartItems = [];
        },
    },
});

export const cartAction = cartSlice.actions;
export default cartSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";

const initialOrderState = { loading: false, success: false, order: {}, error: null };

const orderReducer = createSlice({
    name: "order",
    initialState: initialOrderState,
    reducers: {
        orderCreateRequest(state) {
            state.loading = true;
            state.success = false;
        },
        orderCreateSuccess(state, action) {
            state.loading = false;
            state.success = true;
            state.order = action.payload;
        },
        orderCreateFail(state) {
            state.error = action.payload;
            state.loading = false;
            state.success = false;
        },
        orderCreateReset(state) {
            state.loading = false;
            state.success = false;
            state.order = {};
            state.error = null;
        },
        orderDetailRequest(state) {
            state.loading = true;
        },
        orderDetailSuccess(state, action) {
            state.order = action.payload;
            state.loading = false;
        },
        orderDetailFail(state, action) {
            state.error = action.payload;
            state.loading = false;
        },
    },
});

export const orderActions = orderReducer.actions;
export default orderReducer.reducer;

const initialPayOrderState = { loading: false, success: false, error: null };
const orderPayReducer = createSlice({
    name: "orderPay",
    initialState: initialPayOrderState,
    reducers: {
        orderPayRequest(state) {
            state.loading = true;
            state.success = false;
        },
        orderPaySuccess(state) {
            state.loading = false;
            state.success = true;
        },
        orderPayFail(state) {
            state.error = action.payload;
            state.loading = false;
            state.success = false;
        },
        orderPayReset(state) {
            state.success = false;
            state.loading = false;
            state.error = null;
        },
    },
});

export const orderPayActions = orderPayReducer.actions;
export const OrderPayReducer = orderPayReducer.reducer;

const initialOrdersState = { loading: false, orders: [], error: null };
const ordersReducer = createSlice({
    name: "orders",
    initialState: initialOrdersState,
    reducers: {
        myOrderListRequest(state) {
            state.loading = true;
        },
        myOrderListSuccess(state, action) {
            state.loading = false;
            state.orders = action.payload;
        },
        myOrderListFail(state) {
            state.error = action.payload;
            state.loading = false;
        },
        myOrderListReset(state) {
            state.loading = false;
            state.error = null;
            state.orders = [];
        },
        OrdersListRequest(state) {
            state.loading = true;
        },
        OrdersListSuccess(state, action) {
            state.loading = false;
            state.orders = action.payload;
            state.error = null;
        },
        OrdersListFail(state) {
            state.error = action.payload;
            state.loading = false;
        },
    },
});

export const OrderListActions = ordersReducer.actions;
export const OrderListReducer = ordersReducer.reducer;

const initialOrderDeliveredState = { loading: false, success: false, error: null };
const orderDeliveredReducer = createSlice({
    name: "orderDelivered",
    initialState: initialOrderDeliveredState,
    reducers: {
        orderDeliveredRequest(state) {
            state.loading = true;
            state.success = false;
        },
        orderDeliveredSuccess(state) {
            state.loading = false;
            state.success = true;
        },
        orderDeliveredFail(state) {
            state.error = action.payload;
            state.loading = false;
            state.success = false;
        },
        orderDeliveredReset(state) {
            state.success = false;
            state.loading = false;
            state.error = null;
        },
    },
});

export const orderDeliveredActions = orderDeliveredReducer.actions;
export const OrderDeliveredReducer = orderDeliveredReducer.reducer;

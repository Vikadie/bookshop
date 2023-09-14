import axios from "axios";
import {
    orderActions as actions,
    orderPayActions,
    OrderListActions,
    orderDeliveredActions,
} from "../reducers/orderReducer";
import { cartAction } from "../reducers/cartReducer";

export const createOrder = (order) => async (dispatch, getState) => {
    try {
        dispatch(actions.orderCreateRequest());

        // pull out the current user
        const {
            userData: { userInfo },
        } = getState();

        const config = {
            headers: {
                "Content-type": "application/json",
                Authorization: `Bearer ${userInfo.token}`,
            },
        };

        const { data } = await axios.post(`/api/orders/add/`, order, config);

        dispatch(actions.orderCreateSuccess(data));
    } catch (error) {
        dispatch(
            actions.orderCreateFail(
                error.response && error.response.data.detail ? error.response.data.detail : error.message
            )
        );
    }
};

export const resetOrder = () => (dispatch) => {
    dispatch(actions.orderCreateReset());

    dispatch(cartAction.clearItems());

    localStorage.removeItem("cartItems");
};

export const getOrderDetails = (id) => async (dispatch, getState) => {
    try {
        dispatch(actions.orderDetailRequest());

        // pull out the current user
        const {
            userData: { userInfo },
        } = getState();

        const config = {
            headers: {
                "Content-type": "application/json",
                Authorization: `Bearer ${userInfo.token}`,
            },
        };

        const { data } = await axios.get(`/api/orders/${id}/`, config);

        dispatch(actions.orderDetailSuccess(data));
    } catch (error) {
        dispatch(
            actions.orderDetailFail(
                error.response && error.response.data.detail ? error.response.data.detail : error.message
            )
        );
    }
};

export const payOrder = (id, paymentResult) => async (dispatch, getState) => {
    try {
        dispatch(orderPayActions.orderPayRequest());

        // pull out the current user
        const {
            userData: { userInfo },
        } = getState();

        const config = {
            headers: {
                "Content-type": "application/json",
                Authorization: `Bearer ${userInfo.token}`,
            },
        };

        const { data } = await axios.put(`/api/orders/${id}/pay/`, paymentResult, config);

        dispatch(orderPayActions.orderPaySuccess(data));
    } catch (error) {
        dispatch(
            orderPayActions.orderPayFail(
                error.response && error.response.data.detail ? error.response.data.detail : error.message
            )
        );
    }
};

export const getMyOrders = () => async (dispatch, getState) => {
    try {
        dispatch(OrderListActions.myOrderListRequest());

        // pull out the current user
        const {
            userData: { userInfo },
        } = getState();

        const config = {
            headers: {
                "Content-type": "application/json",
                Authorization: `Bearer ${userInfo.token}`,
            },
        };

        const { data } = await axios.get(`/api/orders/myorders/`, config);

        dispatch(OrderListActions.myOrderListSuccess(data));
    } catch (error) {
        dispatch(
            OrderListActions.myOrderListFail(
                error.response && error.response.data.detail ? error.response.data.detail : error.message
            )
        );
    }
};

export const getOrders = () => async (dispatch, getState) => {
    try {
        dispatch(OrderListActions.OrdersListRequest());

        // pull out the current user
        const {
            userData: { userInfo },
        } = getState();

        const config = {
            headers: {
                "Content-type": "application/json",
                Authorization: `Bearer ${userInfo.token}`,
            },
        };

        const { data } = await axios.get(`/api/orders/`, config);

        dispatch(OrderListActions.OrdersListSuccess(data));
    } catch (error) {
        dispatch(
            OrderListActions.OrdersListFail(
                error.response && error.response.data.detail ? error.response.data.detail : error.message
            )
        );
    }
};

export const deliverOrder = (order) => async (dispatch, getState) => {
    try {
        dispatch(orderDeliveredActions.orderDeliveredRequest());

        // pull out the current user
        const {
            userData: { userInfo },
        } = getState();

        const config = {
            headers: {
                "Content-type": "application/json",
                Authorization: `Bearer ${userInfo.token}`,
            },
        };

        const { data } = await axios.put(`/api/orders/${order._id}/delivered/`, {}, config);

        dispatch(orderDeliveredActions.orderDeliveredSuccess(data));
    } catch (error) {
        dispatch(
            orderDeliveredActions.orderDeliveredFail(
                error.response && error.response.data.detail ? error.response.data.detail : error.message
            )
        );
    }
};

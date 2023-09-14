import axios from "axios";
import {
    productListActions as actions,
    productCreateOrDeleteActions,
    topProductsActions,
} from "../reducers/productReducers";
import { productDetailActions } from "../reducers/productDetailReducer";

// action creator
export const fetchListProducts =
    (keyword = "") =>
    async (dispatch) => {
        try {
            dispatch(actions.productListRequest());

            const { data } = await axios.get(`/api/products${keyword}`);

            dispatch(actions.productListSuccess(data));
        } catch (error) {
            dispatch(
                actions.productListFail(
                    error.response && error.response.data.detail ? error.response.data.detail : error.message
                )
            );
        }
    };

//delete a product
export const deleteProduct = (id) => async (dispatch, getState) => {
    try {
        dispatch(productCreateOrDeleteActions.productDeleteRequest());

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

        await axios.delete(`/api/products/delete/${id}/`, config);

        dispatch(productCreateOrDeleteActions.productDeleteSuccess());
    } catch (error) {
        dispatch(
            productCreateOrDeleteActions.productDeleteFail(
                error.response && error.response.data.detail ? error.response.data.detail : error.message
            )
        );
    }
};

//create product
export const createProduct = () => async (dispatch, getState) => {
    try {
        dispatch(productCreateOrDeleteActions.productCreateRequest());

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

        const { data } = await axios.post(`/api/products/create/`, {}, config);

        dispatch(productCreateOrDeleteActions.productCreateSuccess(data));
    } catch (error) {
        dispatch(
            productCreateOrDeleteActions.productCreateFail(
                error.response && error.response.data.detail ? error.response.data.detail : error.message
            )
        );
    }
};

//update product
export const updateProduct = (product) => async (dispatch, getState) => {
    try {
        dispatch(productCreateOrDeleteActions.productCreateRequest());

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

        const { data } = await axios.put(`/api/products/update/${product._id}/`, product, config);

        dispatch(productCreateOrDeleteActions.productCreateSuccess(data));

        dispatch(productDetailActions.productDetailSuccess(data)); // to  update the product details immediately
    } catch (error) {
        dispatch(
            productCreateOrDeleteActions.productCreateFail(
                error.response && error.response.data.detail ? error.response.data.detail : error.message
            )
        );
    }
};

// action creator
export const topProductsList = () => async (dispatch) => {
    try {
        dispatch(topProductsActions.topProductsRequest());

        const { data } = await axios.get(`/api/products/top/`);

        dispatch(topProductsActions.topProductsSuccess(data));
    } catch (error) {
        dispatch(
            topProductsActions.topProductsFail(
                error.response && error.response.data.detail ? error.response.data.detail : error.message
            )
        );
    }
};

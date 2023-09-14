import axios from "axios";
import {
    productDetailActions as actions,
    productCreateReviewActions,
} from "../reducers/productDetailReducer";

// action creator
export const fetchProductDetails = (id) => async (dispatch) => {
    try {
        dispatch(actions.productDetailRequest());

        const { data } = await axios.get(`/api/products/${id}`);

        dispatch(actions.productDetailSuccess(data));
    } catch (error) {
        dispatch(
            actions.productDetailFail(
                error.response && error.response.data.detail ? error.response.data.detail : error.message
            )
        );
    }
};

export const createProductReview = (productId, review) => async (dispatch, getState) => {
    try {
        dispatch(productCreateReviewActions.productCreateReviewRequest());

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

        const { data } = await axios.post(`/api/products/${productId}/reviews/`, review, config);

        dispatch(productCreateReviewActions.productCreateReviewSuccess(data));
    } catch (error) {
        dispatch(
            productCreateReviewActions.productCreateReviewFail(
                error.response && error.response.data.detail ? error.response.data.detail : error.message
            )
        );
    }
};

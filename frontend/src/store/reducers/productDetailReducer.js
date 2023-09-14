import { createSlice } from "@reduxjs/toolkit";

const initialProductDetailState = {
    product: { reviews: [] },
    loading: false,
    error: null,
};
const productDetailSlice = createSlice({
    name: "productDetails",
    initialState: initialProductDetailState,
    reducers: {
        productDetailRequest(state) {
            state.loading = true;
        },
        productDetailSuccess(state, action) {
            state.product = action.payload;
            state.loading = false;
        },
        productDetailFail(state, action) {
            state.error = action.payload;
            state.loading = false;
        },
        productCreateReviewRequest(state) {
            state.loading = true;
            state.successReviewCreate = false;
        },
        productCreateReviewSuccess(state) {
            state.successReviewCreate = true;
            state.loading = false;
        },
        productCreateReviewFail(state, action) {
            state.error = action.payload;
            state.loading = false;
            state.successReviewCreate = false;
        },
        productCreateReviewReset(state) {
            state.successReviewCreate = false;
            state.loading = false;
            state.error = null;
        },
    },
});

export const productDetailActions = productDetailSlice.actions;
export default productDetailSlice.reducer;

const initialCreateReviewState = {
    loadingProductReview: false,
    errorProductReview: null,
    successProductReview: false,
};
const productCreateReviewSlice = createSlice({
    name: "productCreateReview",
    initialState: initialCreateReviewState,
    reducers: {
        productCreateReviewRequest(state) {
            state.loadingProductReview = true;
            state.successProductReview = false;
            state.errorProductReview = null;
        },
        productCreateReviewSuccess(state) {
            state.successProductReview = true;
            state.loadingProductReview = false;
        },
        productCreateReviewFail(state, action) {
            state.errorProductReview = action.payload;
            state.loadingProductReview = false;
            state.successProductReview = false;
        },
        productCreateReviewReset(state) {
            state.successProductReview = false;
            state.loadingProductReview = false;
            state.errorProductReview = null;
        },
    },
});

export const productCreateReviewActions = productCreateReviewSlice.actions;
export const productCreateReviewReducer = productCreateReviewSlice.reducer;

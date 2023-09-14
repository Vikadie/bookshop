import { createSlice } from "@reduxjs/toolkit";

const initialProductState = { products: [], loading: false, error: null, page: 1, pages: 1 };

const productListSlice = createSlice({
    name: "productList",
    initialState: initialProductState,
    reducers: {
        productListRequest(state) {
            state.loading = true;
        },
        productListSuccess(state, action) {
            state.products = action.payload.products;
            state.page = action.payload.page;
            state.pages = action.payload.pages;
            state.loading = false;
        },
        productListFail(state, action) {
            state.error = action.payload;
            state.loading = false;
        },
    },
});

export const productListActions = productListSlice.actions;
export default productListSlice.reducer;

const initialProductDeleteState = {
    success: false,
    successCreate: false,
    product: {},
    loading: false,
    error: null,
};
const productCreateOrDeleteSlice = createSlice({
    name: "productCreate&Delete",
    initialState: initialProductDeleteState,
    reducers: {
        productCreateRequest(state) {
            // also used for updating product
            state.loading = true;
            state.successCreate = false;
        },
        productCreateSuccess(state, action) {
            // also used for updating product
            state.successCreate = true;
            state.loading = false;
            state.error = null;
            state.product = action.payload;
        },
        productCreateFail(state, action) {
            // also used for updating product
            state.error = action.payload;
            state.loading = false;
            state.successCreate = false;
        },
        productCreateReset(state) {
            // also used for updating product
            state.error = null;
            state.loading = false;
            state.successCreate = false;
            state.product = {};
        },
        productDeleteRequest(state) {
            state.loading = true;
            state.success = false;
        },
        productDeleteSuccess(state) {
            state.success = true;
            state.loading = false;
            state.error = null;
        },
        productDeleteFail(state, action) {
            state.error = action.payload;
            state.loading = false;
            state.success = false;
        },
    },
});

export const productCreateOrDeleteActions = productCreateOrDeleteSlice.actions;
export const productCreateOrDeleteReducer = productCreateOrDeleteSlice.reducer;

const initialTopProductsState = { topProducts: [], loading: false, error: null, success: false };

const topProductsSlice = createSlice({
    name: "topProducts",
    initialState: initialTopProductsState,
    reducers: {
        topProductsRequest(state) {
            state.loading = true;
            state.topProducts = [];
        },
        topProductsSuccess(state, action) {
            state.topProducts = action.payload;
            state.success = true;
            state.loading = false;
        },
        topProductsFail(state, action) {
            state.error = action.payload;
            state.topProducts = [];
            state.success = false;
            state.loading = false;
        },
    },
});

export const topProductsActions = topProductsSlice.actions;
export const topProductsReducer = topProductsSlice.reducer;

// // always a PURE function (no fetching inside)
// // never mutate the state, always overwrite it
// export const productListReducers = (state = initialProductState, action) => {
//     switch (action.type) {
//         case actions.PRODUCT_LIST_REQUEST:
//             return { loading: true, products: [] };

//         case actions.PRODUCT_LIST_SUCCESS:
//             return { loading: false, products: action.payload };

//         case actions.PRODUCT_LIST_FAIL:
//             return { loading: false, error: action.payload };

//         default:
//             return state;
//     }
// };

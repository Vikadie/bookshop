import { createSlice } from "@reduxjs/toolkit";

const initialFooterState = { loading: false, footer: [], error: null, existing: false };

const footerReducer = createSlice({
    name: "footer",
    initialState: initialFooterState,
    reducers: {
        footerGetRequest(state) {
            state.loading = true;
            state.existing = false;
        },
        footerGetSuccess(state, action) {
            state.loading = false;
            state.footer = action.payload;
            state.existing = false;
        },
        footerCheckKey(state, action) {
            state.existing = action.payload;
        },
        footerGetFail(state) {
            state.error = action.payload;
            state.loading = false;
            state.existing = false;
        },
    },
});

export const footerActions = footerReducer.actions;
export default footerReducer.reducer;

const initTermsState = { loading: false, term: {}, success: false, error: null };

const termsReducer = createSlice({
    name: "termsFooter",
    initialState: initTermsState,
    reducers: {
        termsCreateRequest(state) {
            state.loading = true;
            state.success = false;
        },
        termsCreateSuccess(state, action) {
            state.loading = false;
            state.term = action.payload;
            state.success = true;
        },
        termsCreateFail(state) {
            state.error = action.payload;
            state.loading = false;
            state.success = false;
        },

        termsModifyRequest(state) {
            state.loading = true;
            state.success = false;
        },
        termsModifySuccess(state, action) {
            state.loading = false;
            state.term = action.payload;
            state.success = true;
        },
        termsModifyFail(state) {
            state.error = action.payload;
            state.loading = false;
            state.success = false;
        },

        termsDeleteRequest(state) {
            state.loading = true;
            state.success = false;
        },
        termsDeleteSuccess(state, action) {
            state.loading = false;
            state.term = action.payload;
            state.success = true;
        },
        termsDeleteFail(state) {
            state.error = action.payload;
            state.loading = false;
            state.success = false;
        },
    },
});

export const termActions = termsReducer.actions;
export const termReducer = termsReducer.reducer;

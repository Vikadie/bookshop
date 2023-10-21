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

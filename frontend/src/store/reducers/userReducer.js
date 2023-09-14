import { createSlice } from "@reduxjs/toolkit";

const userInfoFromStorage = localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo"))
    : null;

const initialUserState = {
    loading: false,
    userInfo: userInfoFromStorage,
    user: {},
    error: null,
};

const UserReducer = createSlice({
    name: "user",
    initialState: initialUserState,
    reducers: {
        userLoginRequest(state) {
            state.loading = true;
        },
        userLoginSuccess(state, action) {
            state.loading = false;
            state.userInfo = action.payload;
            state.error = null;
        },
        userLoginFail(state, action) {
            state.loading = false;
            state.error = action.payload;
        },
        userLogout(state) {
            state.loading = false;
            state.userInfo = null;
            state.user = {};
        },
        userRegisterRequest(state) {
            state.loading = true;
        },
        userRegisterSuccess(state, action) {
            state.loading = false;
            state.userInfo = action.payload;
            state.error = null;
        },
        userRegisterFail(state, action) {
            state.loading = false;
            state.error = action.payload;
        },
        userClearError(state) {
            state.error = null;
        },
        userDetailsRequest(state) {
            state.loading = true;
        },
        userDetailsSuccess(state, action) {
            state.loading = false;
            state.user = action.payload;
            state.error = null;
        },
        userDetailsFail(state, action) {
            state.loading = false;
            state.error = action.payload;
        },
    },
});

export const userActions = UserReducer.actions;
export default UserReducer.reducer;

const UserUpdateReducer = createSlice({
    name: "userUpdate",
    initialState: { loading: false, userInfo: null, success: false, error: null },
    reducers: {
        updateProfileRequest(state) {
            state.loading = true;
            state.success = false;
        },
        updateProfileSuccess(state, action) {
            state.loading = false;
            state.userInfo = action.payload;
            state.success = true;
            state.error = null;
        },
        updateProfileFail(state, action) {
            state.loading = false;
            state.error = action.payload;
            state.success = false;
        },
        updateProfileReset(state) {
            state.loading = false;
            state.error = null;
            state.userInfo = {};
            state.success = false;
        },
    },
});

export const updateUserActions = UserUpdateReducer.actions;
export const UserUpdateProfileReducer = UserUpdateReducer.reducer;

const initialUserAdminState = { loading: false, error: null, users: [], success: false };
const userAdminReducer = createSlice({
    name: "adminUsers",
    initialState: initialUserAdminState,
    reducers: {
        userListRequest(state) {
            state.loading = true;
        },
        userListSuccess(state, action) {
            state.loading = false;
            state.users = action.payload;
        },
        userListFail(state, action) {
            state.loading = false;
            state.error = action.payload;
        },
        userListReset(state) {
            state.loading = false;
            state.users = [];
            state.error = null;
        },
        userDeleteRequest(state) {
            state.loading = true;
            state.success = false;
        },
        userDeleteSuccess(state) {
            state.loading = false;
            state.success = true;
        },
        userDeleteFail(state, action) {
            state.loading = false;
            state.error = action.payload;
            state.success = false;
        },
        userAdminUpdateRequest(state) {
            state.loading = true;
            state.success = false;
        },
        userAdminUpdateSuccess(state) {
            state.loading = false;
            state.success = true;
        },
        userAdminUpdateFail(state, action) {
            state.loading = false;
            state.error = action.payload;
            state.success = false;
        },
        userAdminUpdateReset(state) {
            state.success = false;
        },
    },
});

export const userAdminActions = userAdminReducer.actions;
export const UserAdminReducer = userAdminReducer.reducer;

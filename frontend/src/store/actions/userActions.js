import axios from "axios";
import { userActions as actions, updateUserActions, userAdminActions } from "../reducers/userReducer";
import { OrderListActions } from "../reducers/orderReducer";

export const login = (email, password) => async (dispatch) => {
    try {
        dispatch(actions.userLoginRequest());

        const config = {
            headers: { "Content-type": "application/json" },
        };

        const { data } = await axios.post(
            "/api/users/login/",
            { username: email, password: password },
            config
        );

        dispatch(actions.userLoginSuccess(data));

        localStorage.setItem("userInfo", JSON.stringify(data));
    } catch (error) {
        dispatch(
            actions.userLoginFail(
                error.response && error.response.data.detail ? error.response.data.detail : error.message
            )
        );
    }
};

export const logout = () => (dispatch) => {
    dispatch(actions.userLogout());

    localStorage.removeItem("userInfo");

    dispatch(OrderListActions.myOrderListReset());
    dispatch(userAdminActions.userListReset());
};

export const register = (name, email, password) => async (dispatch) => {
    try {
        dispatch(actions.userRegisterRequest());

        const config = {
            headers: { "Content-type": "application/json" },
        };

        const { data } = await axios.post(
            "/api/users/register/",
            { name: name, email: email, password: password },
            config
        );

        dispatch(actions.userRegisterSuccess(data));

        dispatch(login(email, password));

        localStorage.setItem("userInfo", JSON.stringify(data));
    } catch (error) {
        dispatch(
            actions.userRegisterFail(
                error.response && error.response.data.detail ? error.response.data.detail : error.message
            )
        );
    }
};

export const clearError = () => {
    actions.userClearError();
};

export const getUserDetails = (id) => async (dispatch, getState) => {
    try {
        dispatch(actions.userDetailsRequest());

        // pull out the current user
        const { userData } = getState();

        const config = {
            headers: {
                "Content-type": "application/json",
                Authorization: `Bearer ${userData.userInfo.token}`,
            },
        };

        const { data } = await axios.get(`/api/users/${id}/`, config);

        dispatch(actions.userDetailsSuccess(data));
    } catch (error) {
        dispatch(
            actions.userDetailsFail(
                error.response && error.response.data.detail ? error.response.data.detail : error.message
            )
        );
    }
};

export const updateUserProfile = (user) => async (dispatch, getState) => {
    try {
        dispatch(updateUserActions.updateProfileRequest());

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

        const { data } = await axios.put(`/api/users/profile/update/`, user, config);

        dispatch(updateUserActions.updateProfileSuccess(data));

        dispatch(actions.userLoginSuccess(data));

        localStorage.setItem("userInfo", JSON.stringify(data));
    } catch (error) {
        dispatch(
            updateUserActions.updateProfileFail(
                error.response && error.response.data.detail ? error.response.data.detail : error.message
            )
        );
    }
};

export const listUsers = () => async (dispatch, getState) => {
    try {
        dispatch(userAdminActions.userListRequest());

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

        const { data } = await axios.get(`/api/users/`, config);

        dispatch(userAdminActions.userListSuccess(data));
    } catch (error) {
        dispatch(
            userAdminActions.userListFail(
                error.response && error.response.data.detail ? error.response.data.detail : error.message
            )
        );
    }
};

export const deleteUser = (id) => async (dispatch, getState) => {
    try {
        dispatch(userAdminActions.userDeleteRequest());

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

        const { data } = await axios.delete(`/api/users/delete/${id}/`, config);

        dispatch(userAdminActions.userDeleteSuccess(data));
    } catch (error) {
        dispatch(
            userAdminActions.userDeleteFail(
                error.response && error.response.data.detail ? error.response.data.detail : error.message
            )
        );
    }
};

export const adminUpdateUser = (user) => async (dispatch, getState) => {
    try {
        dispatch(userAdminActions.userAdminUpdateRequest());

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

        const { data } = await axios.put(`/api/users/update/${user._id}/`, user, config);

        dispatch(userAdminActions.userAdminUpdateSuccess());

        dispatch(actions.userDetailsSuccess(data));
    } catch (error) {
        dispatch(
            userAdminActions.userAdminUpdateFail(
                error.response && error.response.data.detail ? error.response.data.detail : error.message
            )
        );
    }
};

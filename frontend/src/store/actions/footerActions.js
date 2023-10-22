import axios from "axios";
import { footerActions as actions, termActions } from "../reducers/footerReducer";

export const getFooterTerms = () => async (dispatch) => {
    try {
        dispatch(actions.footerGetRequest());

        const { data } = await axios.get(`/api/footer/`);

        dispatch(actions.footerGetSuccess(data));
    } catch (error) {
        dispatch(
            actions.footerGetFail(
                error.response && error.response.data.detail ? error.response.data.detail : error.message
            )
        );
    }
};

export const checkKey = (key) => async (dispatch, getState) => {
    try {
        dispatch(actions.footerGetRequest());

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

        const { data } = await axios.get(`api/footer/check/${key}/`, config);

        dispatch(actions.footerCheckKey(data));
    } catch (error) {
        dispatch(
            actions.footerGetFail(
                error.response && error.response.data.detail ? error.response.data.detail : error.message
            )
        );
    }
};

export const modifyKey = (term) => async (dispatch, getState) => {
    try {
        dispatch(termActions.termsModifyRequest());

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

        const { data } = await axios.put(`api/footer/update/`, term, config);
        dispatch(termActions.termsModifySuccess(data));
    } catch (error) {
        dispatch(
            termActions.termsModifyFail(
                error.response && error.response.data.detail ? error.response.data.detail : error.message
            )
        );
    }
};

export const createKey = (term) => async (dispatch, getState) => {
    try {
        dispatch(termActions.termsCreateRequest());

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

        const { data } = await axios.post(`api/footer/create/`, term, config);
        dispatch(termActions.termsCreateSuccess(data));
    } catch (error) {
        dispatch(
            termActions.termsCreateFail(
                error.response && error.response.data.detail ? error.response.data.detail : error.message
            )
        );
    }
};

export const deleteKey = (id) => async (dispatch, getState) => {
    try {
        dispatch(termActions.termsDeleteRequest());

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

        const { data } = await axios.delete(`api/footer/delete/${id}/`, config);
        dispatch(termActions.termsDeleteSuccess(data));
    } catch (error) {
        dispatch(
            termActions.termsDeleteFail(
                error.response && error.response.data.detail ? error.response.data.detail : error.message
            )
        );
    }
};

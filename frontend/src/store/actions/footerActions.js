import axios from "axios";
import { footerActions as actions } from "../reducers/footerReducer";

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
        console.log("data from action", data);
        dispatch(actions.footerCheckKey(data));
    } catch (error) {
        dispatch(
            actions.footerGetFail(
                error.response && error.response.data.detail ? error.response.data.detail : error.message
            )
        );
    }
};

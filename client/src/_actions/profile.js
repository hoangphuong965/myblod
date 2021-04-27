import {
    CLEAR_PROFILE,
    GET_PROFILE,
    PROFILE_ERROR,
    UPDATE_PROFILE,
    LOGOUT,
    GET_PROFILES,
} from "../_actions/types";
import {} from "../";
import { setAlert } from "./alert";
import api from "../utils/api";

// get current users profile
export const getCurrentProfile = () => async (dispatch) => {
    try {
        const res = await api.get("/profile/me");
        dispatch({
            type: GET_PROFILE,
            payload: res.data,
        });
    } catch (error) {
        dispatch({
            type: PROFILE_ERROR,
            payload: error,
        });
    }
};

// get all profiles
export const getProfiles = () => async (dispatch) => {
    try {
        const res = await api.get("/profile");
        dispatch({
            type: GET_PROFILES,
            payload: res.data,
        });
    } catch (error) {
        dispatch({
            type: PROFILE_ERROR,
            payload: error,
        });
    }
};

// get profile by id
export const getProfileById = (userId) => async (dispatch) => {
    try {
        const res = await api.get(`/profile/user/${userId}`);
        dispatch({
            type: GET_PROFILE,
            payload: res.data,
        });
    } catch (error) {
        dispatch({
            type: PROFILE_ERROR,
            payload: error,
        });
    }
};

// create profile
export const createProfile = (formData, history, edit = false) => async (
    dispatch
) => {
    try {
        const res = await api.post("/profile", formData);
        dispatch({
            type: GET_PROFILE,
            payload: res.data,
        });
        dispatch(
            setAlert(edit ? "Profile Updated" : "Profile Created", "success")
        );

        if (!edit || edit) {
            history.push("/dashboard");
        }
    } catch (error) {
        dispatch({
            type: PROFILE_ERROR,
            payload: error,
        });
    }
};

// add experience
export const addExperience = (formData, history) => async (dispatch) => {
    try {
        const res = await api.put("/profile/experience", formData);
        dispatch({
            type: UPDATE_PROFILE,
            payload: res.data,
        });
        dispatch(setAlert("Experience Updated", "success"));
        history.push("/dashboard");
    } catch (error) {
        dispatch({
            type: PROFILE_ERROR,
            payload: error,
        });
    }
};

// add education
export const addEducation = (formData, history) => async (dispatch) => {
    try {
        const res = await api.put("/profile/education", formData);
        dispatch({
            type: UPDATE_PROFILE,
            payload: res.data,
        });
        dispatch(setAlert("Experience Updated", "success"));
        history.push("/dashboard");
    } catch (error) {
        dispatch({
            type: PROFILE_ERROR,
            payload: error,
        });
    }
};

// delete experience
export const deleteExperience = (exp_id) => async (dispatch) => {
    try {
        const res = await api.delete(`/profile/experience/${exp_id}`);
        dispatch({
            type: UPDATE_PROFILE,
            payload: res.data,
        });
        dispatch(setAlert("Experience Deleted", "success"));
    } catch (error) {
        dispatch({
            type: PROFILE_ERROR,
            payload: error,
        });
    }
};

// delete experience
export const deleteEducation = (edu_id) => async (dispatch) => {
    try {
        const res = await api.delete(`/profile/education/${edu_id}`);
        dispatch({
            type: UPDATE_PROFILE,
            payload: res.data,
        });
        dispatch(setAlert("Education Deleted", "success"));
    } catch (error) {
        dispatch({
            type: PROFILE_ERROR,
            payload: error,
        });
    }
};

// delete account
export const deleteAccount = () => async (dispatch) => {
    try {
        await api.delete("/profile");
        dispatch({ type: CLEAR_PROFILE });
        dispatch({ type: LOGOUT });
        window.location.replace("/");
    } catch (error) {
        dispatch({
            type: PROFILE_ERROR,
            payload: error,
        });
    }
};

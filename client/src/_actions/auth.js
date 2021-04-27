import api from "../utils/api";
import setAuthToken from "../utils/setAuthToken";
import { setAlert } from "./alert";
import {
    REGISTER_FAIL,
    REGISTER_SUCCESS,
    USER_LOADED,
    AUTH_ERROR,
    LOGOUT,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
} from "./types";

// load user
export const loadUser = () => async (dispatch) => {
    if (localStorage.token) {
        setAuthToken(localStorage.token);
    }
    try {
        const user = await api.get("/auth");
        dispatch({
            type: USER_LOADED,
            payload: user.data,
        });
    } catch (error) {
        dispatch({
            type: AUTH_ERROR,
        });
    }
};

// register user
export const register = (formData) => async (dispatch) => {
    try {
        const res = await api.post("/users", formData);
        dispatch({
            type: REGISTER_SUCCESS,
            payload: res.data,
        });
    } catch (error) {
        const errors = error.response.data.errors;
        if (errors) {
            errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
        }
        dispatch({
            type: REGISTER_FAIL,
        });
    }
};

// Login User
export const login = (formData) => async (dispatch) => {
    try {
        const res = await api.post("/auth", formData);
        dispatch({
            type: LOGIN_SUCCESS,
            payload: res.data,
        });
    } catch (err) {
        const errors = err.response.data.errors;

        if (errors) {
            errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
        }

        dispatch({
            type: LOGIN_FAIL,
        });
    }
};

// Logout
export const logout = () => (dispatch) => {
    const reload = window.location.replace("/");
    dispatch({
        type: LOGOUT,
        payload: reload,
    });
};

import { combineReducers } from "redux";
import alert from "../_reducers/alert";
import auth from "../_reducers/auth";
import profile from "../_reducers/profile";

export default combineReducers({
    alert,
    auth,
    profile,
});

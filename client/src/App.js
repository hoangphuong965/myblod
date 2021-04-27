import React, { useEffect } from "react";
import Navbar from "./components/layout/Navbar";
import Landing from "./components/layout/Landing";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Dashboard from "./components/dashboard/Dashboard";
import CreateProfile from "./components/profile-form/CreateProfile";
import AddExperience from "./components/profile-form/AddExperience";
import AddEducation from "./components/profile-form/AddEducation";
import Profiles from "./components/profiles/Profiles";
import Profile from "./components/profile/Profile";
import PrivateRoute from "./components/routing/PrivateRoute";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
// redux
import { Provider } from "react-redux";
import store from "./store";
import { loadUser } from "./_actions/auth";
import setAuthToken from "./utils/setAuthToken";

const App = () => {
    useEffect(() => {
        // check for token in LS
        if (localStorage.token) {
            setAuthToken(localStorage.token);
            store.dispatch(loadUser());
        }
    }, []);

    return (
        <Provider store={store}>
            <Router>
                <Navbar />
                <Route exact path='/' component={Landing} />
                <section>
                    <Switch>
                        <Route exact path='/register' component={Register} />
                        <Route exact path='/login' component={Login} />
                        <Route exact path='/profiles' component={Profiles} />
                        <Route exact path='/profile/:id' component={Profile} />
                        <PrivateRoute
                            exact
                            path='/dashboard'
                            component={Dashboard}
                        />
                        <PrivateRoute
                            exact
                            path='/create-profile'
                            component={CreateProfile}
                        />
                        <PrivateRoute
                            exact
                            path='/edit-profile'
                            component={CreateProfile}
                        />
                        <PrivateRoute
                            exact
                            path='/add-experience'
                            component={AddExperience}
                        />
                        <PrivateRoute
                            exact
                            path='/add-education'
                            component={AddEducation}
                        />
                    </Switch>
                </section>
            </Router>
        </Provider>
    );
};

export default App;

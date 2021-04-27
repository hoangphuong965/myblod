import React, { useEffect } from "react";
import { connect } from "react-redux";
import { loadUser } from "../../_actions/auth";
import { deleteAccount, getCurrentProfile } from "../../_actions/profile";
import { Link } from "react-router-dom";
import Spinner from "../layout/Spinner";
import Alert from "../layout/Alert";
import DashboardActions from "./DashboardActions";
import Experience from "./Experience";
import Education from "./Education";

const Dashboard = (props) => {
    const {
        loadUser,
        getCurrentProfile,
        profile: { loading, profile },
        auth: { user },
        deleteAccount,
    } = props;

    useEffect(() => {
        loadUser();
        getCurrentProfile();
    }, [getCurrentProfile, loadUser]);

    return loading && profile === null ? (
        <Spinner />
    ) : (
        <div className='container'>
            <Alert />
            <h1 className='large text-primary'>Dashboard</h1>
            <p className='lead'>
                <i className='fas fa-user'> Welcome {user && user.name}</i>
            </p>
            {profile !== null ? (
                <>
                    <DashboardActions />
                    <Experience experience={profile.experience} />
                    <Education education={profile.education} />
                    <div className='my-2'>
                        <button
                            className='btn btn-danger'
                            onClick={() => {
                                const confirm = window.confirm(
                                    "Are you sure delete your account ?"
                                );
                                if (confirm === true) {
                                    deleteAccount();
                                }
                            }}>
                            <i className='fas fa-user-minus' />
                            Delete My Account
                        </button>
                    </div>
                </>
            ) : (
                <>
                    <p>
                        You have not yet setup a profile, please add some info
                    </p>
                    <Link to='/create-profile' className='btn btn-primary my-1'>
                        Create Profile
                    </Link>
                </>
            )}
        </div>
    );
};

const mapStateToProps = (state) => {
    return {
        profile: state.profile,
        auth: state.auth,
    };
};

export default connect(mapStateToProps, {
    loadUser,
    getCurrentProfile,
    deleteAccount,
})(Dashboard);

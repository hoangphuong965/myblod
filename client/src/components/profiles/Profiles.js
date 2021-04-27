import React, { useEffect } from "react";
import { connect } from "react-redux";
import { getProfiles } from "../../_actions/profile";
import ProfileItem from "./ProfileItem";

const Profiles = (props) => {
    const {
        getProfiles,
        profile: { profiles },
    } = props;

    useEffect(() => {
        getProfiles();
    }, [getProfiles]);

    return (
        <div className='container'>
            <h1 className='large text-primary'>Developers</h1>
            <p className='lead'>
                <i className='fab fa-connectdevelop'></i> Browse and connect
                with developers
            </p>
            <div className='profiles'>
                {profiles.map((profile) => {
                    return <ProfileItem key={profile._id} profile={profile} />;
                })}
            </div>
        </div>
    );
};

const mapStateToProps = (state) => {
    return {
        profile: state.profile,
    };
};

export default connect(mapStateToProps, { getProfiles })(Profiles);

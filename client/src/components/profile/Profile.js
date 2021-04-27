import React, { useEffect } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { getProfileById } from "../../_actions/profile";
import Spinner from "../layout/Spinner";
import ProfileAbout from "./ProfileAbout";
import ProfileEducation from "./ProfileEducation";
import ProfileExperience from "./ProfileExperience";
import ProfileTop from "./ProfileTop";

const Profile = (props) => {
    const {
        profile: { profile },
        getProfileById,
        auth: { isAuthenticated, loading, user },
    } = props;

    const userId = props.match.params.id;
    useEffect(() => {
        getProfileById(userId);
    }, [getProfileById, userId]);

    return (
        <>
            {profile === null ? (
                <Spinner />
            ) : (
                <div className='container'>
                    <Link to='/profiles' className='btn btn-light'>
                        Back To Profiles
                    </Link>
                    {isAuthenticated &&
                        loading === false &&
                        user._id === userId && (
                            <Link to='/edit-profile' className='btn btn-dark'>
                                Edit Profile
                            </Link>
                        )}
                    <div className='profile-grid my-1'>
                        <ProfileTop profile={profile} />
                        <ProfileAbout profile={profile} />
                        <div className='profile-exp bg-white p-2'>
                            <h2 className='text-primary'>Experience</h2>
                            {profile.experience.length > 0 ? (
                                <>
                                    {profile.experience.map((experience) => (
                                        <ProfileExperience
                                            key={experience._id}
                                            experience={experience}
                                        />
                                    ))}
                                </>
                            ) : (
                                <h4>No experience credentials</h4>
                            )}
                        </div>
                        <div className='profile-edu bg-white p-2'>
                            <h2 className='text-primary'>Education</h2>
                            {profile.education.length > 0 ? (
                                <>
                                    {profile.education.map((education) => (
                                        <ProfileEducation
                                            key={education._id}
                                            education={education}
                                        />
                                    ))}
                                </>
                            ) : (
                                <h4>No education credentials</h4>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
const mapStateToProps = (state) => {
    console.log(state);
    return {
        profile: state.profile,
        auth: state.auth,
    };
};

export default connect(mapStateToProps, { getProfileById })(Profile);

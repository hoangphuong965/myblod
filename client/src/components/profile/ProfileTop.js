/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";

const ProfileTop = ({
    profile: {
        user: { name, avatar },
        company,
        location,
        website,
        social: { facebook, instagram, linkedin, twitter, youtube },
    },
}) => {
    return (
        /// top
        <div className='profile-top bg-primary p-2'>
            <img className='round-img my-1' src={avatar} alt='' />
            <h1 className='large'>{name}</h1>
            <p className='lead'>Developer at {company}</p>
            <p>{location}</p>
            <div className='icons my-1'>
                <a href={website} target='_blank' rel='noopener noreferrer'>
                    <i className='fas fa-globe fa-2x'></i>
                </a>
                <a href={twitter} target='_blank' rel='noopener noreferrer'>
                    <i className='fab fa-twitter fa-2x'></i>
                </a>
                <a href={facebook} target='_blank' rel='noopener noreferrer'>
                    <i className='fab fa-facebook fa-2x'></i>
                </a>
                <a href={linkedin} target='_blank' rel='noopener noreferrer'>
                    <i className='fab fa-linkedin fa-2x'></i>
                </a>
                <a href={youtube} target='_blank' rel='noopener noreferrer'>
                    <i className='fab fa-youtube fa-2x'></i>
                </a>
                <a href={instagram} target='_blank' rel='noopener noreferrer'>
                    <i className='fab fa-instagram fa-2x'></i>
                </a>
            </div>
        </div>
    );
};

export default ProfileTop;

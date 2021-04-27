import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { logout } from "../../_actions/auth";

const Navbar = (props) => {
    const {
        logout,
        isAuthenticated,
        auth: { user },
    } = props;

    const authLinks = (
        <ul>
            <li>
                <Link to='/profiles'>Developers</Link>
            </li>

            <li>
                <Link to='/dashboard'>
                    <i className='fas fa-user' />{" "}
                    <span className='hide-sm'>{user && user.name}</span>
                </Link>
            </li>
            <li>
                <Link onClick={logout} to='/'>
                    <i className='fas fa-sign-out-alt' />{" "}
                    <span className='hide-sm'>Logout</span>
                </Link>
            </li>
        </ul>
    );

    const guestLinks = (
        <ul>
            <li>
                <Link to='/profiles'>Developers</Link>
            </li>
            <li>
                <Link to='/register'>Register</Link>
            </li>
            <li>
                <Link to='/login'>Login</Link>
            </li>
        </ul>
    );

    return (
        <div>
            <nav className='navbar' style={{ background: "black" }}>
                <h1>
                    <Link to='/'>
                        <i className='fas fa-code' /> Blog's Dev
                    </Link>
                </h1>
                <>{isAuthenticated ? authLinks : guestLinks}</>
            </nav>
        </div>
    );
};
const mapStateToProps = (state) => {
    return {
        isAuthenticated: state.auth.isAuthenticated,
        auth: state.auth,
    };
};
export default connect(mapStateToProps, { logout })(Navbar);

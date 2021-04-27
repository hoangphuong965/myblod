import React, { useState } from "react";
import { Link, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { setAlert } from "../../_actions/alert";
import { register } from "../../_actions/auth";
import Alert from "../layout/Alert";

const Register = (props) => {
    const { setAlert, register, isAuthenticated } = props;

    const [formData, setFormdata] = useState({
        name: "",
        email: "",
        password: "",
        password2: "",
    });
    const { name, email, password, password2 } = formData;
    const onChange = (e) => {
        setFormdata({ ...formData, [e.target.name]: e.target.value });
    };

    const onSubmit = (e) => {
        e.preventDefault();
        if (password !== password2) {
            setAlert("password do not match", "danger");
        } else {
            register({ name, email, password });
            setAlert("register successfully", "success");
        }
    };

    if (isAuthenticated) {
        return <Redirect to='/dashboard' />;
    }

    return (
        <div>
            <section className='container'>
                <Alert />
                <h3 className='large text-primary'>Sign Up</h3>
                <p className='lead'>
                    <i className='fas fa-user'></i> Create Your Account
                </p>
                <form className='form' onSubmit={onSubmit}>
                    <div className='form-group'>
                        <input
                            type='text'
                            placeholder='Name'
                            name='name'
                            value={name}
                            autoComplete='true'
                            onChange={onChange}
                            required
                        />
                    </div>
                    <div className='form-group'>
                        <input
                            type='email'
                            placeholder='Email Address'
                            name='email'
                            value={email}
                            autoComplete='true'
                            onChange={onChange}
                            required
                        />
                        <small className='form-text'>
                            This site uses Gravatar so if you want a profile
                            image, use a Gravatar email
                        </small>
                    </div>
                    <div className='form-group'>
                        <input
                            type='password'
                            placeholder='Password'
                            name='password'
                            minLength='6'
                            value={password}
                            autoComplete='true'
                            onChange={onChange}
                            required
                        />
                    </div>
                    <div className='form-group'>
                        <input
                            type='password'
                            placeholder='Confirm Password'
                            name='password2'
                            minLength='6'
                            value={password2}
                            autoComplete='true'
                            onChange={onChange}
                            required
                        />
                    </div>
                    <input
                        type='submit'
                        className='btn btn-primary'
                        value='Register'
                    />
                </form>
                <p className='my-1'>
                    Already have an account? <Link to='/login'>Sign In</Link>
                </p>
            </section>
        </div>
    );
};

const mapStateToProps = (state) => {
    return {
        isAuthenticated: state.auth.isAuthenticated,
    };
};

export default connect(mapStateToProps, { setAlert, register })(Register);

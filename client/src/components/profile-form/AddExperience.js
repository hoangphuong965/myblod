import React, { useState } from "react";
import { connect } from "react-redux";
import { addExperience } from "../../_actions/profile";

const AddExperience = (props) => {
    const { addExperience, history } = props;
    const [formData, setFormData] = useState({
        title: "",
        company: "",
        location: "",
        from: "",
        current: false,
        to: "",
        description: "",
    });
    const {
        title,
        company,
        location,
        from,
        current,
        to,
        description,
    } = formData;
    const onChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    const onSubmit = (e) => {
        e.preventDefault();
        addExperience(formData, history);
    };
    return (
        <div className='container'>
            <h1 className='large text-primary'>Add An Experience</h1>
            <p className='lead'>
                <i className='fas fa-code-branch'></i> Add any
                developer/programming positions that you have had in the past
            </p>
            <small>* = required field</small>
            <form className='form' onSubmit={onSubmit}>
                <div className='form-group'>
                    <input
                        type='text'
                        placeholder='* Job Title'
                        name='title'
                        required
                        value={title}
                        onChange={onChange}
                    />
                </div>
                <div className='form-group'>
                    <input
                        type='text'
                        placeholder='* Company'
                        name='company'
                        required
                        value={company}
                        onChange={onChange}
                    />
                </div>
                <div className='form-group'>
                    <input
                        type='text'
                        placeholder='Location'
                        name='location'
                        value={location}
                        onChange={onChange}
                    />
                </div>
                <div className='form-group'>
                    <h4>From Date</h4>
                    <input
                        type='date'
                        name='from'
                        value={from}
                        onChange={onChange}
                        required
                    />
                </div>
                <div className='form-group'>
                    <p>
                        <input
                            type='checkbox'
                            name='current'
                            value={current}
                            checked={current}
                            onChange={() => {
                                setFormData({ ...formData, current: !current });
                            }}
                        />{" "}
                        Current Job
                    </p>
                </div>
                <div className='form-group'>
                    <h4>To Date</h4>
                    <input
                        type='date'
                        name='to'
                        value={to}
                        onChange={onChange}
                    />
                </div>
                <div className='form-group'>
                    <textarea
                        name='description'
                        cols='30'
                        rows='5'
                        placeholder='Job Description'
                        to={description}
                        onChange={onChange}></textarea>
                </div>
                <input type='submit' className='btn btn-primary my-1' />
                <a className='btn btn-light my-1' href='dashboard'>
                    Go Back
                </a>
            </form>
        </div>
    );
};

export default connect(null, { addExperience })(AddExperience);

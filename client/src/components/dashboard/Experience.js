import React from "react";
import { connect } from "react-redux";
import formatDate from "../../utils/formatDate";
import { deleteExperience } from "../../_actions/profile";

const Experience = (props) => {
    const { experience, deleteExperience } = props;
    const experiences = experience.map((exp) => (
        <tr key={exp._id}>
            <td>{exp.company}</td>
            <td className='hide-sm'>{exp.title}</td>
            <td>
                {formatDate(exp.from)} - {exp.to ? formatDate(exp.to) : "Now"}
            </td>
            <td>
                <button
                    // onClick={() => editExperience(exp._id)}
                    className='btn'>
                    <i className='fas fa-edit'></i>
                </button>
                <button
                    onClick={() => {
                        const confirm = window.confirm(
                            `do you want delete ${exp.company}`
                        );
                        if (confirm === true) {
                            deleteExperience(exp._id);
                        }
                    }}
                    className='btn'>
                    <i className='fas fa-trash-alt'></i>
                </button>
            </td>
        </tr>
    ));

    return (
        <>
            <h2 className='my-2'>Experience Credentials</h2>
            <table className='table'>
                <thead>
                    <tr>
                        <th>Company</th>
                        <th className='hide-sm'>Title</th>
                        <th className='hide-sm'>Years</th>
                        <th />
                    </tr>
                </thead>
                <tbody>{experiences}</tbody>
            </table>
        </>
    );
};
export default connect(null, { deleteExperience })(Experience);

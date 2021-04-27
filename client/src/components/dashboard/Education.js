import React from "react";
import { connect } from "react-redux";
import formatDate from "../../utils/formatDate";
import { deleteEducation } from "../../_actions/profile";

const Education = (props) => {
    const { education, deleteEducation } = props;
    const educations = education.map((edu) => (
        <tr key={edu._id}>
            <td>{edu.school}</td>
            <td className='hide-sm'>{edu.degree}</td>
            <td>
                {formatDate(edu.from)} - {edu.to ? formatDate(edu.to) : "Now"}
            </td>
            <td>
                <button
                    // onClick={() => editEducation(edu._id)}
                    className='btn'>
                    <i className='fas fa-edit'></i>
                </button>
                <button
                    onClick={() => {
                        const confirm = window.confirm(
                            `do you want delete ${edu.school}`
                        );
                        if (confirm === true) {
                            deleteEducation(edu._id);
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
            <h2 className='my-2'>Education Credentials</h2>
            <table className='table'>
                <thead>
                    <tr>
                        <th>School</th>
                        <th className='hide-sm'>Degree</th>
                        <th className='hide-sm'>Years</th>
                        <th />
                    </tr>
                </thead>
                <tbody>{educations}</tbody>
            </table>
        </>
    );
};
export default connect(null, { deleteEducation })(Education);

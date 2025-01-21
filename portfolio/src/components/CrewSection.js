// CrewSection.js
import React from "react";
import Tag from "./Tag";

const CrewSection = ({ crew, title, jobFilter }) => {
    // Filter crew based on job titles
    const filteredCrew = crew.filter(
        member => jobFilter.includes(member.job)
    );

    if (!filteredCrew.length) return null;

    return (
        <>
            <h3>{title}</h3>
            {filteredCrew.map(member => (
                <Tag 
                    key={member.credit_id} 
                    name={member.name} 
                    role={member.job} 
                />
            ))}
        </>
    );
};

export default CrewSection;
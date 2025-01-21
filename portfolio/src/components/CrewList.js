import React from 'react';
import CrewSection from './CrewSection';
import crewCategories from '../data/crewCategories.json';

const CrewList = ({ crew }) => {
    if (!crew || crew.length === 0) return null;

    return (
        <div className="tag-container">
            <h3>Key Crew Members</h3>
            {crewCategories.map(({ title, jobs }) => (
                <CrewSection key={title} crew={crew} jobFilter={jobs} title={title} />
            ))}
        </div>
    );
};

export default CrewList;
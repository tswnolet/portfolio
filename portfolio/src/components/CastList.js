import React from 'react';
import Tag from './Tag';

const CastList = ({ cast }) => {
    if (!cast || cast.length === 0) return null;

    return (
        <div className='tag-container'>
            <h3>Cast</h3>
            <div id='actors' className='tags'>
                {cast.map((actor) => (
                    <Tag key={actor.id} name={actor.name} role={actor.character} />
                ))}
            </div>
        </div>
    );
};

export default CastList;
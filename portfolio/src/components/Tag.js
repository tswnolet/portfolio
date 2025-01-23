import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Tag = ({ name, role }) => {
    const [hoveringTag, setHoveringTag] = useState(false);

    return (
        <div className="crew" onMouseOver={() => setHoveringTag(true)} onMouseLeave={() => setHoveringTag(false)}>
            <p>{name}</p>
            {hoveringTag && (
                <div className="tooltip">
                    {role}
                </div>
            )}
        </div>
    );
};

export default Tag;
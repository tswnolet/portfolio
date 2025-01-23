import React from "react";

const LoadingCard = () => {
    return (
        <div className="loading-card">
            <div className="loading-sheen"></div>
            <div className="loading-spinner"></div> {/* Unique loading icon */}
        </div>
    );
};

export default LoadingCard;
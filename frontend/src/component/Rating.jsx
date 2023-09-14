import React from "react";

const Rating = ({ value, text, color }) => {
    return (
        <div className="rating">
            {Array.from({ length: 5 }, (_, i) => (
                <span key={i + 1}>
                    <i
                        style={{ color }}
                        className={
                            value >= i + 1
                                ? "fas fa-star"
                                : value >= i + 0.5
                                ? "fas fa-star-half-alt"
                                : "far fa-star"
                        }
                    ></i>
                </span>
            ))}
            <span>{text && text}</span>
        </div>
    );
};

export default Rating;

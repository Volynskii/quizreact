import React from 'react';

const QuestionPicture = ({ imageUrl, altText }) => {
    return (
        <div className="question-picture-container">
            <img src={imageUrl} alt={altText} />
        </div>
    );
};

export default QuestionPicture;

import React from 'react';

const QuizContainer = ({ children, className }) => {
    
    return (
        <div className={className}>
            {children}
        </div>
    );
};

export default QuizContainer;

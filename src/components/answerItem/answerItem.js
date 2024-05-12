import React from 'react';

const QuestionAnswerItem = ({ id, title, correctId, selectedOption, index, optionsDisabled, handleSelect }) => {

    return (
        <li className={`question-answer ${id === correctId ? 'question-answer-correct' : ''}
                         ${id !== correctId && id === selectedOption ? 'question-answer-wrong' : ''} 
                         ${id === selectedOption ? 'selected' : ''} 
                         ${optionsDisabled[index] ? 'disabled' : ''}`}
            key={id}>
            <input type="radio" id={id} name="answer" value={title}
                   onChange={() => handleSelect(id, index)}
                   checked={selectedOption === title} disabled={optionsDisabled} />
            <label htmlFor={id} className="answer-container-text">
                <i className="control"></i>
                <span className="answer text">{title}</span>
            </label>
        </li>
    );
};

export default QuestionAnswerItem;

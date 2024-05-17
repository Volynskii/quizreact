import React from 'react';
import classNames from 'classnames';

const QuestionAnswerItem = ({ id, title, correctId, selectedOption, index, optionsDisabled, handleSelect }) => {

    const getAnswerClasses = () => {
        let classes = ['question-answer'];
        if (id === correctId) classes.push('question-answer-correct');
        if (id !== correctId && id === selectedOption) classes.push('question-answer-wrong');
        if (id === selectedOption) classes.push('selected');
        if (optionsDisabled[index]) classes.push('disabled');
        return classes.join(' ');
    };

    return (
        <li className={getAnswerClasses()} key={id}>
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


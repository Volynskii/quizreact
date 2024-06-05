import React from 'react';
import classNames from 'classnames';

const QuestionAnswerItem = ({ id, title, correctId, selectedOption, index, optionsDisabled, handleSelect, picture }) => {
    console.log('picture',picture)
    const getAnswerClasses = () => {
        let classes = ['question-answer'];
        if (id === correctId) classes.push('question-answer-correct');
        if (id !== correctId && id === selectedOption) classes.push('question-answer-wrong');
        if (id === selectedOption) classes.push('selected');
        if (optionsDisabled[index]) classes.push('disabled');
        return classes.join(' ');
    };

    console.log('title!', title)

    return (
        <li className={getAnswerClasses()} key={id}>
            {picture && (
                <img src={picture}/>
            )}
            <input type="radio" id={id} name="answer" value={title}
                   onChange={() => handleSelect(id, index)}
                   checked={selectedOption === title} disabled={optionsDisabled} />
            <label htmlFor={id} className="answer-container-text">
                <i className={`control ${id === selectedOption && 'control-wrong'}`}>

                </i>
                <span className={`answer text ${id === correctId && 'answer-text-correct'}`}>{title}</span>
            </label>
        </li>
    );
};

export default QuestionAnswerItem;


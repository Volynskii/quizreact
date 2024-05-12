import React from 'react';
import QuestionAnswerItem from "../answerItem/answerItem";

const QuestionAnswersList = ({ quizData, currentQuestion, correctId, selectedOption, optionsDisabled, handleSelect }) => {

    return (
        <ul className="question-answers">
            {quizData[currentQuestion]?.quiz_a.map(({ title, id }, index) => (
                <QuestionAnswerItem
                    key={id}
                    id={id}
                    title={title}
                    correctId={correctId}
                    selectedOption={selectedOption}
                    index={index}
                    optionsDisabled={optionsDisabled}
                    handleSelect={handleSelect}
                />
            ))}
        </ul>
    );
};

export default QuestionAnswersList;

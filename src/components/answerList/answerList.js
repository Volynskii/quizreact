import React from 'react';
import QuestionAnswerItem from "../answerItem/answerItem";

const QuestionAnswersList = ({ quizData, currentQuestion, correctId, selectedOption, optionsDisabled, handleOptionSelectAndSubmit }) => {
    return (
        <ul className="question-answers">
            {quizData[currentQuestion]?.quiz_a.map(({ title, id }, index) => (
                <QuestionAnswerItem
                    id={id}
                    title={title}
                    correctId={correctId}
                    selectedOption={selectedOption}
                    index={index}
                    optionsDisabled={optionsDisabled}
                    handleOptionSelectAndSubmit={handleOptionSelectAndSubmit}
                />
            ))}
        </ul>
    );
};

export default QuestionAnswersList;

import React, { useEffect, useState } from 'react';
import useApiRequests from "../utils/hooks/apiRequest";
import SubmitButton from "../components/submit-button";
import LoadingSpinner from "../components/loadingSpinner/loadingSpinner";
import ErrorMessage from "../components/errorMessage/errorMessage";
import fetchCookie from "../utils/api/fetchCookie";
import { calculateProgressBarWidth } from "../utils/helpers/calculateProgressBar";
import QuestionAnswersList from "../components/answerList/answerList";
import styles from '../App.scss';
import Question from "../components/question/question";
import QuestionPicture from "../components/questionPicture/questionPicture";
import ProgressBar from "../components/progressBar/progressBar";

function QuizApp() {
    const [correctId, setCorrectId] = useState('');
    const [quizData, setQuizData] = useState(null);
    const [currentQuestion, setCurrentQuestion] = useState(5);
    const [selectedOption, setSelectedOption] = useState('');
    const [questionsLength, setQuestionsLength] = useState(0);
    const [optionsDisabled, setOptionsDisabled] = useState(Array(4).fill(false));
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const quizId = window.location.pathname.split("/")[1];
    const { sendRequest } = useApiRequests();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const url = `https://quiz.vgtrk.com/index.php?action=data&id=${quizId}`;
                const response = await sendRequest(url);
                const quizData = response.data.quiz_q;
                setQuizData(quizData);
                setQuestionsLength(quizData.length);
                setIsLoading(false);
            } catch (error) {
                setError('Error fetching quiz data');
                setIsLoading(false);
            }
        };

        fetchData();
    }, [quizId, sendRequest]);

    // Define an async function to handle the option select and submission
    const handleOptionSelectAndSubmit = async (option, index) => {
        setSelectedOption(option);
        setOptionsDisabled(prevState => prevState.map((val, i) => i === index ? true : val));
        try {
            const uid = await fetchCookie(); // Fetch cookie
            await submitAnswer(option, uid); // Submit answer with the fetched cookie
        } catch (error) {
            console.error('Error handling option select and submit:', error);
        }
    };

    const submitAnswer = async (option, uid) => {
        try {
            const url = 'https://quiz.vgtrk.com';
            const response = await sendRequest(url, 'POST', {
                "quiz_id": quizId,
                "quest_id": quizData[currentQuestion].id,
                "uid": uid, // Use the fetched uid
                "answers[]": option,
                "action": "answer"
            });

            setCorrectId(response.data.correct[0]);
        } catch (error) {
            console.error('Error submitting answer:', error);
        }
    };

    const handleNextQuestion = () => {
        setCurrentQuestion(prev => prev + 1);
        setSelectedOption('');
        setOptionsDisabled(Array(4).fill(false));
    };

    if (isLoading) {
        return <LoadingSpinner />;
    }

    if (error) {
        return <ErrorMessage message={error} />;
    }

    const progressBarWidth = calculateProgressBarWidth(currentQuestion + 1, questionsLength);

    return (
        <div className="quiz">
            <ProgressBar progressBarWidth={progressBarWidth}/>
            <QuestionPicture imageUrl={quizData[currentQuestion]?.pictures?.sizes?.xw?.url}/>
                <Question title={quizData[currentQuestion]?.title}/>
                <QuestionAnswersList
                    quizData={quizData}
                    currentQuestion={currentQuestion}
                    correctId={correctId}
                    selectedOption={selectedOption}
                    optionsDisabled={optionsDisabled}
                    handleOptionSelectAndSubmit={handleOptionSelectAndSubmit}
                />
                {selectedOption !== '' && (
                    <SubmitButton onClick={handleNextQuestion} />
                )}
        </div>
    );
}

export default QuizApp;

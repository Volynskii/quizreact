import React, { useEffect, useState, useMemo } from 'react';
import useApiRequests from "../../utils/hooks/apiRequest";
import SubmitButton from "../submit-button";
import LoadingSpinner from "../loadingSpinner/loadingSpinner";
import ErrorMessage from "../errorMessage/errorMessage";
import fetchUid from "../../utils/api/fetchUid";
import { calculateProgressBarWidth } from "../../utils/helpers/calculateProgressBar";
import QuestionAnswersList from "../answerList/answerList";
// import styles from '../App.scss';
import Question from "../question/question";
import QuestionPicture from "../questionPicture/questionPicture";
import ProgressBar from "../progressBar/progressBar";
import scrollToTop from "../../utils/helpers/scrollTop";
import Cookies from 'js-cookie';

function Quiz({data}) {
    console.log('data!',data)
    const quizId = window.location.pathname.split("/")[1];
    const initialQuestion = Cookies.get(`quiz_id_${quizId}`) || 0;
    const [correctId, setCorrectId] = useState('');
    const [uid, setUid] = useState('');
    const [quizData, setQuizData] = useState(data.data.quiz_q);
    const [currentQuestion, setCurrentQuestion] = useState(parseInt(initialQuestion));
    const [selectedOption, setSelectedOption] = useState('');
    const [questionsLength, setQuestionsLength] = useState(data.data.quiz_q);
    const [optionsDisabled, setOptionsDisabled] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const progressBarWidth = useMemo(() => {
        return calculateProgressBarWidth(currentQuestion + 1, questionsLength);
    }, [currentQuestion, questionsLength]);

    const { sendRequest } = useApiRequests();

    useEffect(() => {
        const checkUidInCookie = () => {
            const cookieUid = Cookies.get('quiz_uid');
            if (cookieUid) {
                setUid(cookieUid);
            } else {
                fetchUidFromApi();
            }
        };

        const fetchUidFromApi = async () => {
            const userId = await fetchUid();
            setUid(userId);
            Cookies.set('quiz_uid', userId, { expires: 7 }); // сохраняем uid в куки на 7 дней
        };

        checkUidInCookie();
    }, [quizId]);

    useEffect(() => {
        if (currentQuestion === questionsLength - 1) {
            console.log('final question!')
            finish()

        }
    }, [selectedOption]);

    useEffect(() => {
        Cookies.set(`quiz_id_${quizId}`, currentQuestion);
    }, [currentQuestion]);

    const handleSelect = async (option) => {
        setSelectedOption(option);
        setOptionsDisabled(true);
        try {
            await submitAnswer(option); // Отправляем ответ на сервер
        } catch (error) {
            console.error('Ошибка обработки выбора и отправки ответа:', error);
        }
    };

    const submitAnswer = async (option) => {
        try {
            const url = 'https://quiz.vgtrk.com/';
            const response = await sendRequest(url, 'POST', {
                "quiz_id": quizId,
                "quest_id": quizData[currentQuestion].id,
                "uid": uid,
                "answers[]": option,
                "action": "answer"
            });

            setCorrectId(response.data.correct[0]);
        } catch (error) {
            console.error('Ошибка отправки ответа:', error);
        }
    };

    const finish = async () => {
        try {
            const url = 'https://quiz.vgtrk.com/';
            const response = await sendRequest(url, 'POST', {
                "quiz_id": quizId,
                "uid": uid,
                "action": "finish",
                "referer": window.location.href
            });
            console.log('response!', response)
        } catch (error) {
            console.error('Ошибка отправки ответа:', error);
        }
    };

    const handleNextQuestion = () => {
        setCurrentQuestion(prev => prev + 1);
        setSelectedOption('');
        setOptionsDisabled(false);
        scrollToTop();
    };

    if (isLoading) {
        return <LoadingSpinner />;
    }

    if (error) {
        return <ErrorMessage message={error} />;
    }

    return (
        <>
            {!isLoading && (
                <div className="quiz">
                    <ProgressBar progressBarWidth={progressBarWidth} />
                    <QuestionPicture imageUrl={quizData[currentQuestion]?.pictures?.sizes?.xw?.url} />
                    <Question title={quizData[currentQuestion]?.title} />
                    <QuestionAnswersList
                        quizData={quizData}
                        currentQuestion={currentQuestion}
                        correctId={correctId}
                        selectedOption={selectedOption}
                        optionsDisabled={optionsDisabled}
                        handleSelect={handleSelect}
                    />
                    {selectedOption !== '' && (
                        <SubmitButton onClick={handleNextQuestion} />
                    )}
                </div>
            )}
        </>
    );
}

export default Quiz;

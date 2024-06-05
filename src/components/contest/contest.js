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
import Finish from "../finish/finish";
import PlayAgain from "../playAgain/playAgain";
import QuizContainer from "../QuizContainer/QuizContainer";
import { BASE_URL, socialMedia } from "../../utils/config";

function Contest({ data }) {
    console.log('data!', data)
    const [isLoadingButton,setIsLoadingButton] = useState(false)
    const [isPlayAgain,setIsPlayAgain] = useState(false)
    const cookieUid = Cookies.get('quiz_uid');
    const quizId = window.location.pathname.split("/")[1];
    const initialQuestion = Cookies.get(`quiz_id_${quizId}`) || 0;
    const [correctId, setCorrectId] = useState('');
    const [uid, setUid] = useState('');
    const [quizData, setQuizData] = useState(data.data.quiz_q);
    const [currentQuestion, setCurrentQuestion] = useState(initialQuestion);
    const [selectedOption, setSelectedOption] = useState('');
    const [questionsLength, setQuestionsLength] = useState(data.data.quiz_q.length);
    const [optionsDisabled, setOptionsDisabled] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isFinished, setIsFinished] = useState(false); // Новое состояние
    const progressBarWidth = useMemo(() => {
        return calculateProgressBarWidth(currentQuestion + 1, questionsLength);
    }, [currentQuestion, questionsLength]);

    const { sendRequest } = useApiRequests();
    const [result,setResult] = useState(null);

    const HandleFirstQuestion = (question) => {
        setCurrentQuestion(question)
        setIsPlayAgain(false)
    }

    const HandleFirstQuestion2 = (question) => {
        setCurrentQuestion(question)
        setIsFinished(false)
    }
    console.log('current question!', currentQuestion)

    useEffect(() => {
        const checkUidInCookie = () => {
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
        if (currentQuestion === questionsLength) {
            finish();
        }

        if (currentQuestion === 'start') {
            setIsPlayAgain(true)
        }
    }, [selectedOption]);

    useEffect(() => {
        if (currentQuestion === questionsLength && quizId) {
            Cookies.set(`quiz_id_${quizId}`, 'start');
        }
        else {
            console.log('worked this 2!', currentQuestion)
            Cookies.set(`quiz_id_${quizId}`, currentQuestion);
        }
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
            setIsLoadingButton(true)
            const url = `${BASE_URL}`;
            const response = await sendRequest(url, 'POST', {
                "quiz_id": quizId,
                "quest_id": quizData[currentQuestion].id,
                "uid":  uid,
                "answers[]": option,
                "action": "answer"
            });
            setIsLoadingButton(false)
            setCorrectId(response.data.correct[0]);
        } catch (error) {
            console.error('Ошибка отправки ответа:', error);
        }
    };

    const finish = async () => {
        try {
            const url = `${BASE_URL}`;
            const post = {
                "quiz_id": quizId,
                "uid": cookieUid || uid,
                "action": "finish",
                "referer": window.location.href
            }
            console.log('post!', post)
            const response = await sendRequest(url, 'POST', post);
            console.log('response!', response);
            setResult(response);
            setIsFinished(true); // Устанавливаем isFinished в true
        } catch (error) {
            console.error('Ошибка отправки ответа:', error);
        }
    };



    const handleNextQuestion = () => {
        setCurrentQuestion(prev => Number(prev) + 1);
        setSelectedOption('');
        setOptionsDisabled(false);
        scrollToTop();
    };

    const getButtonText = () => {
        if (currentQuestion === questionsLength - 1) {
            return 'Завершить';
        } else {
            return 'Следующий вопрос »';
        }
    };


    if (isLoading) {
        return <LoadingSpinner />;
    }

    if (error) {
        return <ErrorMessage message={error} />;
    }

    if (isFinished) {
        return <Finish result={result} HandleFirstQuestion={HandleFirstQuestion2} socialMedia={socialMedia} />
    }

    if (isPlayAgain) {
        return <PlayAgain HandleFirstQuestion={HandleFirstQuestion}/>
    }


    return (
        <>
            {!isLoading && (
                <QuizContainer className={'quiz contest'}>
                    <ProgressBar progressBarWidth={progressBarWidth}/>
                    <QuestionPicture imageUrl={quizData[currentQuestion]?.pictures?.sizes?.xw?.url}/>
                    <Question title={quizData[currentQuestion]?.title}/>
                    <QuestionAnswersList
                        quizData={quizData}
                        currentQuestion={currentQuestion}
                        correctId={correctId}
                        selectedOption={selectedOption}
                        optionsDisabled={optionsDisabled}
                        handleSelect={handleSelect}
                    />
                    {selectedOption !== '' && !isLoading && (
                        <SubmitButton
                            onClick={currentQuestion === questionsLength - 1 ?
                                finish :
                                handleNextQuestion}
                            text={getButtonText()}
                            isLoadingButton={isLoadingButton}
                        />
                    )}
                </QuizContainer>
            )}
        </>
    );
}

export default Contest;

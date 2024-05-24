import React, { useEffect, useState } from 'react';
import useApiRequests from "../utils/hooks/apiRequest";
import LoadingSpinner from "../components/loadingSpinner/loadingSpinner";
import styles from '../App.scss';
import Quiz from "../components/quiz/quiz";
import Contest from "../components/contest/contest";

function QuizApp() {
    const quizId = window.location.pathname.split("/")[1];

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const { sendRequest } = useApiRequests();
    const [isCompetition, setIsCompetition] = useState('');
    const [response, setResponse] = useState({});
    const [type, setType] = useState('');
    console.log('type!', type)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const url = `http://quiz.imolchanov.dev.rfn.ru/index.php?action=data&id=${quizId}`;
                const response = await sendRequest(url);
                const quizData = response.data.quiz_q;


                // Проверяем наличие картинок в ответах всех вопросов
                const hasPictures = quizData.some(question =>
                    question.quiz_a.some(answer => answer.hasOwnProperty('pictures'))
                );

                if (hasPictures) {
                    setType('1');
                } else {
                    setType('0');
                }

                setIsCompetition(response.data.isCompetition);
                setResponse(response);
                setIsLoading(false);
            } catch (error) {
                console.log('error!', error);
                setError('Викторина не найдена');
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const renderQuizType = (type, data) => {
        if (type === '0') return <Quiz data={data} />;
        if (type === '1') return <Contest data={data} />;
        return null;
    };

    if (isLoading) {
        return <LoadingSpinner />;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <>
            {renderQuizType(type, response)}
        </>
    );
}

export default QuizApp;

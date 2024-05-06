import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import styles from '../App.css';

function QuizApp() {
    const [quizData, setQuizData] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState(4);
    const [selectedOption, setSelectedOption] = useState('');
    const [score, setScore] = useState(0);
    const [questionsLength, setQuestionsLength] = useState(0);
    const [answers,setAnswers] = useState();

    const quizId = window.location.pathname.split("/")[1];
    const action = 'answer'

    const [questionId, setQuestionId] = useState('');
    const [userId,setUserId] = useState('');
    console.log('quizId', quizId )
    console.log('questionId',questionId)
    console.log('userId',userId)

    console.log('action', action)
    console.log('answers[]', selectedOption)

    const fetchData = async () => {
        try {
            const url = `https://quiz.vgtrk.com/index.php?action=data&id=${quizId}`;
            const response = await axios.get(url);
            // console.log('data!', )
            const quizData = response.data.data.quiz_q;
            const quest_id = response.data.data.quiz_q[currentQuestion].id;

            const uid = await fetchCookie();
            setUserId(uid);
            setQuestionId(quest_id);


            setQuizData(quizData);
            setQuestionsLength(quizData.length);
            setIsLoaded(true);
        } catch (error) {
            console.error('Error fetching data:', error);
            setIsLoaded(false);
        }
    };

    const fetchCookie = async () => {
        try {
            const url = 'https://quiz.vgtrk.com/?action=auth';
            const response = await axios.post(url);
            const quiz_uid = response.data.data.uid;
            // Устанавливаем куку
            return quiz_uid;

        } catch (error) {
            console.error('Error fetching data:', error);
            setIsLoaded(false);
        }
    }

    useEffect(() => {
        // fetchCookie();
        fetchData();
    }, []);

    const progressBarWidth = ((currentQuestion + 1) / questionsLength) * 100;

    const handleOptionSelect = async (option) => {

       await submitAnswer(option);
    };

    const submitAnswer = async (option) => {
        try {
            const url = 'https://quiz.vgtrk.com';
            const response = await axios.post(url, {
                "quiz_id": quizId,
                "quest_id": questionId,
                "uid": userId,
                "answers[]": option,
                "action": "answer"
            }, {
                headers: {
                    'Content-Type': 'multipart/form-data' // Set content type to multipart/form-data
                }
            });

            console.log('response!', response.data.data);

        } catch (error) {
            console.error('Error submitting answer:', error);
        }
    };

    const handleNextQuestion = () => {
        setCurrentQuestion(prev => prev + 1);
    };

    return (
        <>
            {isLoaded ? (
                <div className="quiz">
                    <div className="progressBar">
                        <div style={{ width: `${progressBarWidth}%` }} className="progressBar__filled"></div>
                    </div>
                    <div className="question-picture-container">
                        <img src={quizData[currentQuestion]?.pictures?.sizes?.xw?.url} alt="Question" />
                    </div>
                    {currentQuestion < questionsLength ? (
                        <div>
                            <div className="question-text">
                                {quizData[currentQuestion]?.title}
                            </div>
                            <ul className="question-answers">
                                {quizData[currentQuestion]?.quiz_a.map(({ title, id }) => (
                                    <li className="question-answer" key={id}>
                                        <input type="radio" id={id} name="answer" value={title} onChange={() => handleOptionSelect(id)} checked={selectedOption === title} />
                                        <label htmlFor={id} className="answer-container-text">
                                            <i className="control"></i>
                                            <span className="answer text">{title}</span>
                                        </label>
                                    </li>
                                ))}
                            </ul>
                            {selectedOption !== '' && (
                                <p>{/* Add logic for correct/wrong answer */}</p>
                            )}
                            <button onClick={handleNextQuestion}>Next</button>
                        </div>
                    ) : (
                        <div>
                            <h2>Quiz Complete!</h2>
                            <p>Your Score: {score}</p>
                        </div>
                    )}
                </div>
            ) : (
                <div>Loading...</div>
            )}
        </>
    );
}

export default QuizApp;

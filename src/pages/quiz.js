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

    const fetchData = async () => {
        try {
            const url = 'https://quiz.vgtrk.com/index.php?action=data&id=63';
            const response = await axios.get(url);
            const quizData = response.data.data.quiz_q;
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
            Cookies.set('quiz_uid', quiz_uid);

            // Получаем куку
            const cookieValue = Cookies.get('myCookie');
            console.log(cookieValue); // Выведет 'cookieValue'

            // Удаляем куку
            Cookies.remove('myCookie');
        } catch (error) {
            console.error('Error fetching data:', error);
            setIsLoaded(false);
        }
    }

    useEffect(() => {
        fetchData();
        fetchCookie();
    }, []);

    const progressBarWidth = ((currentQuestion + 1) / questionsLength) * 100;

    const handleOptionSelect = (option) => {
        setSelectedOption(option);
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
                                        <input type="radio" id={id} name="answer" value={title} onChange={() => handleOptionSelect(title)} checked={selectedOption === title} />
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

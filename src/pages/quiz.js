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
import scrollToTop from "../utils/helpers/scrollTop";

function QuizApp() {
    const [correctId, setCorrectId] = useState('');
    const [quizData, setQuizData] = useState(null);
    const [currentQuestion, setCurrentQuestion] = useState(5);
    const [selectedOption, setSelectedOption] = useState('');
    const [questionsLength, setQuestionsLength] = useState(0);
    const [optionsDisabled, setOptionsDisabled] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const progressBarWidth = calculateProgressBarWidth(currentQuestion + 1, questionsLength);
    console.log('questionsLength',questionsLength)

    const quizId = window.location.pathname.split("/")[1];
    const {sendRequest} = useApiRequests();

    console.log('selectedOption',selectedOption)
    useEffect(() => {
        const fetchData = async () => {

            try {
                const url = `https://quiz.vgtrk.com/index.php?action=data&id=${quizId}`;
                const response = await sendRequest(url);
                const quizData = response.data.quiz_q;
                if (response.data.isCompetition === '0') {
                    setQuizData(()=> quizData);
                    setQuestionsLength(()=> quizData.length);
                    setIsLoading(()=> false);
                } else {
                    return <LoadingSpinner/>
                }

            } catch (error) {
                setError(()=> 'Error fetching quiz data');
                setIsLoading(()=> false);
            }
        };

        fetchData();
    }, [quizId]);

    useEffect(()=> {
        if (currentQuestion === questionsLength - 1) {
            console.log('final question!')
        }
    },[])

    // useEffect( ()=> {
    //    const HandleSubmit = async () => {
    //        if (selectedOption) {
    //            try {
    //                const uid = await fetchCookie(); // Fetch cookie
    //                await submitAnswer(selectedOption, uid); // Submit answer with the fetched cookie
    //            } catch (error) {
    //                console.error('Error handling option select and submit:', error);
    //            }
    //        }
    //    }
    //    HandleSubmit();
    // },[selectedOption])

    const handleSelect = async (option) => {
        setSelectedOption(()=> option);
        setOptionsDisabled(()=> true);
        try {
            const uid = await fetchCookie(); // Fetch cookie
            await submitAnswer(selectedOption, uid); // Submit answer with the fetched cookie
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

            console.log('response!', response)
            setCorrectId(response.data.correct[0]);
        } catch (error) {
            console.error('Error submitting answer:', error);
        }
    };

    const handleNextQuestion = () => {
        setCurrentQuestion(prev => prev + 1);
        setSelectedOption('');
        setOptionsDisabled(false);
        scrollToTop();
    };

    if (isLoading) {
        return <LoadingSpinner/>;
    }

    if (error) {
        return <ErrorMessage message={error}/>;
    }

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
                handleSelect={handleSelect}
            />
            {selectedOption !== '' && (
                <SubmitButton onClick={handleNextQuestion}/>
            )}
        </div>
    );
}

export default QuizApp;

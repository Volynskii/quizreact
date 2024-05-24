export const calculateProgressBarWidth = (currentQuestion, totalQuestions) => {
    return (currentQuestion / totalQuestions) * 100;
};
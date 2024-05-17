export const calculateProgressBarWidth = (currentQuestion, totalQuestions) => {
    return (currentQuestion / totalQuestions.length) * 100;
};
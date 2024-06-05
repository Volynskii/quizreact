import React from 'react';
import QuestionPicture from "../questionPicture/questionPicture";
import SubmitButton from "../submit-button";
import ShareButton from "../shareButton/shareButton";
import Share from "../share/socialMedia";
import SocialMedia from "../share/socialMedia";
import QuizContainer from "../QuizContainer/QuizContainer";
import SubmitButtonContainer from "../SubmitButtonContainer/SubmitButtonContainer";

const Finish = ({ result, HandleFirstQuestion, socialMedia }) => {

    const url = `https://quiz.vgtrk.com/?action=share&uid=${result.data.share_uid}`
    const title = result.data.quiz_title;
    const description = result.data.rating_description;
    const image = result.data.picture;

    console.log('result!', result)

    return (
       <>
           <QuizContainer className={'quiz'}>
           <QuestionPicture imageUrl={result.data.picture} />
           <div className={'quiz__result-description'}>{result.data.rating_description}</div>
           <SocialMedia url={url} title={title} description={description} image={image}  socialMedia={socialMedia}/>
               <SubmitButtonContainer>
           <SubmitButton onClick={() => HandleFirstQuestion(0)} text={'Пройти еще раз'} />
               </SubmitButtonContainer>
               </QuizContainer>
       </>
    );
};

export default Finish;
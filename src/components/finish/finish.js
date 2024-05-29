import React from 'react';
import QuestionPicture from "../questionPicture/questionPicture";
import SubmitButton from "../submit-button";
import ShareButton from "../shareButton/shareButton";
import Share from "../share/socialMedia";
import SocialMedia from "../share/socialMedia";

const Finish = ({ result, HandleFirstQuestion, socialMedia }) => {

    const url = `https://quiz.vgtrk.com/?action=share&uid=${result.data.share_uid}`
    const title = result.data.quiz_title;
    const description = result.data.rating_description;
    const image = result.data.picture;

    return (
       <>
           <QuestionPicture imageUrl={result.data.picture} />
           <div className={'quiz__result-description'}>{result.data.rating_description}</div>
           <SocialMedia url={url} title={title} description={description} image={image}  socialMedia={socialMedia}/>
           <SubmitButton onClick={() => HandleFirstQuestion(0)} text={'Пройти еще раз'} />
       </>
    );
};

export default Finish;
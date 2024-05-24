import React from 'react';
import QuestionPicture from "../questionPicture/questionPicture";
import SubmitButton from "../submit-button";

const Finish = ({result}) => {
    console.log('result!', result)
    return (
       <>
           <QuestionPicture imageUrl={result.data.picture} />
           <div className={'quiz__result-description'}>{result.data.rating_description}</div>
           <SubmitButton onClick={() => console.log('click')} text={'Пройти еще раз'} />
       </>
    );
};

export default Finish;
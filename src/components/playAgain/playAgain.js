import React from 'react';
import SubmitButton from "../submit-button";

const PlayAgain = ({HandleFirstQuestion}) => {
    console.log('HandleFirstQuestion',HandleFirstQuestion)
    return (
       <>
           <div className={'quiz__warning'}>
               <SubmitButton onClick={() => HandleFirstQuestion(0)} text={'ПРОЙТИ ТЕСТ'} />
           </div>
       </>
    );
};

export default PlayAgain;
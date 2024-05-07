import React, {useEffect, useRef} from 'react';

const SubmitButton = ({ onClick }) => {

    const myComponentRef = useRef(null);

    const scrollToComponent = () => {
        console.log('scroll!')
        if (myComponentRef.current) {
            myComponentRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    useEffect(()=> {
        scrollToComponent();
    },[])

    return (
        <>
            <button ref={myComponentRef} className={'submit-button'} onClick={onClick}>Следующий вопрос »</button>
        </>
    );
};

export default SubmitButton;
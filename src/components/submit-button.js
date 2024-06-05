import React, {useEffect, useRef} from 'react';

const SubmitButton = ({ onClick, text, isLoadingButton }) => {

    const myComponentRef = useRef(null);

    const scrollToComponent = () => {

        if (myComponentRef.current) {
            myComponentRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }
    };

    useEffect(()=> {
        scrollToComponent();
    },[])

    return (
        <>
            <button ref={myComponentRef} className={'submit-button'} onClick={onClick} disabled={isLoadingButton}>{isLoadingButton ? 'Загрузка...': text}</button>
        </>
    );
};

export default SubmitButton;
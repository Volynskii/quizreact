import React from 'react';
import styles from './styles.scss';

const SubmitButtonContainer = ({children}) => {
    return (
        <div className={'submitButtonContainer'}>
            {children}
        </div>
    );
};

export default SubmitButtonContainer;
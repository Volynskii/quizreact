import React from 'react';
import styles from './ErrorMessage.module.scss'; // Стили для сообщения об ошибке

const ErrorMessage = ({ message }) => {
    return (
        <div className={styles.error}>
            {message}
        </div>
    );
};



export default ErrorMessage;

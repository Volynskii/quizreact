import { useState } from 'react';
import axios from 'axios';

const useApiRequests = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const sendRequest = async (url, method = 'GET', data = null, headers = {
        'Content-Type': 'multipart/form-data'
    }) => {
        setIsLoading(true);
        setError(null);

        try {
            const config = {
                method: method,
                url: url,
                data: data,
                headers: headers // Добавленный параметр для передачи заголовков
            };

            const response = await axios(config);
            setIsLoading(false);
            return response.data;
        } catch (error) {
            setIsLoading(false);
            setError(error.response.data.message || 'Something went wrong');
            throw error;
        }
    };

    return { isLoading, error, sendRequest };
};

export default useApiRequests;

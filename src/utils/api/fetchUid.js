import axios from "axios";

const fetchUid = async () => {
    try {
        const url = 'http://quiz.imolchanov.dev.rfn.ru/?action=auth';
        const response = await axios.post(url);
        const quiz_uid = response.data.data.uid;
        // Устанавливаем куку
        return quiz_uid;

    } catch (error) {
        console.error('Error fetching data:', error);

    }
}

export default fetchUid;
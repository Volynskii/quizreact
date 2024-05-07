import axios from "axios";

const fetchCookie = async () => {
    try {
        const url = 'https://quiz.vgtrk.com/?action=auth';
        const response = await axios.post(url);
        const quiz_uid = response.data.data.uid;
        // Устанавливаем куку
        return quiz_uid;

    } catch (error) {
        console.error('Error fetching data:', error);

    }
}

export default fetchCookie;
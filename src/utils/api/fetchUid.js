import axios from "axios";
import { BASE_URL } from "../config";

const fetchUid = async () => {
    try {
        const url = `${BASE_URL}?action=auth`;
        const response = await axios.post(url);
        const quiz_uid = response.data.data.uid;
        // Устанавливаем куку
        return quiz_uid;

    } catch (error) {
        console.error('Error fetching data:', error);

    }
}

export default fetchUid;
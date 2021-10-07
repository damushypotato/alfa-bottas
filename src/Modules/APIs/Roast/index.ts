import { decode } from 'html-entities';
import axios from 'axios';

export async function GetRoast(): Promise<string> {
    const url = 'https://evilinsult.com/generate_insult.php?lang=en&type=text';

    const res = await axios.get(url, {
        method: 'GET',
        responseType: 'text',
    });

    return decode(res.data);
}

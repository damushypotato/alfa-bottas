import axios from 'axios';

export async function GetQuote(): Promise<string> {
    const res = await axios.get('https://inspirobot.me/api?generate=true', {
        responseType: 'text'
    });
    return res.data;
}

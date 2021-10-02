import fetch from 'node-fetch';
import { decode } from 'html-entities';

export async function GetRoast(): Promise<string> {
    const res = await fetch('https://evilinsult.com/generate_insult.php?lang=en&type=text');
    return decode(await res.text());
}

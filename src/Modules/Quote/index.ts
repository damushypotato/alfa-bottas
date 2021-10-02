import fetch from 'node-fetch';

export async function GetQuote(): Promise<string> {
    const res = await fetch('https://inspirobot.me/api?generate=true');
    return await res.text();
}

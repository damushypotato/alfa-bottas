import axios from 'axios';
import { SongData } from '../../../Types';

export async function GetLyrics(title: string): Promise<SongData | false> {
    try {
        const req = await axios.get(`lyrics?title=${title}&cancer=true`, {
            baseURL: 'https://some-random-api.ml',
            responseType: 'json',
        });
        return req.data as SongData;
    } catch {
        return false;
    }
}

import { WorldTimeAPI } from '.';

export namespace Timezones {
    export async function getTimezones(): Promise<string[] | false> {
        const tzs = await WorldTimeAPI('timezone');

        if (!tzs) return false;

        return tzs.data;
    }
}

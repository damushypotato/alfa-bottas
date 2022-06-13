import { Collection } from 'discord.js';
import { Schedule } from 'formula1.js';

export class F1_Cache {
    schedules: Collection<number, Schedule> = new Collection();

    async getSchedule_Cache(year: number): Promise<Schedule> {
        const data = await new Schedule(year).get();
        this.schedules.set(year, data);
        return data;
    }

    async fetchSchedule_Cached(year: number): Promise<Schedule> {
        return this.schedules.get(year) || (await this.getSchedule_Cache(year));
    }
}

export default class API_CacheManager {
    f1: F1_Cache = new F1_Cache();
}

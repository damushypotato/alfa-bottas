import { Collection } from 'discord.js';
import { ConstructorStandings, DriverStandings, Schedule } from 'formula1.js';

export class F1_Cache {
    schedules: Collection<number, Schedule> = new Collection();
    wdcs: Collection<number, DriverStandings> = new Collection();
    wccs: Collection<number, ConstructorStandings> = new Collection();

    async getSchedule_Cache(year: number): Promise<Schedule> {
        const data = await new Schedule(year).pop();
        this.schedules.set(year, data);
        return data;
    }

    async fetchSchedule_Cached(year: number): Promise<Schedule> {
        return this.schedules.get(year) || (await this.getSchedule_Cache(year));
    }

    async getWDC_Cache(
        year: number,
        round?: number,
        limit?: number
    ): Promise<DriverStandings> {
        const data = await new DriverStandings(year, round, limit).pop();
        this.wdcs.set(year, data);
        return data;
    }

    async fetchWDC_Cached(
        year: number,
        round?: number,
        limit?: number
    ): Promise<DriverStandings> {
        return (
            this.wdcs.get(year) || (await this.getWDC_Cache(year, round, limit))
        );
    }

    async getWCC_Cache(
        year: number,
        round: number,
        limit: number
    ): Promise<ConstructorStandings> {
        const data = await new ConstructorStandings(year, round, limit).pop();
        this.wccs.set(year, data);
        return data;
    }

    async fetchWCC_Cached(
        year: number,
        round?: number,
        limit?: number
    ): Promise<ConstructorStandings> {
        return (
            this.wccs.get(year) || (await this.getWCC_Cache(year, round, limit))
        );
    }
}

export default class API_CacheManager {
    f1: F1_Cache = new F1_Cache();
}

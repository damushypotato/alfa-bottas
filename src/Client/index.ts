import { Client, Collection } from 'discord.js';
import { clientIntents } from './intents';
import { connect as DB_Connect } from 'mongoose';
import { join as joinPath } from 'path';
import { readdirSync, existsSync } from 'fs';
import { Command, Event, Config, Secrets, API_Keys } from '../Interfaces';
import * as configJson from '../config.json';
import { config as envConfig } from 'dotenv';

const devPath = joinPath(__dirname, '..', '..', 'dev');
if (existsSync(devPath)) {
    envConfig({ path: joinPath(devPath, '.env'), });
}

const secrets: Secrets = {
    CLIENT_TOKEN: process.env.CLIENT_TOKEN as string,
    MONGO_URI: process.env.MONGO_URI as string,
    OWNER_ID: process.env.OWNER_ID as string,
    API_KEYS: JSON.parse(process.env.API_KEYS) as API_Keys,
};

class ExtendedClient extends Client {
    public constructor() {
        super({ intents: clientIntents })
    }

    public commands: Collection<string, Command> = new Collection();
    public events: Collection<string, Event> = new Collection();
    public config: Config = configJson;
    public secrets = secrets;

    public async init() {
        // Commands
        const commandPath = joinPath(__dirname, '..', 'Commands');
        readdirSync(commandPath).forEach(dir => {
            const dirPath = joinPath(commandPath, dir);

            const commands = readdirSync(dirPath).filter(file => file.startsWith('c.'));

            for (const file of commands) {
                const filePath = joinPath(dirPath, file)
                const { command } = require(filePath);
                this.commands.set(command.name, command);
            }
        })

        // Events
        const eventPath = joinPath(__dirname, '..', 'Events');
        readdirSync(eventPath).filter(file => file.startsWith('e.')).forEach(async file => {
            const filePath = joinPath(eventPath, file);
            const { event } = await import(filePath);
            this.events.set(event.name, event);
            if (event.once) {
                this.once(event.name, event.run.bind(null, this));
            } else {
                this.on(event.name, event.run.bind(null, this));
            }
        })

        console.log('Attempting connection to MongoDB DataBase...')
        try {
            await DB_Connect(this.secrets.MONGO_URI);
        }
        catch (e) {
            console.log('MongoDB DataBase connection error:', e)
        }
        console.log('Successfully connected to MongoDB DataBase.')

        // Login
        this.login(this.secrets.CLIENT_TOKEN);
    }
}

export default ExtendedClient;

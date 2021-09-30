import { Client, Intents, Collection } from 'discord.js';
import { connect as DB_Connect } from 'mongoose';
import path from 'path';
import fs from 'fs';
import { Command, Event, Config, Secrets } from '../Interfaces';
import configJson from '../config.json';
import { config as envConfig } from 'dotenv';

const devPath = path.join(__dirname, '..', '..', 'dev');
if (fs.existsSync(devPath)) {
    envConfig({ path: path.join(devPath, '.env'), });
}

const secrets: Secrets = {
    CLIENT_TOKEN: process.env.CLIENT_TOKEN,
    MONGO_URI: process.env.MONGO_URI,
    OWNER_ID: process.env.OWNER_ID,
    API_KEYS: null
};

class ExtendedClient extends Client {
    public constructor() {
        super({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_BANS, Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS, Intents.FLAGS.GUILD_INTEGRATIONS, Intents.FLAGS.GUILD_WEBHOOKS, Intents.FLAGS.GUILD_INVITES, Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILD_PRESENCES, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS, Intents.FLAGS.GUILD_MESSAGE_TYPING, Intents.FLAGS.DIRECT_MESSAGES, Intents.FLAGS.DIRECT_MESSAGE_REACTIONS, Intents.FLAGS.DIRECT_MESSAGE_TYPING] })
    }

    public commands: Collection<string, Command> = new Collection();
    public events: Collection<string, Event> = new Collection();
    public config: Config = configJson;
    public secrets: Secrets = secrets;

    public async init() {
        console.log('Attempting connection to MongoDB DataBase...')
        try {
            await DB_Connect(this.secrets.MONGO_URI);
        }
        catch (e) {
            console.log('MongoDB DataBase connection error:', e)
        }
        console.log('Successfully connected to MongoDB DataBase.')
        
        // Commands
        const commandPath = path.join(__dirname, '..', 'Commands');
        fs.readdirSync(commandPath).forEach(dir => {
            const dirPath = path.join(commandPath, dir);

            const commands = fs.readdirSync(dirPath).filter(file => file.endsWith('.ts'));

            for (const file of commands) {
                const filePath = path.join(dirPath, file)
                const { command } = require(filePath);
                this.commands.set(command.name, command);
            }
        })

        // Events
        const eventPath = path.join(__dirname, '..', 'Events');
        fs.readdirSync(eventPath).filter(file => file.endsWith('.ts')).forEach(async file => {
            const filePath = path.join(eventPath, file);
            const { event } = await import(filePath);
            this.events.set(event.name, event);
            if (event.once) {
                this.once(event.name, event.run.bind(null, this));
            } else {
                this.on(event.name, event.run.bind(null, this));
            }
        })

        // Login
        this.login(this.secrets.CLIENT_TOKEN);
    }
}

export default ExtendedClient;

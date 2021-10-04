import { Client, Collection } from 'discord.js';
import { clientIntents } from './intents';
import { connect as DB_Connect } from 'mongoose';
import { join as joinPath } from 'path';
import { readdirSync, existsSync } from 'fs';
import { Command, SlashCommand, Event, Config, Secrets, API_Keys } from '../Interfaces';
import * as configJson from '../config.json';
import { config as envConfig } from 'dotenv';
import Database from '../MongoDB';

const devPath = joinPath(__dirname, '..', '..', 'dev');
if (existsSync(devPath)) {
    envConfig({ path: joinPath(devPath, 'dev.env'), });
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
    public slashCommands: Collection<string, SlashCommand> = new Collection();
    public events: Collection<string, Event> = new Collection();
    public config: Config = configJson;
    public secrets = secrets;
    public database = new Database(this);

    public async init() {
        // Commands
        const commandPath = joinPath(__dirname, '..', 'Commands');
        readdirSync(commandPath).forEach(dir => {
            const dirPath = joinPath(commandPath, dir);

            const commands = readdirSync(dirPath).filter(file => file.startsWith('c.'));

            for (const file of commands) {
                const filePath = joinPath(dirPath, file)
                const command: Command = require(filePath).command;
                this.commands.set(command.name, command);
            }
        })

        // Slash Commands
        const slashPath = joinPath(__dirname, '..', 'SlashCommands');
        readdirSync(slashPath).forEach(dir => {
            const dirPath = joinPath(slashPath, dir);

            const slashCommands = readdirSync(dirPath).filter(file => file.startsWith('s.'));

            for (const file of slashCommands) {
                const filePath = joinPath(dirPath, file)
                const slashCommand: SlashCommand = require(filePath).slashCommand;
                if (['MESSAGE', 'USER'].includes(slashCommand.type)) delete slashCommand.description;
                this.slashCommands.set(slashCommand.name, slashCommand);
            }
        })
        this.once('ready', async () => {

            const slashCommandsArray = this.slashCommands.map(slashCommand => slashCommand);

            // Register for a single guild
            // await this.guilds.cache
            //     .get(process.env.DEV_GUILD_ID)
            //     .commands.set(slashCommandsArray);

            // Register for all the guilds the bot is in
            // await this.application.commands.set(slashCommandsArray);
        });

        // Events
        const eventPath = joinPath(__dirname, '..', 'Events');
        readdirSync(eventPath).filter(file => file.startsWith('e.')).forEach(async file => {
            const filePath = joinPath(eventPath, file);
            const event: Event = require(filePath).event;
            this.events.set(event.name, event);
            if (event.once) {
                this.once(event.name, event.run.bind(null, this));
            } else {
                this.on(event.name, event.run.bind(null, this));
            }
        })

        console.log('Attempting connection to MongoDB Database...')
        try {
            await DB_Connect(this.secrets.MONGO_URI);
        }
        catch (e) {
            console.log('MongoDB DataBase connection error:', e)
        }
        console.log('Successfully connected to MongoDB Database.')

        // Login
        this.login(this.secrets.CLIENT_TOKEN);
    }
}

export default ExtendedClient;

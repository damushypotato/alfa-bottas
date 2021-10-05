import { Client, Collection } from 'discord.js';
import { clientIntents } from './intents';
import { join as joinPath } from 'path';
import { readdirSync, existsSync } from 'fs';
import { Command, SlashCommand, Event, Config, Secrets, API_Keys, ClientServices } from '../Interfaces';
import * as configJson from '../config.json';
import { config as envConfig } from 'dotenv';
import Database from '../MongoDB';

const devPath = joinPath(__dirname, '..', '..', 'dev');
const dev = existsSync(devPath);
if (dev) {
    envConfig({ path: joinPath(devPath, 'dev.env'), });
}

class ExtendedClient extends Client {
    public constructor() {
        super({ intents: clientIntents })
    }

    public commands: Collection<string, Command> = new Collection();
    public slashCommands: Collection<string, SlashCommand> = new Collection();
    public events: Collection<string, Event> = new Collection();
    public config: Config = configJson;
    public secrets: Secrets = {
        CLIENT_TOKEN: process.env.CLIENT_TOKEN as string,
        MONGO_URI: process.env.MONGO_URI as string,
        OWNER_ID: process.env.OWNER_ID as string,
        API_KEYS: JSON.parse(process.env.API_KEYS) as API_Keys,
    };
    public services: ClientServices = {
        commands: true,
        slashCommands: true,
        snipe: true,
        editSnipe: true,
    };
    public database = new Database(this);
    public dev = dev;

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
            if (this.dev) {
                // Register for a single guild
                await this.registerAllSlashGuild(process.env.DEV_GUILD_ID);
            }
            else {
                // Register for all the guilds the bot is in
                await this.registerAllSlashGlobal();
            }
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

        // connect to database
        await this.database.connect();

        // Login
        this.login(this.secrets.CLIENT_TOKEN);
    }
    //slash commands
    public async registerAllSlashGuild(guildId: string) {
        await this.guilds.cache.get(guildId).commands.set(
            this.slashCommands.map(slashCommand => slashCommand)
        );
    }
    public async registerAllSlashGlobal() {
        await this.application.commands.set(
            this.slashCommands.map(slashCommand => slashCommand)
        );
    }
    public async unregisterAllSlashGuild(guildId: string) {
        await this.guilds.cache.get(guildId).commands.set([]);
    }
    public async unregisterAllSlashGlobal() {
        await this.application.commands.set([]);
    }
}

export default ExtendedClient;

import { Client, Collection } from 'discord.js';
import { clientIntents } from './intents';
import { join as joinPath } from 'path';
import { readdirSync, existsSync } from 'fs';
import {
    Event,
    Config,
    Secrets,
    API_Keys,
    ClientServices,
    ClientTools,
    Filter,
} from '../Structures/Interfaces';
import * as configJson from '../config.json';
import { config as envConfig } from 'dotenv';
import Database from '../Modules/Database';
import CustomEmojiManager from '../Modules/Emojis';
import Command from '../Modules/Command';
import { Mentions } from '../Modules/Tools';
import { DiscordTogether } from 'discord-together';
import * as glob from 'glob';
import { promisify } from 'util';

const globPromise = promisify(glob);

const devPath = joinPath(__dirname, '..', '..', 'dev');
const dev = existsSync(devPath);
if (dev) {
    envConfig({ path: joinPath(devPath, 'dev.env') });
}

class ExtendedClient extends Client {
    public constructor() {
        super({ intents: clientIntents });
    }

    public commands: Collection<string, Command> = new Collection();
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
    public customEmojis = new CustomEmojiManager(this);
    public dev = dev;
    public tools: ClientTools = {
        mentions: Mentions,
    };
    public discordTogether = new DiscordTogether(this);
    public filters: Collection<string, Filter> = new Collection();

    public async init() {
        console.log('Starting up client...\n');

        let time = Date.now();
        const initTime = time;
        // Commands
        console.log('Loading commands...');
        const commandPath = joinPath(__dirname, '..', 'Commands');
        readdirSync(commandPath).forEach(async (dir) => {
            const dirPath = joinPath(commandPath, dir);
            const commands = await globPromise(dirPath + '/*{.ts,.js}');

            for (const file of commands) {
                const command: Command = require(file).default;
                if (!command.textCommand && !command.slashCommand) {
                    throw new Error(
                        `Command '${command.name}' must have a valid textCommand or slashCommand property.`
                    );
                }
                command.category ||= dir;

                if (['MESSAGE', 'USER'].includes(command.slashCommand?.type))
                    delete command.description;

                this.commands.set(command.name, command);
            }
        });
        console.log(`Done! (${Date.now() - time}ms)\n`);

        time = Date.now();
        // Register Slash Commands
        console.log('Registering slash commands...');
        this.once('ready', async () => {
            if (this.dev) {
                // Register for a single guild
                await this.registerAllSlashGuild(process.env.DEV_GUILD_ID);
            } else {
                // Register for all the guilds the bot is in
                await this.registerAllSlashGlobal();
            }
        });
        console.log(`Done! (${Date.now() - time}ms)\n`);

        time = Date.now();
        // Events
        console.log('Loading events...');
        (await globPromise(`${__dirname}/../Events/*{.ts,.js}`)).forEach(
            async (file) => {
                const event: Event = require(file).event;
                this.events.set(event.name, event);
                if (event.once) {
                    this.once(event.name, event.run.bind(null, this));
                } else {
                    this.on(event.name, event.run.bind(null, this));
                }
            }
        );
        console.log(`Done! (${Date.now() - time}ms)\n`);

        time = Date.now();
        // Filters
        console.log('Loading filters...');
        (await globPromise(`${__dirname}/../Filters/*{.ts,.js}`)).forEach(
            async (file) => {
                const filter: Filter = require(file).filter;
                this.filters.set(filter.name, filter);
            }
        );
        console.log(`Done! (${Date.now() - time}ms)\n`);

        console.log(
            `Done initializing client. (Total ${Date.now() - initTime}ms)\n`
        );

        // connect to database
        await this.database.connect();

        // Login
        console.log(`Finally logging in... (Total ${Date.now() - initTime}ms)`);
        this.login(this.secrets.CLIENT_TOKEN);
    }

    public async getAllSlashCommands() {
        return this.commands
            .filter((c) => c.slashCommand != undefined)
            .map((c) => c.toApplicationCommand());
    }

    //slash commands
    public async registerAllSlashGuild(guildId: string) {
        await this.guilds.cache
            .get(guildId)
            .commands.set(await this.getAllSlashCommands());
    }
    public async registerAllSlashGlobal() {
        await this.application.commands.set(await this.getAllSlashCommands());
    }
    public async unregisterAllSlashGuild(guildId: string) {
        await this.guilds.cache.get(guildId).commands.set([]);
    }
    public async unregisterAllSlashGlobal() {
        await this.application.commands.set([]);
    }
}

export default ExtendedClient;

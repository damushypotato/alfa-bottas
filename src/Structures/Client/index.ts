import { Client as _client, Collection, MessageEmbed, MessageEmbedOptions } from 'discord.js';
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
    IBM,
} from '../../Types';
import * as configJson from '../../config.json';
import { config as envConfig } from 'dotenv';
import Database from '../Database';
import CustomEmojiManager from '../Emojis';
import Command from '../Command';
import { Mentions } from '../../Modules/Tools';
import * as glob from 'glob';
import { promisify } from 'util';
import { Player } from 'discord-player';
import API_CacheManager from '../API_Cache';

const globPromise = promisify(glob);

const devPath = joinPath(__dirname, '..', '..', '..', 'dev');
const dev = existsSync(devPath);
if (dev) {
    envConfig({ path: joinPath(devPath, 'dev.env') });
}

class Client extends _client {
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
        IBM: JSON.parse(process.env.IBM) as IBM,
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
    public dev: boolean = dev;
    public tools: ClientTools = {
        mentions: Mentions,
    };
    public filters: Collection<string, Filter> = new Collection();
    public player: Player = new Player(this, {
        ytdlOptions: {
            quality: 'highestaudio',
            highWaterMark: 1 << 25,
        },
    });
    public api_cache: API_CacheManager = new API_CacheManager();

    public async init() {
        console.log('Starting up client...\n');

        let time = Date.now();
        const initTime = time;
        // Commands
        console.log('Loading commands...');
        const commandPath = joinPath(__dirname, '..', '..', 'Commands');
        readdirSync(commandPath).forEach(async dir => {
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
        (await globPromise(`${__dirname}/../../Events/*{.ts,.js}`)).forEach(async file => {
            const event: Event = require(file).event;
            this.events.set(event.name, event);
            if (event.once) {
                this.once(event.name, event.run.bind(null, this));
            } else {
                this.on(event.name, event.run.bind(null, this));
            }
        });
        console.log(`Done! (${Date.now() - time}ms)\n`);

        time = Date.now();
        // Filters
        console.log('Loading filters...');
        (await globPromise(`${__dirname}/../../Filters/*{.ts,.js}`)).forEach(async file => {
            const filter: Filter = require(file).filter;
            this.filters.set(filter.name, filter);
        });
        console.log(`Done! (${Date.now() - time}ms)\n`);

        time = Date.now();
        //settings
        console.log('Loading settings...');

        this.player.on('channelEmpty', q => {
            console.log(11);
        });

        console.log(`Done! (${Date.now() - time}ms)\n`);

        console.log(`Done initializing client. (Total ${Date.now() - initTime}ms)\n`);

        // connect to database
        await this.database.connect();

        // Login
        console.log(
            `Finally logging in... (Total ${Date.now() - initTime}ms)\n${new Date().toTimeString()}`
        );
        this.login(this.secrets.CLIENT_TOKEN);
    }

    public async getAllSlashCommands() {
        return this.commands
            .filter(c => c.slashCommand != undefined)
            .map(c => c.toApplicationCommand());
    }

    //slash commands
    public async registerAllSlashGuild(guildId: string) {
        await this.guilds.cache.get(guildId).commands.set(await this.getAllSlashCommands());
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

    //utils
    public newEmbed(options: MessageEmbedOptions, footer?: boolean): MessageEmbed {
        options.color ||= this.config.color;
        if (footer) options.footer.text ||= this.config.embed_footer;
        return new MessageEmbed(options);
    }
    public fetchingEmbed(): MessageEmbed {
        return this.newEmbed({ title: 'Fetching...' });
    }
    public apiFailEmbed(): MessageEmbed {
        return this.newEmbed({ title: 'API Unavailable.' });
    }
}

export default Client;

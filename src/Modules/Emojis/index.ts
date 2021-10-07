import { Collection, Emoji } from 'discord.js';
import Client from '../../Client';

export default class CustomEmojiManager {
    constructor(client: Client) {
        this.client = client;

        this.client.once('ready', () => {
            this.setEmojis();
        });
    }

    private readonly emojiGuilds = [
        '895467902197719100'
    ];

    private client: Client;
    public emojis: Collection<string, Emoji> = new Collection();

    public get = (name: string) => this.emojis.get(name)?.toString() || '{emoji_not_found}';

    public setEmojis() {
        this.emojiGuilds.forEach(gId => {
            const guild = this.client.guilds.cache.get(gId);
            if (!guild) {
                return console.log(`Emoji guild ${gId} failed to get`);
            }
        
            guild.emojis.cache.forEach(e => {
                this.emojis.set(e.name, e)
            });
        })
    }
}

import {
    ApplicationCommandOptionData,
    ApplicationCommandType,
    AutocompleteInteraction,
} from 'discord.js';
import { CommandContext } from '..';
import Client from '../../Client';

export class SlashCommand {
    type: ApplicationCommandType;
    // options?: ApplicationCommandOptionData[];
    ephemeralDefer?: (ctx: CommandContext) => Promise<boolean>;
    autocomplete?: (client: Client, interaction: AutocompleteInteraction) => Promise<unknown>;
}

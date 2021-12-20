import { ApplicationCommandType, ApplicationCommandOptionData, CommandInteractionOptionResolver, CommandInteraction } from 'discord.js';
import Client from '../../Client';
import { SlashCommand_Data } from '.';

interface Run {
    (
        client: Client,
        interaction: CommandInteraction,
        options: Omit<CommandInteractionOptionResolver, 'getMessage' | 'getFocused'>,
        data: SlashCommand_Data
    ): void;
}

export interface SlashCommand {
    type: ApplicationCommandType;
    options?: ApplicationCommandOptionData[];
    run: Run;
}

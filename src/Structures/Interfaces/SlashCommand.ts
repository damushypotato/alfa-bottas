import {
    ApplicationCommandType,
    ApplicationCommandOptionData,
    CommandInteractionOptionResolver,
    CommandInteraction,
} from 'discord.js';
import Client from '../../Client';
import { SlashCommand_Data } from '.';

interface Run {
    (
        client: Client,
        interaction: CommandInteraction,
        options: Omit<
            CommandInteractionOptionResolver,
            'getMessage' | 'getFocused'
        >,
        data: SlashCommand_Data
    ): Promise<any>;
}

interface EphemeralDefer {
    (client: Client, interaction: CommandInteraction): Promise<boolean>;
}

export interface SlashCommand {
    type: ApplicationCommandType;
    options?: ApplicationCommandOptionData[];
    ephemeralDefer?: EphemeralDefer;
    run: Run;
}

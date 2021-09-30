import { Command } from '.';
import { UserDoc, GuildDoc, MemberDoc } from '../Types/Database';

export interface Command_Data {
    userDB: UserDoc;
    guildDB: GuildDoc;
    memberDB: MemberDoc;
    command: Command;
    prefix: string;
}

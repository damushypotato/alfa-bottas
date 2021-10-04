import { UserDoc, GuildDoc, MemberDoc } from '../Types/Database';

export interface SlashCommand_Data {
    userDB: UserDoc;
    guildDB: GuildDoc;
    memberDB: MemberDoc;
}

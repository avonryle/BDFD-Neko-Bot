import { Column } from "dbdts.db";
import { AppealData } from "./AppealData";
import { ChannelData } from "./ChannelData";
import { GiveawayData } from "./GiveawayData";
import { GuildSettingsData } from "./GuildSettingsData";
import { NicknameRequestData } from "./NicknameRequestData";
import { SystemMemberData } from "./SystemMemberData";

export interface DatabaseInterface {
    systems: Record<keyof SystemMemberData, Column>
    guilds: Record<keyof GuildSettingsData, Column>
    nicknames: Record<keyof NicknameRequestData, Column>
    channels: Record<keyof ChannelData, Column>
    appeals: Record<keyof AppealData, Column>
    giveaways: Record<keyof GiveawayData, Column>
}
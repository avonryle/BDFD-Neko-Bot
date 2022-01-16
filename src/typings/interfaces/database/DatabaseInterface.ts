import { Column } from "dbdts.db";
import { AppealData } from "./AppealData";
import { GiveawayData } from "./GiveawayData";
import { GuildSettingsData } from "./GuildSettingsData";
import { NicknameRequestData } from "./NicknameRequestData";
import { ScamLinkData } from "./ScamLinkData";

export interface DatabaseInterface {
    links: Record<keyof ScamLinkData, Column>
    guilds: Record<keyof GuildSettingsData, Column>
    nicknames: Record<keyof NicknameRequestData, Column>
    appeals: Record<keyof AppealData, Column>
    giveaways: Record<keyof GiveawayData, Column>
}
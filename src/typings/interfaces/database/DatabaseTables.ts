import { AppealData } from "./AppealData";
import { ChannelData } from "./ChannelData";
import { GiveawayData } from "./GiveawayData";
import { GuildSettingsData } from "./GuildSettingsData";
import { NicknameRequestData } from "./NicknameRequestData";
import { SystemMemberData } from "./SystemMemberData";

export interface DatabaseTables {
    guilds: GuildSettingsData
    channels: ChannelData
    systems: SystemMemberData
    nicknames: NicknameRequestData
    appeals: AppealData
    giveaways: GiveawayData
}
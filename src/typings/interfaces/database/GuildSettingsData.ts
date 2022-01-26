import { Option } from "../../types/Option"

export interface GuildSettingsData {
    detect_scam_links: boolean
    pin_message_id: Option<string>
    sticky_message_channel_id: Option<string>
    guild_id: string
    scam_links_log_channel_id: Option<string>
}
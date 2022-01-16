import { Option } from "../../types/Option"

export interface GuildSettingsData {
    detect_scam_links: boolean
    guild_id: string
    scam_links_log_channel_id: Option<string>
}
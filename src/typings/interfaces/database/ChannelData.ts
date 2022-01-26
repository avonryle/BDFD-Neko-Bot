import { Option } from "../../types/Option";

export interface ChannelData {
    webhook_url: Option<string>
    channel_id: string
    old_pin_message_id: Option<string>
}
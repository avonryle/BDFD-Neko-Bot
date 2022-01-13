import { ClientEvents } from "discord.js";
import { DiscordEvent } from "../typings/types/DiscordEvent";

export default function<K extends keyof ClientEvents>(event: K, listener: DiscordEvent<K>): DiscordEvent<K> {
    return listener
}
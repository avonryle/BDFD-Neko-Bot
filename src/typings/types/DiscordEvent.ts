import { ClientEvents } from "discord.js";
import { NekoClient } from "../../core/NekoClient";
import { Async } from "./Async";

export type DiscordEvent<T extends keyof ClientEvents = keyof ClientEvents> = (this: NekoClient, ...args: ClientEvents[T]) => Async<void> 
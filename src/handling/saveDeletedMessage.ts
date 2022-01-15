import { Message } from "discord.js";
import { NekoClient } from "../core/NekoClient";

export default function(client: NekoClient, message: Message<boolean>) {
    if (message.partial) return;

    if (message.author.bot) return;

    client.manager.snipes.set(message.channel.id, message as Message<true>)
}
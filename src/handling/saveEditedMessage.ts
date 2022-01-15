import { Message } from "discord.js";
import { NekoClient } from "../core/NekoClient";

export default function(client: NekoClient, oldm: Message<boolean>, message: Message<boolean>) {
    if (oldm.partial) return;

    if (!oldm.author || oldm.author.bot) return;

    if (message.content === oldm.content) return;

    client.manager.esnipes.set(message.channel.id, oldm as Message<true>)
}
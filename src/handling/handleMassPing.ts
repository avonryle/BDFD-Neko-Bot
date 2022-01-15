import { Message } from "discord.js";
import noop from "../functions/noop";

export default async function(message: Message) {
    if (!message.guild) return;

    if (message.mentions.users.size < 20) return;

    if (message.member!.permissions.has('ADMINISTRATOR')) return;

    const m = await message.reply(`Do that again and you're getting banned.`).catch(noop)

    if (!m) return;

    const collected = await m.channel.awaitMessages({
        filter: m => m.author.id === message.author.id,
        max: 1,
        time: 30_000,
        errors: [ 'time' ]
    })
    .catch(noop)

    if (!collected || collected.first()!.mentions.users.size < 20) return;

    const ban = await message.guild!.bans.create(message.author.id, {
        reason: 'Raiding (Mass Pinging)'
    }).catch(noop)

    if (!ban) return message.channel.send(`I could not ban the user.`)

    message.channel.send(`${message.author.tag} has been banned for mass mentioning.`)
}
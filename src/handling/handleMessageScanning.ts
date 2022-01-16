import axios from "axios";
import { Message } from "discord.js";
import { NekoClient } from "../core/NekoClient";
import noop from "../functions/noop";
import { ScamLinkType } from "../typings/enums/http/ScamLinkType";
import { ScamLinkRequest } from "../typings/interfaces/http/ScamLinkRequest";

export default async function(client: NekoClient, message: Message) {
    if (message.channel.type === 'DM' || !message.guild) return;

    if (message.member?.permissions.has('ADMINISTRATOR')) return;

    if (message.author.bot) return;

    const settings = client.manager.guildSettings(message.guild.id)

    if (!settings.detect_scam_links) return;

    const review = await axios.get<ScamLinkRequest>(`https://spen.tk/api/scams/isScam?q=${encodeURIComponent(message.content)}`).catch(noop)

    if (!review || !review.data?.result) return;

    message.delete().catch(noop)

    const channel = message.guild.channels.cache.get(settings.scam_links_log_channel_id!)

    if (!channel || channel.isVoice() || channel.isThread() || !channel.isText()) return;

    const embed = client.embed(message.member!, 'RED')
    .setTitle(`Suspicious Message`)
    .setDescription(message.content)
    .addField(`Severity`, `${review.data.result} (${ScamLinkType[review.data.result]})`)
    .addField(`Found at`, `#${message.channel.name} [${message.channel}]`)
    .setFooter({
        text: message.author.id
    })

    if (review.data.linkFound) embed.addField(`Scam Link`, review.data.linkFound)

    channel.send({
        embeds: [
            embed 
        ]
    })
    .catch(noop)
}
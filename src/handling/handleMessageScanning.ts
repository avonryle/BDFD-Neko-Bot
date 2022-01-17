import axios from "axios";
import chalk from "chalk";
import { Message } from "discord.js";
import { NekoClient } from "../core/NekoClient";
import cast from "../functions/cast";
import extractLinks from "../functions/extractLinks";
import noop from "../functions/noop";
import { ScamLinkType } from "../typings/enums/ScamLinkType";
import { ScamLinkRequest } from "../typings/interfaces/http/ScamLinkRequest";

export default async function(client: NekoClient, message: Message) {
    if (message.channel.type === 'DM' || !message.guild) return;

    if (message.author.bot) return;

    const settings = client.manager.guildSettings(message.guild.id)

    if (!settings.detect_scam_links) return;

    const links = extractLinks(message.content)

    if (!links.length) return;

    const review = await axios.get<ScamLinkRequest>(`https://spen.tk/api/scams/isScam?q=${encodeURIComponent(links.map(c => c.url).join(' '))}`).catch(noop)

    if (!review || !review.data?.result) {
        return;
    };
    
    if (review.data.linkFound) console.log(`${chalk.red.bold(`[SCAM DOMAIN]`)} => Identified scam link: ${chalk.yellow.bold(review.data.linkFound)}.`)

    message.delete().catch(noop)

    const channel = message.guild.channels.cache.get(settings.scam_links_log_channel_id!)

    if (!channel || channel.isVoice() || channel.isThread() || !channel.isText()) return;

    const embed = client.embed(message.member!, 'RED')
    .setTitle(`Suspicious Message`)
    .setDescription(message.content)
    .addField(`Found at`, `#${message.channel.name} [${message.channel}]`)
    .addField(`Severity`, `${review.data.result} (${ScamLinkType[review.data.result]})`)
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
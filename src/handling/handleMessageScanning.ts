import axios from "axios";
import chalk from "chalk";
import { Message } from "discord.js";
import { NekoClient } from "../core/NekoClient";
import cast from "../functions/cast";
import extractLinks from "../functions/extractLinks";
import noop from "../functions/noop";
import sendScamDetectionEmbed from "../functions/sendScamDetectionEmbed";
import { ScamLinkType } from "../typings/enums/ScamLinkType";
import { ScamLinkRequest } from "../typings/interfaces/http/ScamLinkRequest";

export default async function(client: NekoClient, message: Message) {
    if (message.channel.type === 'DM' || !message.guild) return;

    if (message.author.bot) return;

    const settings = client.manager.guildSettings(message.guild.id)

    if (!settings.detect_scam_links) return;

    const links = extractLinks(message.content)

    if (!links.length) return;

    const found = links.find(c => client.manager.scamDomains.has(c.domain))
    
    if (found) {
        console.log(`${chalk.red.bold(`[SCAM DOMAIN]`)} => Identified already found scam domain: ${chalk.yellow.bold(found.domain)}.`)
        sendScamDetectionEmbed(client, message, settings, {
            linkFound: found.domain,
            status: 200,
            result: ScamLinkType.SCAM_LINK
        })
        return;
    }

    const review = await axios.get<ScamLinkRequest>(`https://spen.tk/api/scams/isScam?q=${encodeURIComponent(links.map(c => c.url).join(' '))}`).catch(noop)

    if (!review || !review.data?.result) {
        return;
    };
    
    if (review.data.linkFound) {
        client.manager.scamDomains.add(review.data.linkFound)
        console.log(`${chalk.red.bold(`[SCAM DOMAIN]`)} => Identified scam domain: ${chalk.yellow.bold(review.data.linkFound)}.`)
    }

    message.delete().catch(noop)

    sendScamDetectionEmbed(client, message, settings, review.data)
}
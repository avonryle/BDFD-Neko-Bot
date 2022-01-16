import axios from "axios";
import chalk from "chalk";
import { Message } from "discord.js";
import { NekoClient } from "../core/NekoClient";
import cast from "../functions/cast";
import extractLinks from "../functions/extractLinks";
import noop from "../functions/noop";

export default async function(client: NekoClient, message: Message) {
    if (message.channel.type === 'DM' || !message.guild) return;

    if (message.author.bot) return;

    const settings = client.manager.guildSettings(message.guild.id)

    if (!settings.detect_scam_links) return;

    const links = extractLinks(message.content)

    if (!links.length) return;

    for (let i = 0, len = links.length;i < len;i++) {
        const {
            domain,
            url
        } = links[i]

        const review = await axios.get(``).catch(noop)

        if (!review || !review.data) {
            break
        };
        
        console.log(`${chalk.red.bold(`[SCAM DOMAIN]`)} => Identified new scam domain: ${chalk.yellow.bold(domain)}.`)
    
        message.delete().catch(noop)
    
        const channel = message.guild.channels.cache.get(settings.scam_links_log_channel_id!)
    
        if (!channel || channel.isVoice() || channel.isThread() || !channel.isText()) return;
    
        const embed = client.embed(message.member!, 'RED')
        .setTitle(`Suspicious Message`)
        .setDescription(message.content)
        .addField(`Found at`, `#${message.channel.name} [${message.channel}]`)
        .setFooter({
            text: message.author.id
        })
        .addField(`Scam Link`, url)
    
        channel.send({
            embeds: [
                embed 
            ]
        })
        .catch(noop)
        }
}
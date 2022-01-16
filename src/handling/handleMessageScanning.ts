import axios from "axios";
import chalk from "chalk";
import { Message } from "discord.js";
import { NekoClient } from "../core/NekoClient";
import cast from "../functions/cast";
import extractLinks from "../functions/extractLinks";
import isScamLink from "../functions/isScamLink";
import noop from "../functions/noop";
import { ScamLinkData } from "../typings/interfaces/database/ScamLinkData";
import { ScanRequest } from "../typings/interfaces/http/ScanRequest";

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

        const existing = client.manager.scamLink(domain)
        
        if (existing) {
            if (!existing.is_scam) {
                continue
            } else {
                console.log(`${chalk.red.bold(`[SCAM DOMAIN]`)} => Identified an already existing scam domain: ${chalk.yellow.bold(domain)}.`)
                
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
            
                return void channel.send({
                    embeds: [
                        embed 
                    ]
                })
                .catch(noop)
            }
        }

        const review = await axios.get<ScanRequest>(`https://ipqualityscore.com/api/json/url/${client.config.keys[0]}/${encodeURIComponent(url)}`).catch(noop)

        if (!review || !review.data) {
            break
        };

        const data: ScamLinkData = {
            is_scam: isScamLink(review.data),
            domain
        }
    
        client.manager.scamLinks.set(data.domain, data)
        client.db.upsert("links", cast(data), {
            column: 'url',
            equals: domain
        })

        if (!data.is_scam) {
            continue
        }
        
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
import { Message, TextChannel } from "discord.js";
import { NekoClient } from "../core/NekoClient";
import { ScamLinkType } from "../typings/enums/ScamLinkType";
import { GuildSettingsData } from "../typings/interfaces/database/GuildSettingsData";
import { ScamLinkRequest } from "../typings/interfaces/http/ScamLinkRequest";
import noop from "./noop";

export default function(client: NekoClient, message: Message, settings: GuildSettingsData, review: ScamLinkRequest) {
    const channel = message.guild!.channels.cache.get(settings.scam_links_log_channel_id!) 

    if (!channel || channel.isVoice() || channel.isThread() || !channel.isText()) return;

    const embed = client.embed(message.member!, 'RED')
    .setTitle(`Suspicious Message`)
    .setDescription(message.content)
    .addField(`Found at`, `#${(message.channel as TextChannel).name} [${message.channel}]`)
    .addField(`Severity`, `${review.result} (${ScamLinkType[review.result]})`)
    .setFooter({
        text: message.author.id
    })
    
    if (review.linkFound) embed.addField(`Scam Domain`, review.linkFound)

    channel.send({
        embeds: [
            embed 
        ]
    })
    .catch(noop)
}
import { ColorResolvable, MessageEmbed } from "discord.js";
import { SystemMemberRequest } from "../typings/interfaces/http/SystemMemberRequest";

export default function(member: SystemMemberRequest, page?: number, pages?: number): MessageEmbed {
    const embed = new MessageEmbed()
    
    if (member.avatar_url) {
        embed.setThumbnail(member.avatar_url)
    }

    embed.setColor(member.color as ColorResolvable ?? 'RANDOM')

    embed.setAuthor({
        name: member.name
    })

    if (member.display_name) {
        embed.addField(`Display Name`, member.display_name)
    }

    if (member.proxy_tags?.length) {
        embed.addField(`Proxy Tags`, member.proxy_tags.map(c => `${c.prefix}${c.suffix ? ` (${c.suffix})` : ''}`).join('\n'))
    }

    if (member.birthday) {
        embed.addField(`Birthday`, member.birthday)
    }

    if (member.pronouns) {
        embed.addField(`Pronouns`, member.pronouns)
    }

    if (member.description) {
        embed.addField(`Description`, member.description)
    }

    if (member.banner) {
        embed.setImage(member.banner)
    }

    embed.setFooter({
        text: `${page && pages ? `Page ${page} / ${pages} | ` : ''}ID: ${member.id} | UUID: ${member.uuid} | Created at`
    })


    if (member.created) {
        embed.setTimestamp(new Date(member.created))
    }

    return embed
}
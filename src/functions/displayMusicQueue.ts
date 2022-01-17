import { MessageActionRow, MessageButton, MessageEmbed, User } from "discord.js";
import { NekoClient } from "../core/NekoClient";
import { LavalinkGuild } from "../structures/LavalinkGuild";
import displaySystemMembers from "./displaySystemMembers";
import pageCountFor from "./pageCountFor";

export default function(client: NekoClient, user: User, guild: LavalinkGuild, page: number): ReturnType<typeof displaySystemMembers> {
    const queue = guild.queue.slice(guild.current)

    const pages = pageCountFor(10, queue.length) || 1

    const embed = client.embed(user, 'GREEN')
    .setTitle(`Music Queue`)
    .setDescription(
        queue.slice(page * 10 - 10, page * 10).map(
            (x, y) => `\`${y + page * 10 - 10 + 1}.-\` [${x.title}](${x.url})`
        ).join('\n') || 'No tracks found.'
    )
    .setFooter({
        text: `Page ${page} / ${pages}`
    })
    .setTimestamp()

    const row = new MessageActionRow()
    .addComponents(
        new MessageButton()
        .setLabel(`Back`)
        .setDisabled(page === 1)
        .setCustomId(`queue_back_${page}_${user.id}`)
        .setStyle('PRIMARY'),
        new MessageButton()
        .setLabel(`Next`)
        .setDisabled(page === pages)
        .setCustomId(`queue_next_${page}_${user.id}`)
        .setStyle('PRIMARY')
    )

    return {
        embeds: [
            embed
        ],
        components: [
            row 
        ]
    }
}
import { ColorResolvable, MessageActionRow, MessageButton, MessageEmbed, User } from "discord.js";
import { NekoClient } from "../core/NekoClient";
import { SystemMemberRequest } from "../typings/interfaces/http/SystemMemberRequest";
import displaySystemMember from "./displaySystemMember";
import pageCountFor from "./pageCountFor";

export default function(client: NekoClient, user: User, members: SystemMemberRequest[], target: string, page = 1): {
    embeds: MessageEmbed[]
    components: MessageActionRow[]
} {
    const pages = pageCountFor(5, members.length)

    const embeds = new Array<MessageEmbed>()

    const components = new Array<MessageActionRow>()

    for (const member of members.sort().slice(page * 5 - 5, page * 5)) {
        embeds.push(
            displaySystemMember(member, page, pages)
        )
    }

    components.push(
        new MessageActionRow()
        .addComponents(
            new MessageButton()
            .setLabel(`Back`)
            .setCustomId(`system_back_${page}_${user.id}_${target}`)
            .setStyle(`PRIMARY`)
            .setDisabled(page === 1),
            new MessageButton()
            .setLabel(`Next`)
            .setStyle('PRIMARY')
            .setCustomId(`system_next_${page}_${user.id}_${target}`)
            .setDisabled(page === pages)
        )
    )

    return {
        embeds,
        components
    }
}
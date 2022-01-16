import { Collection, GuildBasedChannel, GuildChannel, GuildMember, Message, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu, Role, SelectMenuInteraction, User } from "discord.js";
import { Option } from "../typings/types/Option";
import noop from "./noop";

/**
 * Creates a selector, returns undefined where there are no options, null if the user didn't reply.
 * @param message The message to use.
 * @param options The options for the selector.
 * @param time Max time to reply.
 * @param limit The limit of embeds.
 */
export default async function<
    T extends Role | GuildBasedChannel  | GuildMember | User
>(
    message: Message,
    options?: Option<Array<T> | T | Collection<string, T>>,
    time = 15_000,
    limit = 10
): Promise<Option<undefined | T>> {
    if (!options) return undefined

    const arr = options instanceof Collection ? Array.from(options.values()) : options

    if (!Array.isArray(arr)) return arr 

    if (!arr.length) return undefined

    if (arr.length === 1) return arr[0]
    
    const embeds = new Array<MessageEmbed>()

    const menu = new MessageSelectMenu()
    .setMaxValues(1)
    .setPlaceholder(`Pick an option`)
    .setMinValues(1)
    .setCustomId(`selector_${message.author.id}`)

    for (let i = 0, len = arr.length;i < len;i++) {
        const item = arr[i]

        const embed = new MessageEmbed()

        if (item instanceof Role) {
            embed.setColor(item.hexColor)
            .setAuthor({
                name: item.name,
                iconURL: item.iconURL() ?? undefined
            })

            menu.addOptions(
                [
                    {
                        label: item.name,
                        value: i.toString()
                    }
                ]
            )

        } else if (item instanceof GuildChannel) {
            embed.setColor('RANDOM')
            .setAuthor({
                name: item.name
            })

            menu.addOptions(
                [
                    {
                        label: item.name,
                        value: i.toString()
                    }
                ]
            )
        } else if (item instanceof GuildMember) {
            embed.setColor(item.displayColor || 'RANDOM')
            .setAuthor({
                name: item.user.tag,
                iconURL: item.displayAvatarURL({ dynamic: true })
            })

            menu.addOptions(
                [
                    {
                        label: item.user.tag,
                        value: i.toString()
                    }
                ]
            )
        } else if (item instanceof User) {
            embed.setColor('RANDOM')
            .setAuthor({
                name: item.tag,
                iconURL: item.displayAvatarURL({ dynamic: true })
            })

            menu.addOptions(
                [
                    {
                        label: item.tag,
                        value: i.toString()
                    }
                ]
            )
        }
        
        embeds.push(embed)
    }

    const rows = [
        new MessageActionRow()
        .addComponents(menu),
        new MessageActionRow()
        .addComponents(
            new MessageButton()
            .setCustomId(`selector_cancel_${message.author.id}`)
            .setLabel(`Cancel`)
            .setStyle('DANGER')
        )
    ]

    const m = await message.channel.send({
        embeds,
        components: rows
    })
    .catch(noop)

    if (!m) return null

    const selected = await m.awaitMessageComponent({
        filter: i => i.user.id === message.author.id,
        time
    })
    .catch(noop)

    if (!selected) {
        m.edit({
            embeds: [],
            components: [],
            content: `Selector timed out.`
        })
        .catch(noop)
        return null
    }

    if (selected instanceof MessageButton) {
        m.edit({
            embeds: [],
            components: [],
            content: `Selector has been cancelled.`
        })
        .catch(noop)
        return null
    }

    m.delete()
    .catch(noop)

    return arr[Number((selected as SelectMenuInteraction).values[0])]
}
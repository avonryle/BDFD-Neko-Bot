import { MessageActionRow, MessageButton, MessageEmbed } from "discord.js";
import removeScripts from "../../functions/removeScripts";
import { toPlural } from "../../functions/toPlural";
import toTitleCase from "../../functions/toTitleCase";
import { Command } from "../../structures/Command";

export default new Command<[
    string | null
]>({
    name: 'help',
    args: [
        {
            name: 'command',
            type: 'STRING'
        }
    ],
    description: 'displays all commands.',
    execute: async function(message, [ name ], extras) {
        if (name) {
            const command = this.manager.commands.get(name) ?? this.manager.commands.find(
                c => c.data.name === name || removeScripts(c.data.name) === removeScripts(name) || (
                    c.data.aliases ? c.data.aliases.some(
                        alias => alias === name || removeScripts(alias) === removeScripts(name)
                    ) : false
                )
            )

            if (!command) return void message.channel.send({
                embeds: [
                    this.embed(message.member!, 'RED')
                    .setTitle(`Unknown Command`)
                    .setDescription(`Could not find any command with given input.`)
                ]
            })

            const embed = new MessageEmbed()
            .setColor('BLUE')
            .setAuthor({
                name: message.author.tag,
                iconURL: message.member!.displayAvatarURL({
                    dynamic: true
                })
            })
            .setTimestamp()
            .setTitle(`Command Info`)
            .addField(`Name`, command.data.name, true)
            .addField(`Category`, toTitleCase(command.data.category!), true)

            if (command.data.aliases?.length) embed.addField(`Aliases`, command.data.aliases.join(', '), true)

            embed.addField(`Description`, command.data.description, true)
            
            embed.addField(`Captures Arguments`, command.data.capturing ? `Yes` : 'No', true)
            .addField(`Owner Only`, command.data.owner ? `Yes` : 'No', true)
            .addField(`Only DM`, command.data.dmOnly ? 'Yes' : 'No', true)

            if (command.data.roles?.length) embed.addField(`Allowed Roles`, command.data.roles.map(c => `<@&${c}>`).join(', '), true)

            if (command.data.args?.length) {
                const usages = await command.usage(this, message, extras)
                embed.addField(`Command ${toPlural('Usage', usages.length)}`, `\`\`\`\n${usages.join('\n')}\`\`\``, true)
            }

            return void message.channel.send({
                embeds: [
                    embed
                ]
            });
        }

        const categories: Record<string, boolean> = {}

        for (const [, command] of this.manager.commands) {
            if (categories[command.data.category!] === true) {
                continue
            }

            const perms = await command.permissionsFor(this, message, false)

            if (!perms) {
                continue
            }

            categories[command.data.category!] = true
        }

        const rows = new Array<MessageActionRow>()

        for (const category of Object.keys(categories)) {
            if (!rows.length) rows.push(new MessageActionRow())
            else if (rows.at(-1)!.components.length === 5) {
                rows.push(new MessageActionRow())
            }

            const row = rows.at(-1)!
        
            row.addComponents(
                new MessageButton()
                .setCustomId(`help_${category}_${message.author.id}`)
                .setLabel(toTitleCase(category))
                .setStyle('SECONDARY')
            )
        }

        message.channel.send({
            components: rows,
            embeds: [
                this.embed(message.member!, 'BLUE')
                .setTitle(`Help Menu`)
                .setDescription(`Choose a category to view all it's commands.`)
            ]
        })
    }
})
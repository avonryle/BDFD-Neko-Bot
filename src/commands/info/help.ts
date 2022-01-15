import { MessageActionRow, MessageButton } from "discord.js";
import toTitleCase from "../../functions/toTitleCase";
import { Command } from "../../structures/Command";

export default new Command({
    name: 'help',
    description: 'displays all commands.',
    execute: async function(message) {
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
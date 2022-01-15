import { MessageActionRow, MessageButton } from "discord.js";
import cast from "../../functions/cast";
import createInteractionHandler from "../../functions/createInteractionHandler";
import toTitleCase from "../../functions/toTitleCase";
import { Command } from "../../structures/Command";
import { ArgData } from "../../typings/interfaces/ArgData";

export default createInteractionHandler("button", async function(i) {
    if (!i.customId.includes("help")) return; 

    if (!i.customId.includes(i.user.id)) {
        return i.reply({
            ephemeral: true,
            content: `You cannot use this button.`
        })
    }

    const [
        ,
        cat,
        id 
    ] = i.customId.split(/_/)

    const commands: Command[] = []

    const categories: Record<string, boolean> = {}

    for (const [, command] of this.manager.commands) {        
        const perms = await command.permissionsFor(this, i, false)

        if (!perms) {
            continue
        }

        if (!categories[command.data.category!]) categories[command.data.category!] = true

        if (cat === command.data.category) {
            commands.push(command)
        }
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
            .setCustomId(`help_${category}_${id}`)
            .setLabel(toTitleCase(category))
            .setDisabled(category === cat)
            .setStyle(cat === category ? 'SUCCESS' : 'SECONDARY')
        )
    }

    const contents = new Array<string>()

    for (let a = 0, len = commands.length;a < len;a++) {
        const command = commands[a]
    
        const args = new Array<ArgData>()

        for (let x = 0, len = command.data.args?.length ?? 0;x < len;x++) {
            const raw = command.data.args![x]
            args.push(typeof raw === 'function' ? await raw.call(this, cast(i)) : raw)
        }

        contents.push(`**${this.prefixes[0]}${command.data.name} ${args.map(c => c.required ? `<${c.name}>` : `[${c.name}]`).join(' ')}**`)
    }

    i.update({
        components: rows,
        embeds: [
            this.embed(i.member, 'BLUE')
            .setTitle(`${toTitleCase(cat)} Commands`)
            .setDescription(contents.join('\n'))
        ]
    })
})
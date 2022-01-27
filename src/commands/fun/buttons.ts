import { MessageActionRow, MessageButton } from "discord.js";
import { MessageButtonStyles } from "discord.js/typings/enums";
import { Command } from "../../structures/Command";

const STYLES = [
    "PRIMARY",
    "SECONDARY", 
    "SUCCESS",
    "DANGER"
] as const 

export default new Command({
    name: 'buttons',
    description: 'buttons yes',
    execute: async function(message) {
        let y = 0

        const rows = new Array<MessageActionRow>(5).fill(new MessageActionRow()).map(c => new MessageActionRow()).map(c => c.addComponents(
            new Array<MessageButton>(5).fill(new MessageButton()).map(d=> new MessageButton()).map(
                (x) => {
                    const st = STYLES[Math.floor(Math.random() * STYLES.length)];

                    return x.setCustomId(`rnd_button_WIN_${y++}_${message.author.id}`)
                    .setLabel(y.toString())
                    .setStyle(st)
            }
        )))

        const btn = rows[Math.floor(Math.random() * rows.length)].components[Math.floor(Math.random() * 5)];

        btn.setCustomId(btn.customId!.replace(`WIN`, 'FAIL'))

        message.channel.send({
            content: `24 safe buttons, 1 bomb.`,
            components: rows
        })
    }
})
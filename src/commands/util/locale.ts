import { MessageActionRow, MessageButton } from "discord.js";
import { Command } from "../../structures/Command";

export default new Command({
    name: 'locale',
    description: 'yes',
    execute: async function(m) {
        m.channel.send({
            content: `Click the button`,
            components: [
                new MessageActionRow()
                .addComponents(
                    new MessageButton()
                    .setLabel(`UwU`)
                    .setStyle('SUCCESS')
                    .setCustomId(`user_locale`)
                )
            ]
        })
    }
})
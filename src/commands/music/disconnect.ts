import noop from "../../functions/noop";
import { Command } from "../../structures/Command";

export default new Command({
    name: 'disconnect',
    aliases: [
        'dc'
    ],
    description: 'disconnects bot from voice channel',
    userInVoice: true,
    sameVoice: true,
    execute: async function(message) {
        const guild = this.manager.guild(message.guildId!)

        guild.destroy()

        message.react('✅')
        .catch(noop)
    }
})
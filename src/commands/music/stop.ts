import noop from "../../functions/noop";
import { Command } from "../../structures/Command";

export default new Command({
    name: 'stop',
    description: 'removes all songs from the queue',
    userInVoice: true,
    sameVoice: true,
    execute: async function(message) {
        const guild = this.manager.guild(message.guildId!)

        guild.queue = []
        guild.current = -1
        guild.player.stop()

        message.react('✅')
        .catch(noop)
    }
})
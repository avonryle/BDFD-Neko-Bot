import { Command } from "../../structures/Command";

export default new Command({
    name: 'stop',
    description: 'removes all songs from the queue',
    userInVoice: true,
    sameVoice: true,
    execute: async function(message) {
        const guild = this.manager.guild(message.guildId!)

        guild.queue = []
        guild.current = 0
        guild.player.stop()

        message.react('✅')
        .catch(noop)
    }
})

function noop(noop: any) {
    throw new Error("Function not implemented.");
}

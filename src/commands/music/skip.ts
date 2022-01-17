import noop from "../../functions/noop";
import { Command } from "../../structures/Command";
import { PlayerState } from "../../typings/enums/PlayerState";

export default new Command({
    name: 'skip',
    description: 'skips current song',
    states: [
        PlayerState.PLAYING,
        PlayerState.PAUSED
    ],
    sameVoice: true,
    userInVoice: true,
    execute: async function(message) {
        const guild = this.manager.guild(message.guildId!)

        guild.player.stop()

        message.react('✅')
        .catch(noop)
    }
})
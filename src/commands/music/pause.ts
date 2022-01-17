import noop from "../../functions/noop";
import { Command } from "../../structures/Command";
import { PlayerState } from "../../typings/enums/PlayerState";

export default new Command({
    name: 'pause',
    description: 'pauses current song',
    states: [
        PlayerState.PLAYING
    ],
    sameVoice: true,
    userInVoice: true,
    execute: async function(m) {
        const guild = this.manager.guild(m.guildId!)

        guild.player.pause(true)
        guild.state = PlayerState.PAUSED

        m.react('✅')
        .catch(noop)
    }
})
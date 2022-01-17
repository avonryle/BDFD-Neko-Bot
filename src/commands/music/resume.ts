import noop from "../../functions/noop";
import { Command } from "../../structures/Command";
import { PlayerState } from "../../typings/enums/PlayerState";

export default new Command({
    name: 'resume',
    description: 'resumes current song',
    states: [
        PlayerState.PAUSED
    ],
    sameVoice: true,
    userInVoice: true,
    execute: async function(m) {
        const guild = this.manager.guild(m.guildId!)

        guild.player.pause(false)
        guild.state = PlayerState.PLAYING

        m.react('✅')
        .catch(noop)
    }
})
import noop from "../../functions/noop";
import { Command } from "../../structures/Command";

export default new Command<[number]>({
    name: 'volume',
    description: 'changes volume of tracks',
    sameVoice: true,
    args: [
        {
            name: 'volume',
            min: 0,
            max: 200,
            type: 'NUMBER'
        }
    ],
    execute: async function(message, [ volume ]) {
        const guild = this.manager.guild(message.guildId!)

        guild.volume = volume
        guild.player.options.volume = volume
        if (guild.isPlaying()) {
            guild.player.setVolume(volume)
        }

        message.react('✅')
        .catch(noop)
    }
})
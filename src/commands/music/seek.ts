import noop from "../../functions/noop";
import { Command } from "../../structures/Command";
import { PlayerState } from "../../typings/enums/PlayerState";

export default new Command<[number]>({
    name: 'seek',
    description: 'seeks current playing track',
    sameVoice: true,
    args: [
        {
            name: 'position',
            min: 0,
            required: true,
            type: 'TIME'
        }
    ],
    states: [
        PlayerState.PLAYING
    ],
    execute: async function(message, [ pos ]) {
        const guild = this.manager.guild(message.guildId!)

        const track = guild.track!

        if (pos > track.duration) {
            return void message.channel.send({
                embeds: [
                    this.embed(message.member!, 'RED')
                    .setTitle(`Invalid Position`)
                    .setDescription(`New position must be in the range of the track.`)
                ]
            })
        }

        guild.player.seek(pos)

        message.react('✅')
        .catch(noop)
    }
})
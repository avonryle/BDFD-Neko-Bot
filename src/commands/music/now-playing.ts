import { User } from "discord.js";
import { Command } from "../../structures/Command";
import { PlayerState } from "../../typings/enums/PlayerState";

export default new Command({
    name: 'now-playing',
    botInVoice: true,
    states: [
        PlayerState.PAUSED,
        PlayerState.PLAYING
    ],
    description: 'shows info about current playing song',
    execute: async function(message) {
        const guild = this.manager.guild(message.guildId!)

        const track = guild.track!

        const embed = this.embed(message.member!, 'GREEN')
        .setTitle(track.title)
        .setURL(track.url)
        .setDescription(`${this.manager.parser.parseToString(guild.player.position, { limit: 2, and: true })} / ${this.manager.parser.parseToString(track.duration, { and: true, limit: 2 })}`)
        .setFooter({
            text: `Requested by ${(track.requester as User).tag}`
        })

        if (track.author) {
            embed.addField(`Author`, track.author)
        }
        
        const thumb = track.displayThumbnail('2048')

        if (thumb) embed.setThumbnail(thumb)

        message.channel.send({
            embeds: [
                embed 
            ]
        })
    }
})
import { LoadTypes, SearchPlatform } from "lavacoffee/dist/utils";
import cast from "../../functions/cast";
import createSelector from "../../functions/createSelector";
import { Command } from "../../structures/Command";
import SupportedPlatforms from "../../util/constants/SupportedPlatforms";

export default new Command<[
    string
], {
    src: typeof SupportedPlatforms[keyof typeof SupportedPlatforms]
}>({
    name: 'play',
    description: 'searches for a song and adds it to the queue.',
    sameVoice: true,
    args: [
        {
            name: 'song',
            required: true,
            type: 'STRING'
        }
    ],
    ignoreIfNoVoice: true,
    userInVoice: true,
    execute: async function(message, [ query ], extras) {
        const platform: SearchPlatform = extras.flags.src ?? 'yt'

        const guild = this.manager.guild(message.guildId!)
        
        if (!guild.player.options.voiceID) {
            guild.setVoiceID(message.member?.voice.channelId!)
            guild.join()
        }

        guild.channel = cast(message.channel)

        const res = await this.manager.lavalink.search({
            query,
            source: platform
        }, message.author)

        if (res.loadType === LoadTypes.LoadFailed || res.loadType === LoadTypes.NoMatches || !res.tracks.length) {
            return void message.channel.send({
                embeds: [
                    this.embed(message.member!, 'RED')
                    .setTitle(`Search Failed`)
                    .setDescription(`Could not find results for this search.`)
                ]
            })
        }

        let name = ''

        if (res.loadType === LoadTypes.SearchResult) {
            const selector = await createSelector(
                message,
                res.tracks,
                15_000,
                10
            )

            if (!selector) return;

            name = guild.add(selector)
        } else {
            name = guild.add(res)
        }

        const bool = guild.play()

        message.channel.send({
            embeds: [
                this.embed(message.member!, 'GREEN')
                .setTitle(`Tracks Added`)
                .setDescription(
                    `Successfully added ${name} to the queue.`
                )
            ]
        })
    }
})
import { Channel, GuildTextBasedChannel } from "discord.js";
import cast from "../../functions/cast";
import { Command } from "../../structures/Command";
import { Option } from "../../typings/types/Option";

export default new Command<[
    Option<GuildTextBasedChannel>
]>({
    name: 'set-scam-link-log-channel',
    description: 'sets channel where detector will send logs.',
    args: [
        {
            name: 'channel',
            type: 'CHANNEL',
            allow: [
                "none",
                "disable"
            ],
            required: true
        }
    ],
    permissions: [
        'MANAGE_GUILD'
    ],
    execute: async function(message, [ channel ]) {
        const settings = this.manager.guildSettings(message.guild?.id!)

        settings.scam_links_log_channel_id = channel?.id ?? null

        this.db.upsert("guilds", cast(settings), {
            column: 'guild_id',
            equals: settings.guild_id
        })

        message.channel.send({
            embeds: [
                this.embed(message.member!, 'GREEN')
                .setTitle(`Settings Updated`)
                .setDescription(
                    channel ? `Successfully set logging channel to ${channel}` : `Log channel for scam links has been disabled.`
                )
            ]
        })
    }
})
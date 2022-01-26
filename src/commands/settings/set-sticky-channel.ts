import { GuildTextBasedChannel } from "discord.js";
import cast from "../../functions/cast";
import { Command } from "../../structures/Command";

export default new Command<[
    GuildTextBasedChannel | null
]>({
    name: 'set-sticky-channel',
    description: 'sets sticky channel to resent new message',
    permissions: [
        "MANAGE_GUILD"
    ],
    args: [
        {
            name: 'channel',
            type: 'CHANNEL',
            allow: [
                "disable",
                "none"
            ],
            required: true
        }
    ],
    execute: async function(message, [ channel ], extras) {
        const data = this.manager.guildSettings(message.guild?.id!)

        if (!channel) {
            data.sticky_message_channel_id = null
            data.pin_message_id = null

            this.db.upsert("guilds", cast(data), {
                column: 'guild_id',
                equals: data.guild_id
            })

            return void message.channel.send({
                embeds: [
                    this.embed(message.member!, 'GREEN')
                    .setTitle(`Settings Updated`)
                    .setDescription(`Sticky channel has been disabled.`)
                ]
            });
        }

        if (!channel?.permissionsFor(message.author)?.has('VIEW_CHANNEL')) {
            return void message.channel.send({
                embeds: [
                    this.embed(message.member!, 'RED')
                    .setTitle(`Missing Permissions`)
                    .setDescription(`You need permission to view this channel.`)
                ]
            })
        }

        data.sticky_message_channel_id = channel.id

        this.db.upsert("guilds", data, {
            column: 'guild_id',
            equals: data.guild_id
        })

        message.channel.send({
            embeds: [
                this.embed(message.member!, 'GREEN')
                .setTitle(`Settings Updated`)
                .setDescription(`Sticky channel has been set to ${channel}`)
            ]
        })
    }
})
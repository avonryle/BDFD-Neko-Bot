import { GuildTextBasedChannel } from "discord.js";
import cast from "../../functions/cast";
import noop from "../../functions/noop";
import { Command } from "../../structures/Command";

export default new Command<[
    string
]>({
    name: 'set-sticky-message',
    description: 'sets sticky message to use as new message',
    permissions: [
        "MANAGE_GUILD"
    ],
    args: [
        {
            name: 'message ID',
            type: 'STRING',
            required: true
        }
    ],
    execute: async function(message, [ id ], extras) {
        const data = this.manager.guildSettings(message.guild?.id!)

        const channel = message.guild?.channels.cache.get(data.sticky_message_channel_id!) as GuildTextBasedChannel

        if (!channel) {
            return void message.channel.send({
                embeds: [
                    this.embed(message.member!, 'RED')
                    .setTitle(`Channel Not Found`)
                    .setDescription(`A sticky channel must be set to use this command.`)
                ]
            })
        }

        const msg = await channel.messages.fetch(id).catch(noop)

        if (!msg) {
            return void message.channel.send({
                embeds: [
                    this.embed(message.member!, 'RED')
                    .setTitle(`Unknown Message`)
                    .setDescription(`Make sure to provide a valid message ID`)
                ]
            })
        }

        data.pin_message_id = msg.id 

        this.db.upsert("guilds", cast(data), {
            column: 'guild_id',
            equals: data.guild_id
        })
        
        message.channel.send({
            embeds: [
                this.embed(message.member!, 'GREEN')
                .setTitle(`Settings Updated`)
                .setDescription(`Sticky message set to [this](${msg.url})`)
                .setFooter({
                    text: `Settings will be disabled if this message is deleted.`
                })
            ]
        })
    }
})
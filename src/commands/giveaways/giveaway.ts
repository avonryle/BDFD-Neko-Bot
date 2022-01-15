import { GuildBasedChannel, TextBasedChannel } from "discord.js";
import cast from "../../functions/cast";
import noop from "../../functions/noop";
import { Command } from "../../structures/Command";
import { Giveaway } from "../../structures/Giveaway";
import StaffRoles from "../../util/constants/StaffRoles";

export default new Command<[
    string,
    GuildBasedChannel,
    number,
    number
]>({
    name: 'giveaway',
    aliases: [
        'gw'
    ],
    description: 'creates a giveaway.',
    roles: [
        StaffRoles.MODERATOR,
        StaffRoles.ADMIN_TEST,
        StaffRoles.LEAD_STAFF
    ],
    args: [
        {
            name: 'title',
            required: true,
            type: 'STRING',
            example: "'cute shirt'"
        },
        {
            name: 'channel',
            required: true,
            type: 'CHANNEL'
        },
        {
            name: 'duration',
            required: true,
            type: 'TIME',
            min: 10000,
            max: 86_400_000 * 365
        },
        {
            name: 'winners',
            required: true,
            type: 'NUMBER',
            min: 1,
            max: 20
        }
    ],
    execute: async function(message, [ title, channel, duration, winners ]) {
        if (channel.isVoice() || channel.type === 'GUILD_CATEGORY') {
            return void message.channel.send({
                embeds: [
                    this.embed(message.member!, 'RED')
                    .setTitle(`Invalid Channel`)
                    .setDescription(`Given channel is not a text channel.`)
                ]
            })
        }

        const gw = new Giveaway(this, {
            message_id: null,
            guild_id: message.guild!.id,
            ended: false,
            ends_at: Date.now() + duration,
            winner_count: winners,
            channel_id: channel.id,
            participants: [],
            title,
            user_id: message.author.id
        })

        const m = await gw.start()

        if (!m) {
            return void message.channel.send({
                embeds: [
                    this.embed(message.member!, 'RED')
                    .setTitle(`Giveaway Failed`)
                    .setDescription(`Could not start giveaway.`)
                ]
            })
        }

        this.manager.giveaways.set(gw.data.message_id, gw)

        message.react('✅').catch(noop)
    }
})
import { GuildTextBasedChannel, Message, MessageEmbed } from "discord.js";
import { NekoClient } from "../core/NekoClient";
import cast from "../functions/cast";
import noop from "../functions/noop";

export default async function(client: NekoClient, message: Message) {
    if (!message.guild || message.author.bot) return;

    const data = client.manager.guildSettings(message.guild.id)

    if (!data.sticky_message_channel_id || !data.pin_message_id) return;

    const channel = message.guild.channels.cache.get(data.sticky_message_channel_id) as GuildTextBasedChannel

    if (!channel) return;

    if (message.channel.id !== data.sticky_message_channel_id) return;

    const msg = await channel.messages.fetch(data.pin_message_id).catch(noop)

    if (!msg) {
        data.pin_message_id = null
        client.db.upsert("guilds", cast(data), {
            column: 'guild_id',
            equals: message.guild.id
        })
        return;
    }

    const channelData = client.manager.channel(channel.id)

    const id = channelData.old_pin_message_id
    
    if (id) {
        await channel.messages.delete(id).catch(noop)
    }

    const m = await channel.send({
        embeds: [
            new MessageEmbed()
            .setTitle(`Sticky Message`)
            .setDescription(msg.content)
            .setTimestamp()
            .setColor('RANDOM')
        ]
    }).catch(noop)

    if (!m) {
        channelData.old_pin_message_id = null    
        client.db.upsert("channels", channelData, {
            column: 'channel_id',
            equals: channelData.channel_id
        })
        return 
    }

    channelData.old_pin_message_id = m.id

    client.db.upsert("channels", channelData, {
        column: 'channel_id',
        equals: channelData.channel_id
    })
}
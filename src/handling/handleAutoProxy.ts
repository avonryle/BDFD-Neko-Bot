import { Message, MessageMentionOptions, TextChannel } from "discord.js";
import { NekoClient } from "../core/NekoClient";
import cast from "../functions/cast";
import noop from "../functions/noop";
import StaffRoles from "../util/constants/StaffRoles";

export default async function(client: NekoClient, message: Message) {
    if (![
        StaffRoles.MODERATOR,
        StaffRoles.ADMIN_TEST,
        StaffRoles.LEAD_STAFF,
        StaffRoles.STAFF
    ].some(c => message.member?.roles.cache.has(c))) {
        return;
    }

    const data = client.manager.systemMember(message.author.id)

    if (!data.autosend) return;

    if (message.content.startsWith('\\')) {
        data.autosend = false
        client.db.upsert("systems", cast(data), {
            column: 'user_id',
            equals: message.author.id
        })
        return;
    }

    const fronter = await client.manager.getFrontingMember(message.author.id)
 
    if (!fronter) return null

    const webhook = await client.manager.getChannelWebhook(message.channel as TextChannel).catch(noop)

    if (!webhook) return;

    message.delete().catch(noop)

    webhook.send(
        {
            content: message.content,
            avatarURL: fronter.avatar_url ?? undefined,
            username: `${fronter.display_name ?? fronter.name} ${data.tag ?? ''}`,
            allowedMentions: {
                parse: []
            }
        }
    )
    .catch(() => {
        const data = client.manager.channel(message.channel.id)
        data.webhook_url = null
        client.db.upsert("channels", cast(data), {
            column: 'channel_id',
            equals: message.channel.id
        })
    })
}
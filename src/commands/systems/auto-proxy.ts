import cast from "../../functions/cast";
import { Command } from "../../structures/Command";
import StaffRoles from "../../util/constants/StaffRoles";

export default new Command({
    name: 'auto-proxy',
    description: 'enables or disables auto proxy.',
    roles: [
        StaffRoles.STAFF,
        StaffRoles.LEAD_STAFF,
        StaffRoles.ADMIN_TEST,
        StaffRoles.MODERATOR
    ],
    execute: async function(message) {
        const data = this.manager.systemMember(message.author.id)

        const old = data.autosend

        data.autosend = !data.autosend

        this.db.upsert("systems", cast(data), {
            column: 'user_id',
            equals: data.user_id
        })

        message.channel.send({
            embeds: [
                this.embed(message.member!, 'GREEN')
                .setTitle(`Settings Updated`)
                .setDescription(`Auto proxy is now ${old ? `disabled` : 'enabled'}.`)
                .setFooter({
                    text: `You can get off it by using a backslash at the start of a message or by using this command again.`
                })
            ]
        })
    }
})
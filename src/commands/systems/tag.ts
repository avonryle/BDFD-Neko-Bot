import cast from "../../functions/cast";
import { Command } from "../../structures/Command";
import StaffRoles from "../../util/constants/StaffRoles";

export default new Command<[
    string | null
]>({
    name: 'tag',
    description: 'sets tag for auto proxy.',
    roles: [
        StaffRoles.STAFF,
        StaffRoles.LEAD_STAFF,
        StaffRoles.ADMIN_TEST,
        StaffRoles.MODERATOR
    ],
    args: [
        {
            name: 'smth',
            type: 'STRING',
            required: true,
            min: 1,
            max: 16,
            allow: [
                "none"
            ]
        }
    ],
    execute: async function(message, [ tag ]) {
        const data = this.manager.systemMember(message.author.id)

        data.tag = tag

        this.db.upsert("systems", cast(data), {
            column: 'user_id',
            equals: data.user_id
        })

        message.channel.send({
            embeds: [
                this.embed(message.member!, 'GREEN')
                .setTitle(`Settings Updated`)
                .setDescription(
                    tag ? `Tag has been set to ${tag}.` : `Tag has been disabled.`
                )
            ]
        })
    }
})
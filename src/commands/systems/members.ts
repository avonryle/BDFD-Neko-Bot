import displaySystemMembers from "../../functions/displaySystemMembers";
import pageCountFor from "../../functions/pageCountFor";
import { Command } from "../../structures/Command";
import StaffRoles from "../../util/constants/StaffRoles";

export default new Command<[string]>({
    name: 'members',
    description: 'Gets system members of a system reference.',
    roles: [
        StaffRoles.STAFF,
        StaffRoles.LEAD_STAFF,
        StaffRoles.ADMIN_TEST,
        StaffRoles.MODERATOR
    ],
    args: [
        {
            name: 'system ID',
            type: 'STRING',
            required: true
        }
    ],
    execute: async function(message, [ id ]) {
        const system = await this.manager.getSystemMembers(id)

        if (!system) return void message.channel.send({
            embeds: [
                this.embed(message.member!, 'RED')
                .setTitle(`Unknown System`)
                .setDescription(`Could not find any system with that ID.`)
            ]
        })

        if (!system.length) return void message.channel.send({
            embeds: [
                this.embed(message.member!, 'RED')
                .setTitle(`Unknown System`)
                .setDescription(`Given system has no members.`)
            ]
        })

        message.channel.send(displaySystemMembers(this, message.author, system, id, 1))
    }
})
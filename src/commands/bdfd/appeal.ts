import { MessageActionRow, MessageButton } from "discord.js";
import isBanPunishment from "../../functions/isBanPunishment";
import isWarnPunishment from "../../functions/isWarnPunishment";
import noop from "../../functions/noop";
import { Command } from "../../structures/Command";
import { PunishmentType } from "../../typings/enums/PunishmentType";
import { Punishments } from "../../util/enums/Punishments";

export default new Command<[
    PunishmentType,
    string
]>({
    name: 'appeal',
    description: 'appeal a ban from the main server.',
    dmOnly: true,
    args: [
        {
            name: 'punishment',
            type: 'STRING',
            example: "'Temporary Ban'",
            choices: Punishments,
            required: true
        },
        {
            name: 'reason',
            type: 'STRING',
            required: true,
            min: 1,
            max: 1_024
        }
    ],
    execute: async function(message, [ type, reason ]) {
        if (isBanPunishment(type)) {
            const banned = await this.manager.isBanned(message.author.id)

            if (!banned) {
                return void message.channel.send({
                    embeds: [
                        this.embed(message.author!, 'RED')
                        .setTitle(`Request Failed`)
                        .setDescription(`You are not banned from the main server.`)
                    ]
                })
            } else if (!isWarnPunishment(type)) {
                const member = await this.mainGuild.members.fetch(message.author.id).catch(noop)

                if (!member) {
                    return void message.channel.send({
                        embeds: [
                            this.embed(message.author!, 'RED')
                            .setTitle(`Request Failed`)
                            .setDescription(`You have not joined the main server.`)
                        ]
                    })
                } 

                const role = this.manager.getPunishmentRole(type)

                if (!member.roles.cache.has(role.id)) {
                    return void message.channel.send({
                        embeds: [
                            this.embed(message.author!, 'RED')
                            .setTitle(`Request Failed`)
                            .setDescription(`You do not have this punishment role.`)
                        ]
                    })
                }
            }
        }

        if (this.db.has('appeals', message.author.id)) {
            return void message.channel.send({
                embeds: [
                    this.embed(message.author!, 'RED')
                    .setTitle(`Request Failed`)
                    .setDescription(`You've already sent an appeal, wait for it to be reviewed.`)
                ]
            })
        }

        await this.appealsChannel.send({
            embeds: [
                this.embed(message.author!, 'YELLOW')
                .setTitle(`Appeal Request`)
                .addField(`User`, `[${message.author}] (${message.author!.id})`)
                .setFooter({
                    text: `Sent at`
                })
                .addField(`Punishment`, `${type} (${PunishmentType[type]})`)
                .addField(`Reason`, reason)
            ],
            components: [
                new MessageActionRow()
                .addComponents(
                    new MessageButton()
                    .setLabel(`Approve`)
                    .setStyle('SUCCESS')
                    .setCustomId(`appeal_approve_${type}_${message.author.id}`),
                    new MessageButton()
                    .setStyle('DANGER')
                    .setLabel(`Deny`)
                    .setCustomId(`appeal_deny_${type}_${message.author.id}`)
                )
            ]
        })

        this.db.insert('appeals', {
            user_id: message.author.id,
            type,
            reason
        })

        message.channel.send({
            embeds: [
                this.embed(message.author, 'GREEN')
                .setTitle(`Appeal Sent`)
                .setDescription(`You appeal has been successfully sent to the staff team, please wait for their response.`)
                .setFooter({
                    text: `You will not be able to submit another appeal until this one is reviewed.`
                })
            ]
        })
    }
})
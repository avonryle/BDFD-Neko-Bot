import { MessageEmbed } from "discord.js";
import awaitMessage from "../../functions/awaitMessage";
import createInteractionHandler from "../../functions/createInteractionHandler";
import isBanPunishment from "../../functions/isBanPunishment";
import isHigherUp from "../../functions/isHigherUp";
import isStaff from "../../functions/isStaff";
import isWarnPunishment from "../../functions/isWarnPunishment";
import noop from "../../functions/noop";
import { PunishmentType } from "../../typings/enums/PunishmentType";

export default createInteractionHandler('button', async function(i) {
    if (!i.customId.includes(`appeal`)) return; 

    if (!isHigherUp(i.member)) {
        return i.reply({
            ephemeral: true,
            content: `You cannot use this button.`
        })
        .catch(noop)
    }

    const [
        ,
        action,
        type,
        id 
    ] = i.customId.split(/_/)

    const punishment = Number(type) as PunishmentType

    await i.deferUpdate()

    if (action === 'deny') {    
        const collected = await awaitMessage(
            i.channel!,
            i.user.id,
            `Please write down a reason for denying this appeal.`
        )

        if (!collected) {
            return void i.editReply({
                embeds: [
                    i.message.embeds[0]
                ]
            })
        }

        const dm = await this.users.createDM(id).catch(noop)

        this.db.delete("appeals", {
            where: {
                column: 'user_id',
                equals: id
            }
        })

        if (!dm) {
            return void i.editReply({
                content: `User can not be DM'ed.`,
                embeds: [
                    i.message.embeds[0].setColor('RED')
                ],
                components: []
            })
        }

        const m = await dm.send({
            embeds: [
                new MessageEmbed()
                .setColor('RED')
                .setTimestamp()
                .setDescription(`Your appeal has been denied.`)
                .addField(`Staff`, `${i.user.tag} (${i.user}) [${i.user.id}]`)
                .addField(`Reason`, collected.content)
            ]
        }).catch(noop)
        
        if (!m) {
            return void i.editReply({
                content: `User can not be DM'ed.`,
                embeds: [
                    i.message.embeds[0].setColor('RED')
                ],
                components: []
            })
        }

        return void i.editReply({
            embeds: [
                i.message.embeds[0]
                .setColor('RED')
            ],
            components: []
        });
    }

    const dm = await this.users.createDM(id).catch(noop)

    this.db.delete("appeals", {
        where: {
            column: 'user_id',
            equals: id
        }
    })

    const m = await dm?.send({
        embeds: [
            new MessageEmbed()
            .setColor('GREEN')
            .setTimestamp()
            .setTitle(`Appeal Review`)
            .setDescription(`Your appeal has been approved!`)
            .addField(`Staff`, `${i.user.tag} (${i.user}) [${i.user.id}]`)
        ]
    }).catch(noop)

    if (isBanPunishment(punishment)) {
        const unban = await this.mainGuild.bans.remove(id).catch(noop)

        if (!unban) {
            return void i.editReply({
                content: `User could not be unbanned${!m ? ` (nor DM'ed)` : ''} (They're probably unbanned).`,
                embeds: [
                    i.message.embeds[0].setColor('GREEN')
                ],
                components: []
            })
        }

        return void i.editReply({
            content: `User has been unbanned${!m ? ` (could not send DM)` : ''}.`,
            components: [],
            embeds: [
                i.message.embeds[0].setColor('GREEN')
            ]
        })
    } else if (isWarnPunishment(punishment)) {
        return void i.editReply({
            content: `Remove their warning using command${!m ? ` (could not send DM)` : ''}.`,
            components: [],
            embeds: [
                i.message.embeds[0].setColor('GREEN')
            ]
        })
    } else {
        const member = await this.mainGuild.members.fetch(id).catch(noop)

        if (!member) {
            return void i.editReply({
                content: `User is not in the server${!m ? ` (could not send DM)` : ''}.`,
                embeds: [
                    i.message.embeds[0].setColor('GREEN')
                ],
                components: []
            })
        }
        const role = this.manager.getPunishmentRole(punishment)

        const s = await member.roles.remove(role).catch(noop)

        if (!s) {
            return void i.editReply({
                content: `Could not remove the role${!m ? ` (could not send DM neither)` : ''}.`,
                embeds: [
                    i.message.embeds[0].setColor('GREEN')
                ],
                components: []
            })
        }

        return void i.editReply({
            content: `Successfully removed ${role} from them${!m ? ` (could not send DM)` : ''}.`,
            allowedMentions: {
                roles: []
            },
            embeds: [
                i.message.embeds[0].setColor('GREEN')
            ],
            components: []
        })
    }
})
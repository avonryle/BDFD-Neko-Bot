import { MessageActionRow, MessageButton } from "discord.js";
import { Command } from "../../structures/Command";

export default new Command<[string]>({
    name: 'change-nickname',
    capturing: false,
    description: 'creates a request to change your nickname.',
    aliases: [
        "change-nick"
    ],
    args: [
        {
            name: 'nickname',
            required: true,
            type: 'STRING',
            min: 1,
            max: 32
        }
    ],
    execute: async function(message, [ nick ]) {
        if (!message.member?.roles.cache.has(this.build.change_nickname_role)) {
            return void message.channel.send({
                embeds: [
                    this.embed(message.member!, 'RED')
                    .setTitle(`Missing Role`)
                    .setDescription(`You need the role ${this.changeNicknameRole} to request a nickname change.`)
                ]
            })
        }

        if (this.db.has('nicknames', message.author.id)) {
            return void message.channel.send({
                embeds: [
                    this.embed(message.member!, 'RED')
                    .setTitle(`Already Requested`)
                    .setDescription(`You've already sent a nickname change request.`)
                ]
            })
        }

        await this.changeNicknameChannel.send({
            embeds: [
                this.embed(message.member!, 'YELLOW')
                .setTitle(`Nickname Request`)
                .setDescription(nick)
                .setFooter({
                    text: `Sent at`
                })
            ],
            components: [
                new MessageActionRow()
                .addComponents(
                    new MessageButton()
                    .setLabel(`Approve`)
                    .setStyle('SUCCESS')
                    .setCustomId(`nickname_approve_${message.author.id}`),
                    new MessageButton()
                    .setStyle('DANGER')
                    .setLabel(`Deny`)
                    .setCustomId(`nickname_deny_${message.author.id}`)
                )
            ]
        })

        this.db.insert("nicknames", {
            user_id: message.author.id,
            nickname: nick
        })

        message.channel.send({
            embeds: [
                this.embed(message.member!, 'GREEN')
                .setDescription(`The request to change your nickname has been successfully sent, wait for a staff member to review your submission.`)
                .setTitle(`Request Sent`)
                .setFooter({
                    text: `The role will not be removed until your request is accepted.`
                }),
            ]
        })
    }
})
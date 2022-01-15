import awaitMessage from "../../functions/awaitMessage";
import clearBackTicks from "../../functions/clearBackTicks";
import createInteractionHandler from "../../functions/createInteractionHandler";
import isStaff from "../../functions/isStaff";
import noop from "../../functions/noop";

export default createInteractionHandler("button", async function(i) {
    if (!i.customId.includes(`nickname`)) return;

    if (!isStaff(i.member)) {
        return i.reply({
            content: `You cannot use these buttons.`,
            ephemeral: true
        })
    }

    const [
        ,
        action,
        id 
    ] = i.customId.split(/_/)

    await i.deferUpdate()

    const member = await i.guild.members.fetch(id).catch(noop)

    if (!member) {
        return void i.editReply({
            content: `User who requested nickname is not in the server.`,
            components: [],
            embeds: [
                i.message.embeds[0].setColor('RED')
            ]
        })
    }

    if (action === 'approve') {
        const s = await member.setNickname(i.message.embeds[0].description!).catch(noop)

        if (!s) {
            return void i.editReply({
                content: `Failed to update nickname.`,
                embeds: [
                    i.message.embeds[0].setColor('RED')
                ]
            })
        }

        const s2 = await member.roles.remove(this.changeNicknameRole).catch(noop)

        if (!s2) {
            return void i.editReply({
                content: `Failed to remove role.`,
                embeds: [
                    i.message.embeds[0].setColor('RED')
                ]
            })
        }

        this.db.delete('nicknames', {
            where: {
                column: 'user_id',
                equals: id
            }
        })

        this.changeNicknameLogChannel.send({
            content: `${member}'s nickname change request has been approved by ${i.user}.`
        })

        return void i.editReply({
            content: `Successfully updated their nickname.`,
            embeds: [
                i.message.embeds[0].setColor('GREEN')
            ],
            components: []
        })
    } else {
        const collected = await awaitMessage(
            i.channel!,
            i.user.id,
            `Write down the reason for denying the nickname request of ${member}.`
        )

        if (!collected) {
            return void i.editReply({
                embeds: [
                    i.message.embeds[0]
                ]
            })
        }

        this.db.delete('nicknames', {
            where: {
                column: 'user_id',
                equals: id
            }
        })

        this.changeNicknameLogChannel.send({
            content: `<@${id}>'s nickname change request has been denied by ${i.user} with reason: \`${clearBackTicks(collected.content)}\`, please re-send your request with the applied requirements.`
        })

        return void i.editReply({
            components: [],
            embeds: [
                i.message.embeds[0].setColor('RED')
            ]
        })
    }
})
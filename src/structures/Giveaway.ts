import { Message, MessageActionRow, MessageButton, MessageEmbed, TextChannel, User } from "discord.js";
import { NekoClient } from "../core/NekoClient";
import cast from "../functions/cast";
import noop from "../functions/noop";
import sleep from "../functions/sleep";
import { toPlural, toPluralOr, toPluralWith } from "../functions/toPlural";
import { GiveawayData } from "../typings/interfaces/database/GiveawayData";

export const Lifetime = 86_400_000 * 7

export class Giveaway {
    data: GiveawayData<true>
    client: NekoClient
    timeout!: NodeJS.Timeout

    constructor(client: NekoClient, data: GiveawayData<false>) {
        this.data = cast(data)
        this.client = client
    }

    setWinnerCount(n: number) {
        this.data.winner_count = n
        return this
    }

    get isEnded() {
        return this.data.ended
    }

    get isExpired() {
        return this.isEnded ? Date.now() - (this.data.ends_at + Lifetime) > 0 : false
    }

    isAnyEnded() {
        return this.isEnded || Date.now() - (this.data.ends_at + Lifetime) > 0
    }

    get shouldEnd() {
        return this.data.ended === false && Date.now() >= this.data.ends_at
    }

    get guild() {
        return this.client.guilds.cache.get(this.data.guild_id)
    }

    async start(): Promise<Message | void> {
        if (this.data.message_id) return;

        const channel = this.channel
        
        const guild = this.guild

        if (!channel || !guild) {
            return this.destroy()
        }

        const m = await this.channel.send({
            components: [
                new MessageActionRow()
                .addComponents(
                    new MessageButton()
                    .setCustomId(`giveaway_button`)
                    .setLabel(`🎉 Join Giveaway`)
                    .setStyle('SUCCESS')
                )
            ],
            embeds: [
                new MessageEmbed()
                .setColor('BLUE')
                .setAuthor({
                    name: `🎉 GIVEAWAY 🎉`
                })
                .setThumbnail(
                    guild.iconURL({ dynamic: true })!
                )
                .setFooter({
                    text: `Started at`
                })
                .setDescription(`**Hosted By**: <@${this.data.user_id}>\n**${toPlural(`Winner`, this.data.winner_count)}**: ${this.data.winner_count}\n**Ends <t:${Math.trunc(this.data.ends_at / 1000)}:R>**\n\nThere ${toPluralOr('is', this.data.participants.length, 'are')} ${toPluralWith('participant', this.data.participants.length)}`)
                .setTitle(this.data.title)
                .setTimestamp()
            ]
        })
        .catch(noop)

        if (!m) return;

        this.data.message_id = m.id
        
        this.save()
        this.sleep()
        this.cycle()

        return m
    }

    async update(): Promise<Message | void> {
        const channel = this.channel
        
        const guild = this.guild

        if (!channel || !guild) {
            return this.destroy()
        }

        const m = await channel.messages.edit(this.data.message_id, {
            components: [
                new MessageActionRow()
                .addComponents(
                    new MessageButton()
                    .setCustomId(`giveaway_button`)
                    .setLabel(`🎉 Join Giveaway`)
                    .setStyle('SUCCESS')
                )
            ],
            embeds: [
                new MessageEmbed()
                .setColor('RANDOM')
                .setThumbnail(
                    guild.iconURL({ dynamic: true })!
                )
                .setAuthor({
                    name: `🎉 GIVEAWAY 🎉`
                })
                .setFooter({
                    text: `Last updated at`
                })
                .setDescription(`**Hosted By**: <@${this.data.user_id}>\n**${toPlural(`Winner`, this.data.winner_count)}**: ${this.data.winner_count}\n**Ends <t:${Math.trunc(this.data.ends_at / 1000)}:R>**\n\nThere ${toPluralOr('is', this.data.participants.length, 'are')} ${toPluralWith('participant', this.data.participants.length)}`)
                .setTitle(this.data.title)
                .setTimestamp()
            ]
        })
        .catch(noop)

        return m
    }

    save() {
        this.client.db.upsert('giveaways', cast(this.data), {
            column: 'message_id',
            equals: this.data.message_id
        })    
    }

    cycle() {
        this.timeout = setTimeout(async () => {
            if (this.isAnyEnded()) {
                return;
            }

            const m = await this.update()

            this.save()
            this.timeout.refresh()
        }, 60_000);
    }

    add(user: User) {
        this.data.participants.push(user.id)
    }

    isParticipating(user: User) {
        return this.data.participants.includes(user.id)
    }

    async sleep() {
        await sleep(this.data.ends_at - Date.now())
        this.end()
    }

    async end() {
        if (this.isEnded) return;

        const channel = this.channel
        
        const guild = this.guild

        if (!channel || !guild) {
            return this.destroy()
        }

        clearTimeout(this.timeout)

        const winners = this.pick().map(c => `<@${c}>`)

        const m = await channel.messages.edit(this.data.message_id, {
            components: [
                new MessageActionRow()
                .addComponents(
                    new MessageButton()
                    .setCustomId(`giveaway_button`)
                    .setLabel(`🎉 Join Giveaway`)
                    .setStyle('DANGER')
                    .setDisabled(true)
                )
            ],
            embeds: [
                new MessageEmbed()
                .setAuthor({
                    name: `🎉 GIVEAWAY 🎉`
                })
                .setThumbnail(
                    guild.iconURL({ dynamic: true })!
                )
                .setColor('GREEN')
                .setFooter({
                    text: `Thanks for participating!`
                })
                .setDescription(`**Hosted By**: <@${this.data.user_id}>\n**${toPlural(`Winner`, this.data.winner_count)}**: ${winners.join(', ') || 'Nobody'}\n**Ended<t:${Math.trunc(this.data.ends_at / 1000)}:R>**\n\nThere ${toPluralOr('was', this.data.participants.length, 'were')} ${toPluralWith('participant', this.data.participants.length)}`)
                .setTitle(this.data.title)
            ]
        })
        .catch(noop)

        if (!m) {
            return this.destroy()
        }

        const s = await channel.send({
            content: !winners.length ? `Nobody won **${this.data.title}**...` : `Congratulations ${winners.join(', ')}! You won **${this.data.title}**`,
            embeds: [
                new MessageEmbed()
                .setTitle(`Jump to message`)
                .setColor('BLUE')
                .setURL(m.url)
            ]
        })
        .catch(noop)

        if (!s) {
            return this.destroy()
        }

        this.data.ended = true
        this.save()
    }

    destroy() {
        if (!this.data.message_id) return;
        clearTimeout(this.timeout)
        this.client.manager.giveaways.delete(this.data.message_id)
        this.client.db.delete("giveaways", {
            where: {
                column: 'message_id',
                equals: this.data.message_id
            }
        })
    }

    get channel() {
        return this.client.channels.cache.get(this.data.channel_id)! as TextChannel
    }

    async reroll(count = this.data.winner_count) {
        const channel = this.channel
        
        const guild = this.guild

        if (!channel || !guild) {
            return this.destroy()
        }

        const winners = this.pick(count).map(c => `<@${c}>`)

        const m = await channel.messages.edit(this.data.message_id, {
            components: [
                new MessageActionRow()
                .addComponents(
                    new MessageButton()
                    .setCustomId(`giveaway_button`)
                    .setLabel(`🎉 Join Giveaway`)
                    .setStyle('DANGER')
                    .setDisabled(true)
                )
            ],
            embeds: [
                new MessageEmbed()
                .setAuthor({
                    name: `🎉 GIVEAWAY 🎉`
                })
                .setThumbnail(
                    guild.iconURL({ dynamic: true })!
                )
                .setColor('GREEN')
                .setFooter({
                    text: `Thanks for participating!`
                })
                .setDescription(`**Hosted By**: <@${this.data.user_id}>\n**${toPlural(`Winner`, this.data.winner_count)}**: ${winners.join(', ') || 'Nobody'}\n**Ended <t:${Math.trunc(this.data.ends_at / 1000)}:R>**\n\nThere ${toPluralOr('was', this.data.participants.length, 'were')} ${toPluralWith('participant', this.data.participants.length)}`)
                .setTitle(this.data.title)
            ]
        })
        .catch(noop)

        if (!m) {
            return this.destroy()
        }

        const s = await channel.send({
            content: !winners.length ? `Nobody won **${this.data.title}**...` : `The new ${toPlural('winner', winners.length)} for **${this.data.title}** ${toPluralOr('is', winners.length, 'are')} ${winners.join(', ')}!`,
            embeds: [
                new MessageEmbed()
                .setColor('BLUE')
                .setTitle(`Jump to message`)
                .setURL(m.url)
            ]
        })
        .catch(noop)

        if (!s) {
            return this.destroy()
        }
    }

    continue() {
        if (this.data.ended) {
            if (this.isExpired) {
                this.destroy()
            }
            return;
        }
        this.cycle()
        this.sleep()
    }

    pick(len = this.data.winner_count) {
        const winners = new Array<string>()

        let participants = this.data.participants

        for (let i = 0;i < len;i++) {
            if (!participants.length) {
                break
            }

            const rnd = Math.floor(Math.random() * participants.length)

            const got = participants[rnd]

            participants = participants.filter(c => c !== got)

            winners.push(got)
        }

        return winners
    }
}
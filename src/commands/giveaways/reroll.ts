import noop from "../../functions/noop";
import { Command } from "../../structures/Command";

export default new Command<[
    string, number | null
]>({
    name: 'reroll',
    description: 'rerolls a giveaway.',
    args: [
        {
            name: 'messageID',
            type: 'STRING',
            required: true 
        },
        {
            name: 'winners',
            type: 'NUMBER',
            min: 1,
            max: 20
        }
    ],
    execute: async function(message, [ id, count ]) {
        const gw = this.manager.giveaways.get(id)

        if (!gw) {
            return void message.channel.send({
                embeds: [
                    this.embed(message.member!, 'RED')
                    .setTitle(`Unknown Giveaway`)
                    .setDescription(`I could not find any giveaway with that ID.`)
                ]
            })
        }

        if (!gw.isEnded) {
            return void message.channel.send({
                embeds: [
                    this.embed(message.member!, 'RED')
                    .setTitle(`Failed`)
                    .setDescription(`This giveaway has not yet ended.`)
                ]
            })
        }

        gw.reroll(count ?? undefined)
        message.react('✅').catch(noop)
    }
})
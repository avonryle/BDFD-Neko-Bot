import noop from "../../functions/noop";
import { Command } from "../../structures/Command";

export default new Command<[
    string
]>({
    name: 'end',
    description: 'ends a giveaway.',
    args: [
        {
            name: 'messageID',
            type: 'STRING',
            required: true 
        }
    ],
    execute: async function(message, [ id ]) {
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

        if (gw.isEnded) {
            return void message.channel.send({
                embeds: [
                    this.embed(message.member!, 'RED')
                    .setTitle(`Failed`)
                    .setDescription(`This giveaway has already ended.`)
                ]
            })
        }

        gw.end()
        message.react('✅').catch(noop)
    }
})
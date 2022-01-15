import { MessageEmbed } from "discord.js";
import { Command } from "../../structures/Command";

class BracketCounter {
    totalRightBrackets = 0
    totalLeftBrackets = 0
    lines: {
        totalRightBrackets: 0
        totalLeftBrackets: number
    }[] = []

    constructor(code: string) {
        this.load(code)
    }

    load(code: string) {
        for (const line of code.split(/\n/)) {
            const matches = line.match(/(\[|\])/g) ?? []

            const data: BracketCounter["lines"][0] = {
                totalLeftBrackets: 0,
                totalRightBrackets: 0
            }
            
            for (let i = 0, len = matches.length;i < len;i++) {
                const match = matches[i]
                if (match === ']') {
                    data.totalLeftBrackets++
                    this.totalLeftBrackets++
                } else {
                    data.totalRightBrackets++
                    this.totalRightBrackets++
                }
            }

            this.lines.push(data)
        }
    }
}

export default new Command<[string]>({
    capturing: false,
    name: 'count-brackets',
    aliases: [
        'cb'
    ],
    args: [
        {
            name: 'code',
            required: true,
            type: 'STRING'
        }
    ],
    description: 'Counts brackets in a code.',
    execute: async function(message, [ code ]) {
        const counter = new BracketCounter(code)

        const embed = this.embed(message.member!, 'GREEN')
        .addField(`Total`, `[ => ${counter.totalRightBrackets.toLocaleString()}\n] => ${counter.totalLeftBrackets.toLocaleString()}`)

        const text = counter.lines.map((x, y) => `L.${y+1}: [ => ${x.totalRightBrackets.toLocaleString()} | ] => ${x.totalLeftBrackets.toLocaleString()}`).join('\n')
    
        if (text.length < 4_000) {
            embed.setDescription(text)
        }

        message.channel.send({
            embeds: [
                embed
            ]
        })
    }
})
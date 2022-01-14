import { inspect } from "util";
import { Command } from "../../structures/Command";

export default new Command<[
    string
], {
    depth: number
}>({
    name: 'eval',
    description: 'evals given code.',
    capturing: false,
    args: [
        {
            name: 'code',
            required: true,
            type: 'STRING'
        }
    ],
    execute: async function(message, [ code ], extras) {
        const depth = extras.flags.depth ?? 0

        try {
            var evaled = await eval(code)
        } catch (error: any) {
            evaled = error.stack
        }

        if (typeof evaled === 'object') evaled = inspect(evaled, { depth })

        await message.channel.send({
            content: `\`\`\`js\n${evaled}\`\`\``
        })
    }
})
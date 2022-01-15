import { toPluralWith } from "../../functions/toPlural";
import { Command } from "../../structures/Command";

export default new Command({
    name: 'update',
    description: 'updates all commands in bot',
    execute: async function(message) {
        const m = await message.channel.send(`Updating commands...`)
        try {
            this.manager.loadCommands(true)
        } catch (error: any) {
            return void m.edit(error.stack)
        }

        m.edit(`Successfully updated ${toPluralWith('command', this.manager.commands.size)}.`)
    }
})
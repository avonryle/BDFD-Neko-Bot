import { Command } from "../../structures/Command";

export default new Command({
    name: 'ping',
    description: 'bot ping, yes.',
    execute: async function(message) {
        const m = await message.channel.send(`Pinging...`)
        m.edit(`Pong! ${m.createdTimestamp - message.createdTimestamp}ms`)
    }
})
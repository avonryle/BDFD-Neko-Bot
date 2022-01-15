import axios from "axios";
import { MessageEmbed } from "discord.js";
import { Command } from "../../structures/Command";
import { NekoRequest } from "../../typings/interfaces/http/NekoRequest";

export default new Command<[number | null]>({
    name: 'neko',
    description: 'get a neko from nekos.best',
    args: [
        {
            name: 'amount',
            type: 'NUMBER',
            min: 1,
            max: 10
        }
    ],
    execute: async function(message, [ n ]) {
        const request = await axios.get<NekoRequest>(`https://nekos.best/api/v1/nekos?amount=${n ?? 1}`)

        const data = request.data.url

        message.channel.send({
            embeds: data.map(c => new MessageEmbed().setColor('RANDOM').setImage(c.url))
        })
    }
})
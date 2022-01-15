import { Command } from "../../structures/Command";

export default new Command({
    name: 'github',
    description: 'Returns the bot\'s repository',
    execute: async function(message) {
        message.channel.send({
            embeds: [
                this.embed(message.member!, 'GREEN')
                .setDescription(`Source code can be found [here](https://github.com/Rubenennj/BDFD-Neko-Bot).`)
            ]
        })
    }
})
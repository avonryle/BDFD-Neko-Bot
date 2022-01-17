import { User } from "discord.js";
import displayMusicQueue from "../../functions/displayMusicQueue";
import { Command } from "../../structures/Command";
import { PlayerState } from "../../typings/enums/PlayerState";

export default new Command({
    name: 'queue',
    botInVoice: true,
    description: 'displays added songs to queue',
    execute: async function(message) {
        message.channel.send(
            displayMusicQueue(this, message.author, this.manager.guild(message.guildId!), 1)
        )
    }
})
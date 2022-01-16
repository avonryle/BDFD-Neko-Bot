import cast from "../../functions/cast";
import { Command } from "../../structures/Command";

export default new Command({
    name: 'toggle-scam-link-detection',
    description: 'Enables or disables detection of scam links.',
    permissions: [
        "MANAGE_GUILD"
    ],
    execute: async function(message) {
        const data = this.manager.guildSettings(message.guild!.id)

        const old = data.detect_scam_links

        data.detect_scam_links = !data.detect_scam_links

        this.manager.db.upsert("guilds", cast(data), {
            column: 'guild_id',
            equals: data.guild_id
        })

        message.channel.send({
            embeds: [
                this.embed(message.member!, 'GREEN')
                .setTitle(`Settings Updated`)
                .setDescription(`Scam link detection is now ${old ? 'disabled' : 'enabled'}.`)
            ]
        })
    }
})
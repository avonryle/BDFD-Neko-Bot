import { GuildMember, MessageActionRow, MessageButton, MessageEmbed } from "discord.js";
import { NekoClient } from "../core/NekoClient";

const MINIMUM_CREATION_TIME = 86_400_000 * 3;

export default function(client: NekoClient, member: GuildMember) {
    if (member.guild.id !== client.build.main_guild_id) return;
    
    const creation = Date.now() - member.user.createdTimestamp

    if (creation > MINIMUM_CREATION_TIME) return;

    const embed = new MessageEmbed()
    .setColor('RED')
    .setAuthor({
        name: member.user.tag,
        iconURL: member.displayAvatarURL({ dynamic: true })
    })
    .setTitle(`Suspicious Account`)
    .setDescription(`${member} might be an alt.`)
    .setFooter({
        text: `Creation date: ${client.manager.parser.parseToString(creation, { and: true, limit: 2 })} ago`
    })
    .setTimestamp(member.user.createdTimestamp)

    client.altLogChannel.send({
        embeds: [
            embed
        ],
        components: [
            new MessageActionRow()
            .addComponents(
                new MessageButton()
                .setLabel(Math.random() * 100 > 93 ? `No doubt, ban.` : 'Ban')
                .setCustomId(`alt_ban_${member.id}`)
                .setStyle('DANGER')
            )
        ]
    })
}
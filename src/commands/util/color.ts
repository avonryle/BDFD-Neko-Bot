import { MessageEmbed, MessageAttachment } from "discord.js";
import { Command } from "../../structures/Command";
const { createCanvas, loadImage } = require('canvas')

export default new Command<[string]>({
    name: 'color',
    aliases: [
        "colour",
        "col"
    ],
    description: 'get color from a given value. accepts RGB(A) and Hex values.',
    args: [
        {
            name:'value',
            required: true,
            type:'STRING'
            }
        ],
    execute: async function(message, [ value ]){
        const canvas = createCanvas(200, 200)
        const ctx = canvas.getContext('2d')
        ctx.rect(0, 0, 200, 200)
        ctx.fillStyle = `${value}`
        ctx.fill()
        
        const att = new MessageAttachment(canvas.toBuffer(), 'color.png');
        const embed = new MessageEmbed()
        .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
        .setDescription(`**Color Given**: ${value}`)
        .setImage('attachment://color.png')
        .setColor('#2f2136')
        .setTimestamp()
        
        await message.reply({
            files:[att], 
            embeds:[embed], 
            allowedMentions: { repliedUser: false }
        })
     }
})

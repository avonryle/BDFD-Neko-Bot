import { MessageActionRow } from "discord.js";
import createInteractionHandler from "../../functions/createInteractionHandler";

export default createInteractionHandler("button", async function(i) {
    if (!i.customId.includes("rnd_button")) return;

    if (!i.customId.includes(i.user.id)) {
        return i.reply({
            ephemeral: true,
            content: `You cannot use this button.`
        })
    }

    const [
        ,
        ,
        action,
        id 
    ] = i.customId.split(/_/)

    if (action === 'FAIL') {
        i.message.components.map(c => c.components.map(c => c.setDisabled(true)))
        return i.update({
            content: `You lost.`,
            components: i.message.components
        })
    }

    i.message.components.map(x => {
        const btn = x.components.find(c => c.customId?.split(/_/)[3] === id);
        btn?.setDisabled(true)
    })

    if (i.message.components.reduce((x, y) => x + y.components.filter(c => !c.disabled).length, 0) === 1) {
        i.message.components.map(c => c.components.map(c => c.setDisabled(true)))
        return i.update({
            content: `You won!`,
            components: i.message.components
        })
    }

    i.update({
        content: `Continue.`,
        components: i.message.components
    })
})
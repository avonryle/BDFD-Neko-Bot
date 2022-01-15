import createInteractionHandler from "../../functions/createInteractionHandler";
import isHigherUp from "../../functions/isHigherUp";
import noop from "../../functions/noop";

export default createInteractionHandler("button", async function(i) {
    if (!i.customId.includes("alt")) return;

    if (!isHigherUp(i.member)) {
        return i.reply({
            ephemeral: true,
            content: `Nice try.`
        })
    }

    const [
        ,
        ,
        id 
    ] = i.customId.split(/_/)

    const ban = await i.guild.bans.create(id, {
        reason: `[Issuer: ${i.user.tag}]: Alt`
    })
    .catch(noop)

    if (!ban) return i.reply({
        ephemeral: true,
        content: `Could not ban user.`
    })

    i.update({
        content: `User has been banned.`,
        components: []
    })
})
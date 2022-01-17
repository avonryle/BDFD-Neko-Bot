import createInteractionHandler from "../../functions/createInteractionHandler";

export default createInteractionHandler("button", async function(i) {
    if (!i.customId.includes("giveaway")) return;

    const gw = this.manager.giveaways.get(i.message.id)

    if (!gw) return;
    
    if (gw.isParticipating(i.user)) {
        return i.reply({
            ephemeral: true,
            content: `You are already participating.`
        })
    }

    gw.add(i.user)
    
    i.reply({
        ephemeral: true,
        content: `You've successfully entered the giveaway.`
    })
})
import createInteractionHandler from "../../functions/createInteractionHandler";
import displayMusicQueue from "../../functions/displayMusicQueue";

export default createInteractionHandler("button", async function(i) {
    if (!i.customId.includes('queue')) return;

    if (!i.customId.includes(i.user.id)) {
        return i.reply({
            ephemeral: true,
            content: `You cannot use this button.`
        })
    }

    const [
        ,
        action,
        raw 
    ] = i.customId.split(/_/)

    const page = action === 'back' ? Number(raw) - 1 : Number(raw) + 1

    i.update(
        displayMusicQueue(this, i.user, this.manager.guild(i.guildId), page)
    )
})
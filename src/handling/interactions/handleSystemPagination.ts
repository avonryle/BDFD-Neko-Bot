import createInteractionHandler from "../../functions/createInteractionHandler";
import displaySystemMembers from "../../functions/displaySystemMembers";

export default createInteractionHandler("button", async function(i) {
    if (!i.customId.startsWith(`system`)) return;

    if (!i.customId.includes(i.user.id)) {
        return i.reply({
            ephemeral: true,
            content: `You cannot use this button.`
        })
    }

    const [
        ,
        action,
        raw,
        id,
        target
    ] = i.customId.split(/_/)

    if (i.user.id !== id) {
        return i.reply({
            ephemeral: true,
            content: `You cannot use this button.`
        })
    }

    const page = action === 'back' ? Number(raw) - 1 : Number(raw) + 1

    const members = await this.manager.getSystemMembers(target)

    if (!members) {
        return i.reply({
            ephemeral: true,
            content: `Failed to get system members.`
        })
    }

    await i.update(displaySystemMembers(this, i.user, members, target, page))
})
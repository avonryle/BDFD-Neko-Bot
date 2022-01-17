import createInteractionHandler from "../../functions/createInteractionHandler";
import noop from "../../functions/noop";

export default createInteractionHandler("button", async function(i) {
    if (i.customId !== 'user_locale') return;

    i.reply({
        ephemeral: true,
        content: `Locale: ${i.locale}, Guild Locale: ${i.guildLocale}`
    })
    .catch(noop)
})
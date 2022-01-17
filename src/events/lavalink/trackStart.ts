import createLavalinkEventHandler from "../../functions/createLavalinkEventHandler";
import { PlayerState } from "../../typings/enums/PlayerState";

export default createLavalinkEventHandler("trackStart", async function (player, track) {
    const guild = this.manager.guild(player.options.guildID)

    guild.set('state', PlayerState.PLAYING)

    const m = await guild.notify({
        content: `Playing now ${track.title}.`,
        allowedMentions: {
            parse: []
        }
    })

    guild.set('message', m ?? null)
})
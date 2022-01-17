import createLavalinkEventHandler from "../../functions/createLavalinkEventHandler";
import { PlayerState } from "../../typings/enums/PlayerState";

export default createLavalinkEventHandler("trackError", async function (player, track, payload) {
    const guild = this.manager.guild(player.options.guildID)

    guild.set('state', PlayerState.PLAYING)

    await guild.notify({
        content: `There was an error while playing ${track.title}:\n${payload.exception.message}`,
        allowedMentions: {
            parse: []
        }
    })
})
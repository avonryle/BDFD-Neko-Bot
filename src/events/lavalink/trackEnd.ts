import { LoopMode } from "lavacoffee/dist/utils";
import createLavalinkEventHandler from "../../functions/createLavalinkEventHandler";
import noop from "../../functions/noop";
import { PlayerState } from "../../typings/enums/PlayerState";

export default createLavalinkEventHandler("trackEnd", async function (player, track) {
    const guild = this.manager.guild(player.options.guildID)

    guild.set('state', PlayerState.IDLE)

    guild.message?.delete().catch(noop)

    if (guild.loop === LoopMode.None) {
        guild.next()
    } else if (guild.loop === LoopMode.Queue) {
        const trk = guild.next()
        if (!trk) guild.set('current', 0)
    }

    guild.play()
})
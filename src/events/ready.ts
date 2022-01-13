import createDiscordEvent from "../functions/createDiscordEvent";
import { toPluralWith } from "../functions/toPlural";

export default createDiscordEvent("ready", async function() {
    this.manager.loadCommands()
    
    console.log(`Ready on client ${this.user.tag} and loaded ${toPluralWith('command', this.manager.commands.size)}.`)
})
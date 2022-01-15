import { ErrorHandler } from "../core/ErrorHandler";
import createDiscordEvent from "../functions/createDiscordEvent";
import handleAltLogging from "../handling/handleAltLogging";

export default createDiscordEvent("guildMemberAdd", async function(member) {
    ErrorHandler.wrap(handleAltLogging).runAsync(null, this, member)
})
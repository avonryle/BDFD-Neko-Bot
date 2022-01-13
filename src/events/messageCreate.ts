import { ErrorHandler } from "../core/ErrorHandler";
import createDiscordEvent from "../functions/createDiscordEvent";
import { Command } from "../structures/Command";

export default createDiscordEvent("messageCreate", function(message) {
    ErrorHandler.wrap(Command.handle).runAsync(null, this, message)
})
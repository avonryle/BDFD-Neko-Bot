import { ErrorHandler } from "../../core/ErrorHandler";
import createDiscordEvent from "../../functions/createDiscordEvent";
import handleMassPing from "../../handling/handleMassPing";
import handleMessageScanning from "../../handling/handleMessageScanning";
import { Command } from "../../structures/Command";

export default createDiscordEvent("messageCreate", function(message) {
    ErrorHandler.wrap(Command.handle).runAsync(null, this, message)

    ErrorHandler.wrap(handleMassPing).runAsync(null, message)

    ErrorHandler.wrap(handleMessageScanning).runAsync(null, this, message)
})
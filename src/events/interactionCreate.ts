import { ErrorHandler } from "../core/ErrorHandler";
import cast from "../functions/cast";
import createDiscordEvent from "../functions/createDiscordEvent";
import handleAltBan from "../handling/interactions/handleAltBan";
import handleAppealRequest from "../handling/interactions/handleAppealRequest";
import handleGiveawayRequest from "../handling/interactions/handleGiveawayRequest";
import handleHelpCommand from "../handling/interactions/handleHelpCommand";
import handleNicknameRequest from "../handling/interactions/handleNicknameRequest";
import handleSystemPagination from "../handling/interactions/handleSystemPagination";

export default createDiscordEvent("interactionCreate", async function(i) {
    if (i.isButton()) {
        ErrorHandler.wrap(handleNicknameRequest).runAsync(this, cast(i))
        ErrorHandler.wrap(handleAppealRequest).runAsync(this, cast(i))
        ErrorHandler.wrap(handleGiveawayRequest).runAsync(this, cast(i))
        ErrorHandler.wrap(handleHelpCommand).runAsync(this, cast(i))
        ErrorHandler.wrap(handleAltBan).runAsync(this, cast(i))
        ErrorHandler.wrap(handleSystemPagination).runAsync(this, cast(i))
    }
})
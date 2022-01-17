import { ErrorHandler } from "../../core/ErrorHandler";
import cast from "../../functions/cast";
import createDiscordEvent from "../../functions/createDiscordEvent";
import saveDeletedMessage from "../../handling/saveDeletedMessage";

export default createDiscordEvent("messageDelete", async function(m) {
    ErrorHandler.wrap(saveDeletedMessage).run(null, this, cast(m))
})
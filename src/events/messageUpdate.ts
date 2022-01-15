import { ErrorHandler } from "../core/ErrorHandler";
import cast from "../functions/cast";
import createDiscordEvent from "../functions/createDiscordEvent";
import saveEditedMessage from "../handling/saveEditedMessage";

export default createDiscordEvent("messageUpdate", async function(old, m) {
    ErrorHandler.wrap(saveEditedMessage).run(null, this, cast(old), cast(m))
})
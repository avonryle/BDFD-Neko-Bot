import cast from "../functions/cast";
import createDiscordEvent from "../functions/createDiscordEvent";
import handleAppealRequest from "../handling/interactions/handleAppealRequest";
import handleNicknameRequest from "../handling/interactions/handleNicknameRequest";

export default createDiscordEvent("interactionCreate", async function(i) {
    if (i.isButton()) {
        handleNicknameRequest.call(this, cast(i))
        handleAppealRequest.call(this, cast(i))
    }
})
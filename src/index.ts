import { Intents } from "discord.js";
import { NekoClient } from "./core/NekoClient";
import { BuildType } from "./typings/enums/BuildType";

const client = new NekoClient({
    partials: [
        "CHANNEL",
        "GUILD_MEMBER",
        "GUILD_SCHEDULED_EVENT",
        "MESSAGE",
        "REACTION",
        "USER"
    ],
    intents: Object.values(Intents.FLAGS)
})

client.manager.loadEvents()

client.init(BuildType.TEST)
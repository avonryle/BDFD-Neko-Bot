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
    intents: [
        "DIRECT_MESSAGES",
        "GUILDS",
        "GUILD_MESSAGES",
        'GUILD_MEMBERS'
    ],
    presence: {
        status: 'idle',
        activities: [
            {
                name: 'staff use me for their needs',
                type: 'WATCHING'
            }
        ]
    }
})

client.manager.loadEvents()

client.init(BuildType.TEST)
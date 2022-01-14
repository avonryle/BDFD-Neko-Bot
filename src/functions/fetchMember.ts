import { Collection, Guild, GuildMember } from "discord.js";
import cleanID from "./cleanID";
import noop from "./noop";

export default async function(
    guild: Guild,
    query: string
): Promise<null | GuildMember | Collection<string, GuildMember>> {
    query = cleanID(query)

    if (/[0-9]+/g.test(query)) {
        return await guild.members.fetch(query).catch(noop) ?? null
    }

    const got = await guild.members.fetch({
        query,
        limit: 10 
    })
    .catch(noop)

    return got ?? null
}
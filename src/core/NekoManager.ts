import axios from "axios";
import { execSync } from "child_process";
import { Database } from "dbdts.db";
import { ClientEvents, Collection, GuildMember, Message, Role, TextChannel, Webhook, WebhookClient } from "discord.js";
import { readdirSync } from "fs";
import Parser from "ms-utility";
import cast from "../functions/cast";
import getDataFromWebhookURL from "../functions/getDataFromWebhookURL";
import noop from "../functions/noop";
import { CacheRecord } from "../structures/CacheRecord";
import { Command } from "../structures/Command";
import { Giveaway } from "../structures/Giveaway";
import { PunishmentType } from "../typings/enums/PunishmentType";
import { CacheItems } from "../typings/interfaces/CacheItems";
import { ChannelData } from "../typings/interfaces/database/ChannelData";
import { DatabaseInterface } from "../typings/interfaces/database/DatabaseInterface";
import { GuildSettingsData } from "../typings/interfaces/database/GuildSettingsData";
import { SystemMemberData } from "../typings/interfaces/database/SystemMemberData";
import { SystemMemberFrontRequest } from "../typings/interfaces/http/SystemMemberFrontRequest";
import { SystemMemberRequest } from "../typings/interfaces/http/SystemMemberRequest";
import { DiscordEvent } from "../typings/types/DiscordEvent";
import { Option } from "../typings/types/Option";
import DurationUnits from "../util/constants/DurationUnits";
import { PunishmentRoles } from "../util/constants/PunishmentRoles";
import { LogExecutionTime } from "../util/decorators/LogExecutionTime";
import { WrapAsyncMethodWithErrorHandler } from "../util/decorators/WrapMethodWithErrorHandler";
import { NekoClient } from "./NekoClient";

export class NekoManager {
    client: NekoClient

    settings = new Collection<string, GuildSettingsData>()

    systemMembers = new Collection<string, SystemMemberData>()
    fronters = new Collection<string, SystemMemberRequest>()
    cache = new CacheRecord<CacheItems>()
    parser = new Parser(DurationUnits)
    giveaways = new Collection<string, Giveaway>()
    channels = new Collection<string, ChannelData>()

    esnipes = new Collection<string, Message<true>>()
    snipes = new Collection<string, Message<true>>()

    db = new Database({
        path: './neko.db',
        sanitize: true,
        length: 10
    })

    commands = new Collection<string, Command>()
    events = new Collection<keyof ClientEvents, DiscordEvent>()

    constructor(client: NekoClient) {
        this.client = client
    }

    @WrapAsyncMethodWithErrorHandler()
    async getChannelWebhook(channel: TextChannel): Promise<Option<WebhookClient>> {
        const data = this.channel(channel.id)

        const webhook = data.webhook_url ? await new WebhookClient({ url: data.webhook_url }) : channel.permissionsFor(this.client.user)?.has('MANAGE_WEBHOOKS') ? await channel.createWebhook("System Ref").catch(noop) : null

        if (!webhook) {
            return null
        }

        if (!data.webhook_url) {
            data.webhook_url = webhook.url
            this.db.upsert("channels", cast(data), {
                column: 'channel_id',
                equals: data.channel_id
            })
        }

        return webhook instanceof Webhook ? new WebhookClient({ url: webhook.url }) : webhook
    }

    channel(id: string): ChannelData {
        const existing = this.channels.get(id)

        if (existing) return existing

        const data = this.db.get("channels", id) as unknown as ChannelData

        data.channel_id = id

        this.channels.set(data.channel_id, data)
        return data
    }

    async isBanned(id: string): Promise<boolean> {
        return Boolean(await this.client.mainGuild.bans.fetch(id).catch(noop))
    }

    getPunishmentRole(type: PunishmentType): Role {
        return this.client.mainGuild.roles.cache.get(PunishmentRoles[PunishmentType[type] as keyof typeof PunishmentRoles])!
    }

    systemMember(id: string): SystemMemberData {
        const existing = this.systemMembers.get(id)

        if (existing) return existing

        const data = this.db.get("systems", id) as unknown as SystemMemberData

        data.user_id = id

        this.systemMembers.set(data.user_id, data)
        return data
    }

    @WrapAsyncMethodWithErrorHandler()
    async getSystemMembers(id: string): Promise<Option<SystemMemberRequest[]>> {
        return await axios.get<SystemMemberRequest[]>(`https://api.pluralkit.me/v2/systems/${id}/members`).then(c => c.data)
    }

    @WrapAsyncMethodWithErrorHandler()
    async getFrontingMember(id: string, cache = true): Promise<Option<SystemMemberRequest>> {
        const existing = cache ? this.fronters.get(id) : null

        if (existing) return existing

        const request = await axios.get<SystemMemberFrontRequest>(`https://api.pluralkit.me/v2/systems/${id}/fronters`).catch(noop)

        if (!request || !request.data.members.length) return null

        const member = request.data.members[0]

        this.fronters.set(id, member)
        return member
    }

    guildSettings(id: string) {
        const existing = this.settings.get(id)
        
        if (existing) return existing

        const settings = this.db.get('guilds', id) as unknown as GuildSettingsData

        settings.guild_id = id

        this.settings.set(settings.guild_id, settings)

        return settings
    }

    @LogExecutionTime()
    loadCommands(ref = false) {
        if (ref) {
            execSync('tsc')
        }

        this.commands.clear()

        for (const folder of readdirSync(`./dist/commands/`))
            for (const file of readdirSync(`./dist/commands/${folder}`)) {
                const path = `../commands/${folder}/${file}`

                if (ref) {
                    delete require.cache[require.resolve(path)]
                }

                const cmd = require(path).default as Command

                if (!cmd.data.category) {
                    cmd.data.category = folder
                }

                if (cmd.data.category === 'developer') {
                    cmd.data.owner = true
                }

                this.commands.set(cmd.data.name, cmd)
            }
    }

    @LogExecutionTime()
    loadEvents(ref = false) {
        if (ref) {
            execSync('tsc')
        }

        this.events.map((ev, key) => this.client.removeListener(key, cast(ev)))

        this.events.clear()

        for (const file of readdirSync(`./dist/events/`)) {
            const name = file.split('.js')[0] as keyof ClientEvents

            const path = `../events/${file}`

            if (ref) {
                delete require.cache[require.resolve(path)]
            }

            const event = require(path).default as DiscordEvent

            const bind = event.bind(this.client)

            this.events.set(name, bind)
            this.client.on(name, bind)
        }

        return this
    }
}
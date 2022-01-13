import { capture, ParsedContentData } from "arg-capturer";
import { Message } from "discord.js";
import { NekoClient } from "../core/NekoClient";
import cast from "../functions/cast";
import removeScripts from "../functions/removeScripts";
import { CommandData } from "../typings/interfaces/CommandData";
import { ExtrasData } from "../typings/interfaces/ExtrasData";
import { Async } from "../typings/types/Async";
import { AsyncLogExecutionTime } from "../util/decorators/LogExecutionTime";
import { WrapAsyncMethodWithErrorHandler } from "../util/decorators/WrapMethodWithErrorHandler";

export class Command<T = unknown[], K extends ParsedContentData["flags"] = ParsedContentData["flags"]> {
    data: CommandData<T, K>

    constructor(data: CommandData<T, K>) {
        this.data = data
    }

    get<V extends keyof CommandData<T, K>>(key: V): CommandData<T, K>[V] {
        return this.data[key]
    }

    @WrapAsyncMethodWithErrorHandler(true)
    @AsyncLogExecutionTime()
    async run(client: NekoClient, message: Message, args: T, extras: ExtrasData<K>) {
        return await this.data.execute.call(client, message, args, extras)
    }

    static async handle(client: NekoClient, message: Message) {
        if (message.author.bot) return;

        const prefix = client.prefixes.find(c => message.content.startsWith(c))

        if (!prefix) return;

        const rawArgs = message.content.slice(prefix.length).trim().split(/ +/)

        const cmd = rawArgs.shift()?.toLowerCase()

        if (!cmd) return;

        const command = client.manager.commands.get(cmd) ?? client.manager.commands.find(
            c => c.data.name === cmd || removeScripts(c.data.name) === removeScripts(cmd) || (
                c.data.aliases ? c.data.aliases.some(
                    alias => alias === cmd || removeScripts(alias) === removeScripts(alias)
                ) : false
            )
        )

        if (!command) return;

        const perms = await command.permissionsFor(client, message)

        if (!perms) return;

        const {
            flags,
            args: capturedArgs
        } = capture(rawArgs.join(' '), command.data.capturing ?? false)

        const extras: ExtrasData<typeof flags> = {
            flags,
            prefix,
            commandString: cmd
        }

        const args = await command.parseArgs(client, message, rawArgs, extras)

        if (!args) return;
        
        await command.run(client, message, args, extras)
    } 

    async parseArgs(client: NekoClient, message: Message, rawArgs: string[], extras: ExtrasData<K>): Promise<T | false> {
        if (!this.data.args?.length) return [ rawArgs.join(' ') ] as unknown as T

        const parsedArgs: T = cast([])

        for (let i = 0, len = this.data.args.length;i < len;i++) {
            const raw = this.data.args[i]
            const arg = typeof raw === 'function' ? await raw.call(client, message) : raw
            
            const current = i + 1 === len ? rawArgs.slice(i).join(' ') || undefined : rawArgs[i]

            
        }

        return parsedArgs
    }

    async permissionsFor(client: NekoClient, message: Message): Promise<boolean> {
        if (this.data.dmOnly && message.channel.type !== 'DM') {
            return false
        }

        if (this.data.owner && !(await client.fetchOwners()).includes(message.author.id)) {
            
            return false
        }

        return true
    }
}
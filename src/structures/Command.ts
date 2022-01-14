import { capture, ParsedContentData } from "arg-capturer";
import { GuildChannel, Message } from "discord.js";
import { type } from "os";
import { NekoClient } from "../core/NekoClient";
import cast from "../functions/cast";
import cleanID from "../functions/cleanID";
import createSelector from "../functions/createSelector";
import fetchMember from "../functions/fetchMember";
import inRange from "../functions/inRange";
import matches from "../functions/matches";
import noop from "../functions/noop";
import removeScripts from "../functions/removeScripts";
import { ArgType } from "../typings/enums/ArgType";
import { RejectionType } from "../typings/enums/RejectionType";
import { ArgData } from "../typings/interfaces/ArgData";
import { CommandData } from "../typings/interfaces/CommandData";
import { ExtrasData } from "../typings/interfaces/ExtrasData";
import { Async } from "../typings/types/Async";
import { RejectionTypes } from "../typings/types/RejectionTypes";
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

        const parsedArgs: unknown[] = []

        for (let i = 0, len = this.data.args.length;i < len;i++) {
            const raw = this.data.args[i]
            const arg = typeof raw === 'function' ? await raw.call(client, message) : raw

            const current = i + 1 === len ? rawArgs.slice(i).join(' ') || undefined : rawArgs[i]

            const reject = this.reject.bind(
                this,
                client,
                message,
                arg,
                extras
            ).bind(
                this,
                current
            )
            
            if (!current) {
                if (arg.required) {
                    return reject(RejectionType.EMPTY)
                }
                parsedArgs.push(null)
                continue
            }

            let data: unknown = current

            switch(arg.type) {
                case 'STRING':
                case ArgType.STRING: {
                    const range = inRange(current.length, arg.min, arg.max)

                    if (!range) return reject(RejectionType.RANGE)

                    if (!matches(current, arg.regexes)) return reject(RejectionType.REGEX)

                    break
                }

                case 'NUMBER':
                case ArgType.NUMBER: {
                    const n = Number(current)

                    if (isNaN(n)) return reject(RejectionType.TYPE)

                    if (n > Number.MAX_SAFE_INTEGER || n < Number.MIN_SAFE_INTEGER) return reject(RejectionType.RANGE)

                    if (!inRange(n, arg.min, arg.max)) return reject(RejectionType.RANGE)

                    data = n 
                    break
                }

                case 'TIME':
                case ArgType.TIME: {
                    try {
                        const time = client.manager.parser.parseToMS(current)
                        if (inRange(time, arg.min, arg.max)) return reject(RejectionType.RANGE)

                        data = time 
                        break
                    } catch (error) {
                        return reject(RejectionType.TYPE)
                    }
                }

                case 'CHANNEL':
                case ArgType.CHANNEL: {
                    const channel = message.guild?.channels.cache.get(cleanID(current)) ?? message.guild?.channels.cache.filter(
                        c => c.name === current || !!~removeScripts(c.name).indexOf(removeScripts(current))
                    )

                    const selector = await createSelector(
                        message,
                        channel
                    )

                    if (selector === undefined) return reject(RejectionType.TYPE)

                    if (selector === null) return false;

                    data = selector
                    break
                }

                case 'MEMBER':
                case ArgType.MEMBER: {
                    const member = await fetchMember(
                        message.guild!,
                        current
                    )

                    const selector = await createSelector(
                        message,
                        member
                    )

                    if (selector === undefined) return reject(RejectionType.TYPE)

                    if (selector === null) return false;

                    data = selector
                    break
                }

                case 'USER':
                case ArgType.USER: {
                    const user = await client.users.fetch(cleanID(current)).catch(noop)

                    if (!user) return reject(RejectionType.TYPE)

                    data = user
                    break
                }

                case 'MESSAGE':
                case ArgType.MESSAGE: {
                    const channel: GuildChannel = arg.pointer !== undefined ? parsedArgs[arg.pointer] as GuildChannel : message.channel as GuildChannel
                    
                    if (!channel.isText() && !channel.isThread()) return reject(RejectionType.TYPE)

                    const msg = await channel.messages.fetch(current).catch(noop)

                    if (!msg) return reject(RejectionType.TYPE)

                    data = msg 
                    break
                }
            }
        }

        return parsedArgs as unknown as T 
    }

    async reject(
        client: NekoClient,
        message: Message,
        arg: ArgData,
        extras: ExtrasData<K>,
        input: string | undefined,
        type: RejectionType
    ): Promise<false> {

        return false
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
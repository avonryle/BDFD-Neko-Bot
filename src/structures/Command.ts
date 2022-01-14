import { capture, ParsedContentData } from "arg-capturer";
import { GuildChannel, Message, MessageEmbed } from "discord.js";
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
import { toPlural } from "../functions/toPlural";
import toTitleCase from "../functions/toTitleCase";
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

        const args = await command.parseArgs(client, message, capturedArgs, extras)

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

            parsedArgs.push(data)
        }

        return parsedArgs as unknown as T 
    }

    async usage(client: NekoClient, message: Message, extras: ExtrasData<K>): Promise<string[]> {
        if (!this.data.args?.length) return []

        const args = new Array<ArgData>()

        let x = -1

        for (let i = 0, len = this.data.args.length;i < len;i++) {
            const raw = this.data.args[i]
            const arg = typeof raw === 'function' ? await raw.call(client, message) : raw

            args.push(arg)
            if (!arg.required && x === -1) {
                x = i
            }
        }

        if (x === -1) {
            return [
                `${extras.prefix}${extras.commandString} ${args.map(c => `<${c.name}>`).join(' ')}`
            ]
        }

        const parsed = new Array<string>(
            `${extras.prefix}${extras.commandString} ${args.slice(0, x).map(c => `<${c.name}>`).join(' ')}`
        )

        const optional = args.slice(x)

        for (let i = 0, len = optional.length;i < len;i++) {
            const total = args.slice(0, i + x)

            parsed.push(`${extras.prefix}${extras.commandString} ${args.map(c => c.required ? `<${c.name}>` : `[${c.name}]`).join(' ')}`)
        }

        return parsed 
    }

    async reject(
        client: NekoClient,
        message: Message,
        arg: ArgData,
        extras: ExtrasData<K>,
        input: string | undefined,
        type: RejectionType
    ): Promise<false> {
        const embed = new MessageEmbed()
        .setColor('RED')
        .setAuthor({
            name: message.author.tag,
            iconURL: message.member?.displayAvatarURL({ dynamic: true })
        })
        .setTimestamp()
        .setTitle(`Argument Error`)

        embed.setDescription(
            type === RejectionType.CHOICE ? `Given input does not match any of the choices that \`${arg.name}\` provides.` :
            type === RejectionType.EMPTY ? `No input was given for argument \`${arg.name}\`.` :
            type === RejectionType.RANGE ? `Given input is not in the range of the argument \`${arg.name}\`.` :
            type === RejectionType.REGEX ? `Given input does not match the provided regexes by \`${arg.name}\`.` :
            type === RejectionType.TYPE ? `Given input does not match the type of \`${arg.type}\`.` : "none"
        )

        const usage = await this.usage(client, message, extras)

        embed.addField(`Given`, input || 'None')
        .addField(`Expected`, toTitleCase(typeof arg.type === 'number' ? ArgType[arg.type] : arg.type))
        
        if (arg.min !== undefined || arg.max !== undefined) {
            const isTime = arg.type === ArgType.TIME || arg.type === 'TIME'

            embed.addField(`Range`, `${
                arg.min ? isTime ? client.manager.parser.parseToString(arg.min, { limit: 1 }) : arg.min.toLocaleString() : '?'
            } - ${
                arg.max ? isTime ? client.manager.parser.parseToString(arg.max, { limit: 1 }) : arg.max.toLocaleString() : '?'
            }`)
        }

        if (arg.regexes?.length) {
            embed.addField(`Regexes`, arg.regexes.map(c => `\`${c.source}\``).join(', '))
        }

        if (arg.choices?.length) {
            embed.addField('Choices', arg.choices.map(c => `\`${c.name}\``).join(', '))
        } 

        if (usage.length) {
            embed.addField(`Command ${toPlural(`Usage`, usage.length)}`, `\`\`\`\n${usage.join('\n')}\`\`\``)
        }

        if (arg.pointer) {
            embed.addField(`Pointed Argument`, arg.pointer.toLocaleString())
        }

        message.channel.send({
            embeds: [
                embed
            ]
        })
        .catch(noop)

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
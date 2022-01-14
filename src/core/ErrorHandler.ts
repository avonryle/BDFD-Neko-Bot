import chalk from "chalk";
import { TextBasedChannel } from "discord.js";
import cast from "../functions/cast";
import noop from "../functions/noop";
import option from "../functions/option";
import { Option } from "../typings/types/Option";
import { UnknownMethod } from "../typings/types/UnknownMethod";

export class ErrorHandler<T  extends UnknownMethod> {
    #func: T 
    #channel = option<TextBasedChannel>()
    #name = option<string>()

    constructor(fn: T, channel?: Option<TextBasedChannel>) {
        this.#func = fn     
        this.setChannel(channel)
    }

    setChannel(c?: Option<TextBasedChannel>) {
        if (c) {
            this.#channel = c
        }
        return this
    }

    setName(name: Option<string>) {
        this.#name = name
        return this
    }

    get name() {
        return this.#func.name || this.#name
    }
    
    commandName(thisArg: any): Option<string> {
        return thisArg?.data?.name ?? null 
    }

    #handle(thisArg: any, error: Error): null {
        const cmdName = this.commandName(thisArg)
        const cons = thisArg === null ? null : thisArg?.constructor.name === 'Function' ? null : thisArg?.constructor.name  ?? null

        if (!this.#channel) {
            console.error(`${chalk.red.bold(`[ERROR HANDLER]`)} => ${chalk.yellow.bold(error.message)} from ${cons ? chalk.blue.bold(`${cons}#`) : ''}${chalk.magenta.bold(this.name)} ${this.name}${cmdName ? `( ${chalk.magenta.bold(cmdName)})` : ''}.`)
        } else {
            this.#channel.send({
                content: `[ERROR HANDLER] => ${error.message} from ${cons ? `${cons}#` : ''}${this.name}${cmdName ? ` (${cmdName})` : ''}`
            }).catch(noop)
        }
        
        return null
    }

    run(thisArg: ThisParameterType<T>, ...args: Parameters<T>): Option<ReturnType<T>> {
        try {
            return cast(this.#func.call(thisArg, ...args))
        } catch (error: any) {
            return this.#handle(thisArg, error)
        }
    }

    static wrap<T extends UnknownMethod>(fn: T, channel?: Option<TextBasedChannel>) {
        return new ErrorHandler(fn, channel)
    }

    async runAsync(...args: Parameters<ErrorHandler<T>["run"]>): Promise<Option<Awaited<PromiseLike<ReturnType<T>>>>> {
        try {
            return await cast(this.#func.call(...args))
        } catch (error: any) {
            return this.#handle(args[0], error)
        }
    }
}
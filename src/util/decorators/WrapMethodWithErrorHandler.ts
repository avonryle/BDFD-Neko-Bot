import { Message } from "discord.js"
import { ErrorHandler } from "../../core/ErrorHandler"
import { Option } from "../../typings/types/Option"
import { UnknownMethod } from "../../typings/types/UnknownMethod"

function findMessage(channel: boolean, args: unknown[]): Option<Message> {
    if (!channel) return null
    for (let i = 0, len = args.length;i < len;i++) {
        const arg = args[i]
        if (arg instanceof Message) {
            return arg
        }
    }
    return null
}
export function WrapMethodWithErrorHandler(channel = false) {
    return function(target: any, property: string, descriptor: PropertyDescriptor) {
        const fn = descriptor.value! as UnknownMethod

        descriptor.value = function(this: any, ...args: unknown[]) {
            return ErrorHandler.wrap(fn, findMessage(channel, args)?.channel).run(this, ...args)
        }
    }
}

export function WrapAsyncMethodWithErrorHandler(channel = false) {
    return function(target: any, property: string, descriptor: PropertyDescriptor) {
        const fn = descriptor.value! as UnknownMethod

        descriptor.value = async function(this: any, ...args: unknown[]) {
            return await ErrorHandler.wrap(fn, findMessage(channel, args)?.channel).runAsync(this, ...args)
        }
    }
}
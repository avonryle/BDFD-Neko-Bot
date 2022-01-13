import { ErrorHandler } from "../../core/ErrorHandler"
import { UnknownMethod } from "../../typings/types/UnknownMethod"

export function WrapMethodWithErrorHandler() {
    return function(target: any, property: string, descriptor: PropertyDescriptor) {
        const fn = descriptor.value! as UnknownMethod

        descriptor.value = function(this: any, ...args: unknown[]) {
            return ErrorHandler.wrap(fn).run(this, ...args)
        }
    }
}

export function WrapAsyncMethodWithErrorHandler() {
    return function(target: any, property: string, descriptor: PropertyDescriptor) {
        const fn = descriptor.value! as UnknownMethod

        descriptor.value = async function(this: any, ...args: unknown[]) {
            return await ErrorHandler.wrap(fn).runAsync(this, ...args)
        }
    }
}
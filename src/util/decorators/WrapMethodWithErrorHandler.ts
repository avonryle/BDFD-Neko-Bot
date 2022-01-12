import { ErrorHandler } from "../../core/ErrorHandler"
import { UnknownMethod } from "../../typings/types/UnknownMethod"

export default function() {
    return function(target: any, property: string, descriptor: PropertyDescriptor) {
        const fn = descriptor.value! as UnknownMethod

        descriptor.value = function(this: any, ...args: unknown[]) {
            return ErrorHandler.wrap(fn).run(this, ...args)
        }
    }
}
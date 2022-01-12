import cast from "../functions/cast";
import { Option } from "../typings/types/Option";
import { UnknownMethod } from "../typings/types/UnknownMethod";

export class ErrorHandler<T  extends UnknownMethod> {
    #func: T 

    constructor(fn: T) {
        this.#func = fn     
    }

    #handle(error: Error): null {
        
        return null
    }

    run(thisArg: ThisParameterType<T>, ...args: Parameters<T>): Option<ReturnType<T>> {
        try {
            return cast(this.#func.call(thisArg, ...args))
        } catch (error: any) {
            return this.#handle(error)
        }
    }

    static wrap<T extends UnknownMethod>(fn: T) {
        return new ErrorHandler(fn)
    }

    async runAsync(...args: Parameters<ErrorHandler<T>["run"]>): Promise<Option<Awaited<PromiseLike<ReturnType<T>>>>> {
        try {
            return await cast(this.#func.call(...args))
        } catch (error: any) {
            return this.#handle(error)
        }
    }
}
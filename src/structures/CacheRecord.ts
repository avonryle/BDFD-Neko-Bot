import cast from "../functions/cast";
import { Option } from "../typings/types/Option";

export class CacheRecord<T> {
    #cache: Record<keyof T, T[any]> = cast({})

    constructor() {}

    get<K extends keyof T>(key: K): Option<T[K]> {
        return this.#cache[key] ?? null
    }

    delete<K extends keyof T>(key: K): this {
        delete this.#cache[key]
        return this
    }

    keys(): Array<keyof T> {
        return Object.keys(this.#cache) as Array<keyof T>
    }

    ensure<K extends keyof T>(key: K, or: () => T[K]): T[K] {
        const value = this.get(key)
        if (value === null) {
            const ref = or()
            this.set(key, ref)
            return ref
        }
        return value
    }

    set<K extends keyof T>(key: K, value: T[K]): this {
        this.#cache[key] = value
        return this
    }
}
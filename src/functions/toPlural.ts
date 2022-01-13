import { If } from "discord.js";
import cast from "./cast";

export function toPlural<T extends string, V extends number>(str: T, amount: V): If<V extends 1 ? true : false, `${T}`, `${T}s`> {
    return cast(amount === 1 ? str : `${str}s`)
}

export function toPluralOr<T extends string, V extends number, S extends string>(str: T, amount: V, other: S): If<V extends 1 ? true : false, `${T}`, `${S}`> {
    return cast(amount === 1 ? str : other)
}

export function toPluralWithOr<T extends string, V extends number, S extends string>(str: T, amount: V, other: S): If<V extends 1 ? true : false, `${V} ${T}`, `${V} ${S}`> {
    return cast(amount === 1 ? str : other)
}

export function toPluralWith<T extends string, V extends number>(str: T, amount: V): If<V extends 1 ? true : false, `${V} ${T}`, `${V} ${T}s`> {
    return cast(amount === 1 ? `${amount} ${str}` : `${amount} ${str}s`)
}
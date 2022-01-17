import { LavaEvents } from "lavacoffee";
import { NekoClient } from "../core/NekoClient";
import { Async } from "../typings/types/Async";

export type Event<T extends keyof LavaEvents> = (this: NekoClient, ...args: Parameters<LavaEvents[T]>) => Async<void>

export default function<T extends keyof LavaEvents>(k: T, l: Event<T>): Event<T> {
    return l
}

import { ParsedContentData } from "arg-capturer";
import { Message } from "discord.js";
import { NekoClient } from "../core/NekoClient";
import { CommandData } from "../typings/interfaces/CommandData";
import { ExtrasData } from "../typings/interfaces/ExtrasData";
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
}
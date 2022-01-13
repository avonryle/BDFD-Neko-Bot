import { ParsedContentData } from "arg-capturer";
import { Message } from "discord.js";
import { NekoClient } from "../../core/NekoClient";
import { ExtrasData } from "../interfaces/ExtrasData";
import { Async } from "./Async";

export type Executor<T = unknown[], K extends ParsedContentData["flags"] = ParsedContentData["flags"]> = (this: NekoClient, message: Message, args: T, extras: ExtrasData<K>) => Async<void>
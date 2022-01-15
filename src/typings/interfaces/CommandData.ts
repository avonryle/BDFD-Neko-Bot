import { ParsedContentData } from "arg-capturer"
import { Arg } from "../types/Arg"
import { Executor } from "../types/Executor"

export interface CommandData<T = unknown[], K extends ParsedContentData["flags"] = ParsedContentData["flags"]> {
    name: string
    description: string
    category?: string
    capturing?: boolean
    dmOnly?: boolean
    aliases?: string[]
    roles?: string[]
    owner?: boolean
    args?: Arg[]
    execute: Executor<T, K>
}
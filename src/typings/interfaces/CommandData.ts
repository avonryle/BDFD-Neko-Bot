import { ParsedContentData } from "arg-capturer"
import { Arg } from "../types/Arg"
import { Executor } from "../types/Executor"

export interface CommandData<T = unknown[], K extends ParsedContentData["flags"] = ParsedContentData["flags"]> {
    name: string
    description: string
    category?: string
    capturing?: boolean
    staff?: boolean
    dmOnly?: boolean
    aliases?: string[]
    owner?: boolean
    moderator?: boolean
    leadStaff?: boolean
    args?: Arg[]
    execute: Executor<T, K>
}
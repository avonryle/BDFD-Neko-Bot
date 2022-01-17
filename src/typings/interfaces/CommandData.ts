import { ParsedContentData } from "arg-capturer"
import { PermissionString } from "discord.js"
import { PlayerState } from "../enums/PlayerState"
import { Arg } from "../types/Arg"
import { Executor } from "../types/Executor"

export interface CommandData<T = unknown[], K extends ParsedContentData["flags"] = ParsedContentData["flags"]> {
    name: string
    description: string
    category?: string
    capturing?: boolean
    dmOnly?: boolean
    botInVoice?: boolean
    states?: PlayerState[]
    userInVoice?: boolean
    ignoreIfNoVoice?: boolean
    sameVoice?: boolean
    aliases?: string[]
    roles?: string[]
    owner?: boolean
    permissions?: PermissionString[]
    args?: Arg[]
    execute: Executor<T, K>
}
import { ArgTypes } from "../types/ArgTypes"

export interface ArgData {
    name: string
    type: ArgTypes
    required?: boolean
    regexes?: RegExp[]
    choices?: unknown[]
    min?: number
    max?: number
}
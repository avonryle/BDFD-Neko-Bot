import { ArgTypes } from "../types/ArgTypes"
import { ChoiceData } from "./ChoiceData"

export interface ArgData {
    name: string
    type: ArgTypes
    required?: boolean
    regexes?: RegExp[]
    pointer?: number
    choices?: ChoiceData[]
    allow?: string[]
    min?: number
    example?: string
    max?: number
}
import { ParsedContentData } from "arg-capturer";

export interface ExtrasData<K extends ParsedContentData["flags"]> {
    flags: K
    commandString: string
    prefix: string
}
import { Option } from "../typings/types/Option";

export default function(str: string): Option<string> {
    if (!str.includes("-")) return null
    return str.split('-').map(c => c[0]).join('')
}
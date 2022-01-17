import { Option } from "../typings/types/Option"

const REGEX = /https?:\/\/discord\.com\/api\/webhooks\/(\d+)\/(.*)/

export default function(url: string): Option<{
    id: string
    token: string
}> {
    const data = REGEX.exec(url)

    if (!data) return null

    return {
        id: data[1],
        token: data[2]
    }
}
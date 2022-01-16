import { LinkExtractorResult } from "../typings/interfaces/LinkExtratorResult"
import { SafeLinks } from "../util/constants/SafeLinks"

const regex = /(https?:\/\/)?(www\.)?([-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,4})\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g

export default function(content: string): LinkExtractorResult[] {
    const iterator = Array.from(content.matchAll(regex))

    const data = new Array<LinkExtractorResult>()

    for (let i = 0, len = iterator.length;i < len;i++) {
        const it = iterator[i]

        const d: LinkExtractorResult = {
            domain: it[3],
            url: it[0]
        }

        if (SafeLinks.some(c => d.domain === c)) {
            continue
        }

        data.push(d)
    }

    return data
}
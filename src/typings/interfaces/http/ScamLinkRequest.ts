import { ScamLinkType } from "../../enums/http/ScamLinkType"

export interface ScamLinkRequest {
    status: number
    result: ScamLinkType
}
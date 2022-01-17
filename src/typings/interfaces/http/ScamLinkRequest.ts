import { ScamLinkType } from "../../enums/ScamLinkType";

export interface ScamLinkRequest {
    result: ScamLinkType
    linkFound?: string
    status: number
}
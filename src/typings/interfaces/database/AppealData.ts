import { PunishmentType } from "../../enums/PunishmentType"

export interface AppealData {
    user_id: string
    reason: string
    type: PunishmentType
}
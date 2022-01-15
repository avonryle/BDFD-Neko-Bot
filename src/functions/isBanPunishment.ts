import { PunishmentType } from "../typings/enums/PunishmentType";

export default function(type: PunishmentType) {
    return type === PunishmentType.TEMPORARY_BAN || type === PunishmentType.BAN
}
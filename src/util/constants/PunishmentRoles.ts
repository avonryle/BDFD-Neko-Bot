import { PunishmentType } from "../../typings/enums/PunishmentType";

export const PunishmentRoles: Record<Exclude<keyof typeof PunishmentType, 'BAN' | 'WARN' | 'TEMPORARY_BAN'>, string> = {
    NO_EVENTS: '813185958324994048',
    NO_BOT_SHARING: '596510072633557002',
    NO_POINTS: '791090367851528206',
    NO_POINTS_FROM_VC: '791090448898195486',
    NO_SUPPORT: '596468976792502274',
    NO_WIKI: '596496976217112578',
    MUTE: '567747396952391690'
}
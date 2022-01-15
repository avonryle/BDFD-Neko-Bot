import isNumber from "../../functions/isNumber";
import snakeToTitle from "../../functions/snakeToTitle";
import { PunishmentType } from "../../typings/enums/PunishmentType";
import { ChoiceData } from "../../typings/interfaces/ChoiceData";

export const Punishments: ChoiceData[] = Object.keys(PunishmentType).filter(c => !isNumber(c)).map(d => {
    return {
        name: snakeToTitle(d),
        value: PunishmentType[d as keyof typeof PunishmentType]
    }
})
import { Column } from "dbdts.db";
import { AppealData } from "./AppealData";
import { GiveawayData } from "./GiveawayData";
import { NicknameRequestData } from "./NicknameRequestData";

export interface DatabaseInterface {
    nicknames: Record<keyof NicknameRequestData, Column>
    appeals: Record<keyof AppealData, Column>
    giveaways: Record<keyof GiveawayData, Column>
}
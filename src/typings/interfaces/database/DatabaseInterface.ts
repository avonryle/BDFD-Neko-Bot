import { Column } from "dbdts.db";
import { NicknameRequestData } from "./NicknameRequestData";

export interface DatabaseInterface {
    nicknames: Record<keyof NicknameRequestData, Column>
}
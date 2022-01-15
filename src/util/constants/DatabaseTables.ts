import { Column } from "dbdts.db";
import { DatabaseInterface } from "../../typings/interfaces/database/DatabaseInterface";

export const DatabaseTables: DatabaseInterface = {
    nicknames: {
        user_id: new Column()
        .setName('user_id')
        .setPrimary(true)
        .setType('TEXT'),
        nickname: new Column()
        .setName('nickname')
        .setType('TEXT')
    }
}
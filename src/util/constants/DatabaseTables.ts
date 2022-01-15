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
    },

    appeals: {
        user_id: new Column()
        .setName('user_id')
        .setPrimary(true)
        .setType('TEXT'),
        reason: new Column()
        .setName('reason')
        .setType('TEXT'),
        type: new Column()
        .setType('INTEGER')
        .setName('type')
    }
}
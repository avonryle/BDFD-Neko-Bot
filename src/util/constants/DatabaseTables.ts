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

    giveaways: {
        user_id: new Column()
        .setName('user_id')
        .setType('TEXT'),

        title: new Column()
        .setName('title')
        .setType('TEXT'),

        guild_id: new Column()
        .setName('guild_id')
        .setType('TEXT'),

        message_id: new Column()
        .setName('message_id')
        .setPrimary(true)
        .setType('TEXT'),

        channel_id: new Column()
        .setName('channel_id')
        .setType('TEXT'),

        winner_count: new Column()
        .setName('winner_count')
        .setType('INTEGER'),

        participants: new Column()
        .setName('participants')
        .setType('JSON'),

        ended: new Column()
        .setType('BOOLEAN')
        .setName('ended'),

        ends_at: new Column()
        .setName('ends_at')
        .setType('INTEGER')
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
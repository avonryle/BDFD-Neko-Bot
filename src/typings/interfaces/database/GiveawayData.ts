import { If } from "dbdts.db"

export interface GiveawayData<T extends boolean = boolean> {
    winner_count: number
    ends_at: number
    title: string
    user_id: string
    guild_id: string
    message_id: If<T, string, null>
    channel_id: string
    ended: boolean
    participants: string[]
}
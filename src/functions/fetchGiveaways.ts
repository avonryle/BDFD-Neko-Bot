import { NekoClient } from "../core/NekoClient";
import { Giveaway } from "../structures/Giveaway";
import { GiveawayData } from "../typings/interfaces/database/GiveawayData";

export default function(client: NekoClient) {
    const gws = client.db.all("giveaways") as unknown as GiveawayData[]

    for (let i = 0, len = gws.length;i < len; i++) {
        const gw = new Giveaway(client, gws[i])

        client.manager.giveaways.set(gw.data.message_id, gw)

        gw.continue()
    }
}
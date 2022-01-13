import { NekoClient } from "./NekoClient";

export class NekoManager {
    client: NekoClient

    constructor(client: NekoClient) {
        this.client = client
    }
}
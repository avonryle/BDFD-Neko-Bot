import { Client, ClientOptions } from "discord.js";
import { BuildType } from "../typings/enums/BuildType";
import config from "../config.json"

export class NekoClient extends Client {
    #mode!: BuildType
    
    constructor(options: ClientOptions) {
        super(options)
    }

    get mode() {
        return this.#mode
    }

    get build() {
        return this.config[this.#mode]
    }

    get config() {
        return config
    }
    
    init(mode: BuildType) {
        this.#mode = mode
    }
}
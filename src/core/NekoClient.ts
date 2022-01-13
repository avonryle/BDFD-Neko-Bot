import { Client, ClientOptions, User } from "discord.js";
import { BuildType } from "../typings/enums/BuildType";
import config from "../config.json"
import { WrapAsyncMethodWithErrorHandler } from "../util/decorators/WrapMethodWithErrorHandler";
import { NekoManager } from "./NekoManager";

export class NekoClient extends Client<true> {
    #mode!: BuildType
    manager = new NekoManager(this)

    constructor(options: ClientOptions) {
        super(options)
    }

    get mode() {
        return this.#mode
    }

    get prefixes() {
        return this.cache.ensure("prefixes", () => [
            ...this.config.prefixes,
            this.user.toString(),
            this.user.toString().replace('@', '@!')
        ])
    }

    get cache() {
        return this.manager.cache
    }

    async fetchOwners(): Promise<string[]> {
        if (this.application.owner === null) {
            await this.application.fetch()
            return this.fetchOwners()
        }
        const data = this.application.owner

        if (data instanceof User) {
            return [ data.id ]
        } else {
            return data.members.map(c => c.id)
        }
    }

    get build() {
        return this.config[this.#mode]
    }

    get config() {
        return config
    }
    
    @WrapAsyncMethodWithErrorHandler()
    async init(mode: BuildType) {
        this.#mode = mode

        await this.login(this.build.token)
    }
}
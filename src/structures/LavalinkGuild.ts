import { GuildMember, GuildTextBasedChannel, Message } from "discord.js";
import { CoffeeTrack } from "lavacoffee";
import { FilterUtils, LoadTypes, LoopMode, SearchResult } from "lavacoffee/dist/utils";
import { ErrorHandler } from "../core/ErrorHandler";
import { NekoManager } from "../core/NekoManager";
import noop from "../functions/noop";
import option from "../functions/option";
import { PlayerState } from "../typings/enums/PlayerState";

export class LavalinkGuild {
    queue = new Array<CoffeeTrack>()
    loop: LoopMode = LoopMode.None
    volume = 100
    filters = new FilterUtils({})

    guildID: string
    voiceID = option<string>()

    message = option<Message>()

    current = 0
    state: PlayerState = PlayerState.IDLE

    channel = option<GuildTextBasedChannel>()

    manager: NekoManager

    constructor(manager: NekoManager, id: string) {
        this.guildID = id
        this.manager = manager
    }

    get guild() {
        return this.manager.client.guilds.cache.get(this.guildID)!
    }

    isBotInVoice() {
        return this.player.options.voiceID !== undefined && this.guild.me !== null && this.guild.me.voice.channelId === this.player.options.voiceID
    }

    isUserWithBot(member: GuildMember) {
        return this.isBotInVoice() && member.voice.channelId === this.guild.me?.voice.channelId
    }

    get player() {
        return this.manager.lavalink.create({
            guildID: this.guildID
        })
    }

    setVoiceID(id: string) {
        this.player.options.voiceID = id
        return this
    }

    join() {
        if (!this.player.options.voiceID) return false

        if (this.voiceID !== this.player.options.voiceID) {
            this.voiceID = this.player.options.voiceID
            return this.player.connect()
        }

        if (!this.player.voiceConnected) {
            return this.player.connect()
        }
    }

    isPlaying() {
        return this.state === PlayerState.PLAYING
    }

    isIdle() {
        return this.state === PlayerState.IDLE
    }

    isPaused() {
        return this.state === PlayerState.PAUSED
    }

    destroy() {
        this.player.destroy()
        this.manager.guilds.delete(this.guildID)
    }
    
    next() {
        return this.queue[++this.current]
    }

    notify(options: Parameters<GuildTextBasedChannel["send"]>[0]) {
        return this.channel?.send(options).catch(noop)
    }

    play(): boolean {
        if (!this.isIdle() || !this.queue[this.current]) return false

        this.player.queue.add(this.queue[this.current])
        this.player.play({})

        return true
    }

    set<K extends keyof this>(k: K, value: this[K]): this {
        this[k] = value
        return this
    }

    back() {
        return this.queue[this.current ? --this.current : 0] 
    }

    add(data: SearchResult | CoffeeTrack): string {
        if (data instanceof CoffeeTrack) {
            this.queue.push(data)
            return data.title
        }

        if (data.loadType === LoadTypes.PlaylistLoaded) {
            this.queue.push(...data.tracks)
            return `${data.playlist?.name} (${data.tracks.length} tracks)`
        } else {
            return this.add(data.tracks[0])
        }
    }

    get track(): CoffeeTrack | null {
        return this.queue[this.current] ?? null
    }
}
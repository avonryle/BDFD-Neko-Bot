import { Message } from "discord.js";
import { NekoClient } from "../../core/NekoClient";
import { ArgData } from "../interfaces/ArgData";
import { Async } from "./Async";

export type Arg = ArgData | ((this: NekoClient, message: Message) => Async<ArgData>)
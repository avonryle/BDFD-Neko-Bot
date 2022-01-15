import { Message } from "discord.js";
import noop from "./noop";

export default function(message: Message, timeout = 2_500) {
    setTimeout(() => {
        message.delete().catch(noop)
    }, timeout);
}
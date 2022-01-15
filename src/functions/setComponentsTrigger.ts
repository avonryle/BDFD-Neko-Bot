import { MessageButton, MessageComponent } from "discord.js";

export default function(components: MessageComponent[], type = false) {
    return components.map(c => (c as MessageButton).setDisabled(type))
}
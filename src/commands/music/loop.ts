import { LoopMode } from "lavacoffee/dist/utils";
import isNumber from "../../functions/isNumber";
import noop from "../../functions/noop";
import { Command } from "../../structures/Command";

export default new Command<[
    LoopMode
]>({
    name: 'loop',
    description: 'sets loop mode.',
    sameVoice: true,
    args: [
        {
            name: 'mode',
            type: 'STRING',
            required: true,
            choices: Object.keys(LoopMode).filter(c => !isNumber(c)).map(x => ({
                name: x,
                value: LoopMode[x as keyof typeof LoopMode]
            }))
        }
    ],
    userInVoice: true,
    execute: async function(message, [ mode ]) {
        this.manager.guild(message.guildId!).loop = mode
        
        message.react('✅')
        .catch(noop)
    }
})
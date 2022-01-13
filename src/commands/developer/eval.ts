import { Command } from "../../structures/Command";

export default new Command<[
    string
]>({
    name: 'eval',
    description: 'evals given code.',
    args: [
        {
            name: 'code',
            required: true,
            type: 'STRING'
        }
    ],
    execute: async function(message, [ code ]) {
        
    }
})
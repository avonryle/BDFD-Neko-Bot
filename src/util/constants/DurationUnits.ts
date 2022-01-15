import { TimeUnit } from "ms-utility/dist/typings/interfaces/TimeUnit";

export default [
    [
        'w',
        {
            letter: 'w',
            word: 'week',
            ms: 86_400_000 * 7
        }
    ],
    [
        "d",
        {
            letter: 'd',
            word: 'day',
            ms: 86_400_000
        }
    ],
    [
        'm',
        {
            letter: 'm',
            word: 'minute',
            ms: 60_000,
            aliases: [
                'min'
            ]
        }
    ],
    [    
        's',
        {
            letter: 's',
            word: 'second',
            ms: 1_000,
            aliases: [
                'sec'
            ]
        }
    ],
    [
        'h',
        {
            letter: 'h',
            word: 'hour',
            ms: 3_600_000
        }
    ]
] as [string, TimeUnit][]
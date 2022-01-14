import { TimeUnit } from "ms-utility/dist/typings/interfaces/TimeUnit";

export default [
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
            ms: 60_000
        }
    ],
    [    
        's',
        {
            letter: 's',
            word: 'second',
            ms: 1_000
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
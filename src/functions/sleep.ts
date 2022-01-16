import { setTimeout } from "timers/promises"

export const INT32_MAX: number = ((1 << 31) >>> 0) - 1

export default async function sleep(ms: number): Promise<void> {
    if (ms > INT32_MAX) {
        return sleep(INT32_MAX).then(() => sleep(ms - INT32_MAX))
    }
    return setTimeout(ms)
}
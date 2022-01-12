import { ErrorHandler } from "../core/ErrorHandler"

const fn = async (e: boolean) => {
    throw new Error("bro")
    return 0
}

const handler = new ErrorHandler(fn)

handler.runAsync(null, true)
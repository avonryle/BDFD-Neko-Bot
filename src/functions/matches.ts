export default function(str: string, regexes: RegExp[] = []): boolean {
    return regexes.every(c => c.test(str))
}
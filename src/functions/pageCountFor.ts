export default function(amount: number, total: number) {
    const pages = Math.trunc(total / amount) + 1
    return total % amount === 0 ? pages - 1 : pages
}
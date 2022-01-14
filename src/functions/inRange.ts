export default function(amount: number, min?: number, max?: number): boolean {
    if (min !== undefined && amount < min) return false

    if (max !== undefined && amount > max) return false
    
    return true
}
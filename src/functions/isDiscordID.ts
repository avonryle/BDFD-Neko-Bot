export default function(id: string) {
    return /(\d{17,20})/.test(id)
}
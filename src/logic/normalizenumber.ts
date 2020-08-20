export const normalizeNumber = (value: number, from: number, to: number): number => {
    if (value < from) {
        return from
    }
    if (value > to) {
        return to
    }
    return value
}

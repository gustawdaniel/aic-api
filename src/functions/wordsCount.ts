export function wordsCount(str: string): number {
    return str.split(' ')
        .filter(function(n) { return n != '' })
        .length;
}

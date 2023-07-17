import { DecoratedKata } from "./types";

export function sortDecoratedKatas(ks: DecoratedKata[]): DecoratedKata[] {
    function compareTitles(a: DecoratedKata, b: DecoratedKata): -1 | 1 | 0 {
        const an = a.kata.name.toLowerCase();
        const bn = b.kata.name.toLowerCase();
        if (an < bn) {
            return -1;
        }
        if (an > bn) {
            return 1;
        }
        return 0;
    }
    function compareDifficulties(
        a: DecoratedKata,
        b: DecoratedKata
    ): -1 | 1 | 0 {
        const da = parseInt((a.kata.difficulty ?? "0").split(" ")[0]);
        const db = parseInt((b.kata.difficulty ?? "0").split(" ")[0]);

        if (da < db) {
            return -1;
        }
        if (da > db) {
            return 1;
        }
        return compareTitles(a, b);
    }
    return [...ks].sort(compareDifficulties);
}

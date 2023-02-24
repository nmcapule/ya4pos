import { UnitConversion } from "@/models/index.ts";

/**
 * Calculates the multiplier from unit id `from` into unit id `into`. Tries
 * to find the shortest connected path from `from` into `into`, using the
 * inputted conversions list.
 */
export function multiplierOf(
    conversions: UnitConversion[],
    from: string,
    into: string
): number {
    // Short-circuit if from === into.
    if (from === into) {
        return 1;
    }

    // Build a full two-way lookup table of unit conversions.
    const lookup = conversions.reduce((acc, curr) => {
        acc.set(
            curr.from!,
            (acc.get(curr.from!) || new Map<string, number>()).set(
                curr.into!,
                curr.multiplier!
            )
        );
        acc.set(
            curr.into!,
            (acc.get(curr.into!) || new Map<string, number>()).set(
                curr.from!,
                1 / curr.multiplier!
            )
        );
        return acc;
    }, new Map<string, Map<string, number>>());

    // Do a BFS to find path from `from` into `into`.
    const backtrack = new Map<string, string>();
    const visited = new Set<string>();
    let queue = [from];
    bfs: while (queue.length > 0) {
        for (const curr of queue) {
            visited.add(curr);

            if (curr === into) {
                break bfs;
            }

            queue = Array.from(lookup.get(curr)?.keys() || []).filter(
                (next) => !visited.has(next)
            );
            for (const next of queue) {
                backtrack.set(next, curr);
            }
        }
    }
    // Calculate the stacked multiplier if a conversion path is found.
    if (!backtrack.has(into)) {
        throw "no conversion found";
    }
    let multiplier = 1;
    let curr = into;
    while (backtrack.has(curr)) {
        const prev = backtrack.get(curr)!;
        multiplier *= lookup.get(prev)?.get(curr) || 0;
        curr = prev;
    }
    return multiplier;
}

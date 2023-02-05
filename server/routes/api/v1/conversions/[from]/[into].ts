import { HandlerContext, PageProps } from "$fresh/server.ts";
import type PocketBase from "pocketbase";

/** JSON structure of conversion schema. */
interface Conversion {
    from_unit_id: string;
    multiplier: number;
    into_unit_id: string;
}

/**
 * Calculates the multiplier from unit id `from` into unit id `into`. Tries
 * to find the shortest connected path from `from` into `into`, using the
 * inputted conversions list.
 */
function multiplierOf(
    conversions: Conversion[],
    from: string,
    into: string
): number {
    // Build a full two-way lookup table of unit conversions.
    const lookup = conversions.reduce((acc, curr) => {
        acc.set(
            curr.from_unit_id,
            (acc.get(curr.from_unit_id) || new Map<string, number>()).set(
                curr.into_unit_id,
                curr.multiplier
            )
        );
        acc.set(
            curr.into_unit_id,
            (acc.get(curr.into_unit_id) || new Map<string, number>()).set(
                curr.from_unit_id,
                1 / curr.multiplier
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

export const handler = async (
    _req: Request,
    ctx: HandlerContext<PageProps, { pb: PocketBase }>
): Promise<Response> => {
    const { from, into } = ctx.params;
    const conversions: Conversion[] = await ctx.state.pb
        .collection("unit_conversions")
        .getFullList();
    try {
        const conversion: Conversion = {
            from_unit_id: from,
            into_unit_id: into,
            multiplier: multiplierOf(conversions, from, into),
        };
        return new Response(JSON.stringify(conversion));
    } catch (e) {
        return new Response(e, { status: 400 });
    }
};

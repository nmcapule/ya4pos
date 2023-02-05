import { HandlerContext, PageProps } from "$fresh/server.ts";
import type PocketBase from "pocketbase";

/** JSON structure of conversion schema. */
interface Conversion {
    from_unit_id: string;
    multiplier: number;
    into_unit_id: string;
}

export const handler = async (
    _req: Request,
    ctx: HandlerContext<PageProps, { pb: PocketBase }>
) => {
    const { from, into } = ctx.params;
    const conversions: Conversion[] = await ctx.state.pb
        .collection("unit_conversions")
        .getFullList();

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
    // Build the BFS path if found.
    if (!backtrack.has(into)) {
        return new Response("no conversion found", { status: 400 });
    }
    let multiplier = 1;
    let curr = into;
    while (backtrack.has(curr)) {
        const prev = backtrack.get(curr)!;
        multiplier *= lookup.get(prev)?.get(curr) || 0;
        curr = prev;
    }
    // Build virtual conversion object.
    const conversion: Conversion = {
        from_unit_id: from,
        into_unit_id: into,
        multiplier: multiplier,
    };
    return new Response(JSON.stringify(conversion));
};

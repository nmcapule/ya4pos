import type { HandlerContext } from "$fresh/server.ts";
import type PocketBase from "pocketbase";
import { PocketBaseModels } from "@/models/index.ts";

export const handler = async (
    _req: Request,
    ctx: HandlerContext<void, { pb: PocketBase }>
) => {
    const res = await ctx.state.pb
        .collection(PocketBaseModels.WAREHOUSES)
        .getFullList();
    return new Response(JSON.stringify(res));
};

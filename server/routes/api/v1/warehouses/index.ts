import { HandlerContext } from "$fresh/server.ts";
import type PocketBase from "pocketbase";

export const handler = async (
    _req: Request,
    ctx: HandlerContext<void, { pb: PocketBase }>
) => {
    const res = await ctx.state.pb.collection("warehouses").getFullList();
    return new Response(JSON.stringify(res));
};

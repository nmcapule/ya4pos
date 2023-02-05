import type { HandlerContext } from "$fresh/server.ts";
import type PocketBase from "pocketbase";
import { PocketBaseModel } from "@/models/index.ts";
import { searchParamsAsJSON } from "@/utils/pocketbase.ts";

export const handler = async (
    req: Request,
    ctx: HandlerContext<void, { pb: PocketBase }>
) => {
    // Override filters to add `warehouse_id` by default.
    const url = new URL(req.url);
    let filter = `warehouse_id="${ctx.params.id}"`;
    if (url.searchParams.get("filter")) {
        filter = `${filter} && (${url.searchParams.get("filter")})`;
    }
    url.searchParams.set("filter", filter);

    const res = await ctx.state.pb
        .collection(PocketBaseModel.WAREHOUSE_STOCKS)
        .getFullList(null, searchParamsAsJSON(url.searchParams));
    return new Response(JSON.stringify(res));
};

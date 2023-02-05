import type { Handlers, HandlerContext, PageProps } from "$fresh/server.ts";
import type PocketBase from "pocketbase";
import { PocketBaseModels } from "@/models/index.ts";

export const handler: Handlers<unknown, { pb: PocketBase }> = {
    async GET(
        _req: Request,
        ctx: HandlerContext<PageProps, { pb: PocketBase }>
    ) {
        const { id } = ctx.params;
        const res = await ctx.state.pb
            .collection(PocketBaseModels.WAREHOUSES)
            .getOne(id);
        return new Response(JSON.stringify(res));
    },
    async PUT(
        req: Request,
        ctx: HandlerContext<PageProps, { pb: PocketBase }>
    ) {
        const { id } = ctx.params;
        const res = await ctx.state.pb
            .collection(PocketBaseModels.WAREHOUSES)
            .update(id, await req.json());
        return new Response(JSON.stringify(res));
    },
};

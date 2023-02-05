import type { HandlerContext } from "$fresh/server.ts";
import type PocketBase from "pocketbase";
import { PocketBaseModel } from "@/models/index.ts";

/** Converts URLSearchParams into a JSON KV structure. */
export function searchParamsAsJSON(searchParams: URLSearchParams): {
    [id: string]: string;
} {
    const res: { [id: string]: string } = {};
    searchParams.forEach((v, k) => (res[k] = v));
    return res;
}

export const CRUDFactory = {
    List(collection: PocketBaseModel) {
        return async (
            req: Request,
            ctx: HandlerContext<void, { pb: PocketBase }>
        ) => {
            const url = new URL(req.url);
            const res = await ctx.state.pb
                .collection(collection)
                .getFullList(null, searchParamsAsJSON(url.searchParams));
            return new Response(JSON.stringify(res));
        };
    },
    View(collection: PocketBaseModel) {
        return async (
            req: Request,
            ctx: HandlerContext<void, { pb: PocketBase }>
        ) => {
            const url = new URL(req.url);
            const res = await ctx.state.pb
                .collection(collection)
                .getOne(ctx.params.id, searchParamsAsJSON(url.searchParams));
            return new Response(JSON.stringify(res));
        };
    },
    Update(collection: PocketBaseModel) {
        return async (
            req: Request,
            ctx: HandlerContext<void, { pb: PocketBase }>
        ) => {
            const res = await ctx.state.pb
                .collection(collection)
                .update(ctx.params.id, await req.json());
            return new Response(JSON.stringify(res));
        };
    },
};

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

interface Options<J = any> {
    id?: string;
    mutators?: {
        params?: (_: Record<string, string>) => Record<string, string>;
        filter?: (_: string) => string;
        payload?: (_: J) => J;
    };
    validators?: {
        payload?: (_: J) => Promise<void> | void;
    };
}

/** Composes a single filter out of multiple string filters. */
export function composeFilters(filters: string[]): string {
    return filters
        .filter((f) => !!f)
        .map((f) => `(${f})`)
        .join(" && ");
}

/** Apply fn if it exists, otherwise, return original value. */
function apply<T>(fn: ((_: T) => T) | null | undefined, v: T, fallback?: T): T {
    if (!fn) return v || fallback!;
    return fn(v);
}

export const CRUDFactory = {
    List(collection: PocketBaseModel, options: Options = {}) {
        return async (
            req: Request,
            ctx: HandlerContext<void, { pb: PocketBase }>
        ) => {
            const query = searchParamsAsJSON(new URL(req.url).searchParams);
            query.filter = apply(options?.mutators?.filter, query.filter, "");
            ctx.params = apply(options?.mutators?.params, ctx.params);

            const res = await ctx.state.pb
                .collection(collection)
                .getFullList(null, query);
            return new Response(JSON.stringify(res));
        };
    },
    View(collection: PocketBaseModel, options: Options = {}) {
        return async (
            req: Request,
            ctx: HandlerContext<void, { pb: PocketBase }>
        ) => {
            const query = searchParamsAsJSON(new URL(req.url).searchParams);
            ctx.params = apply(options?.mutators?.params, ctx.params);

            const res = await ctx.state.pb
                .collection(collection)
                .getOne(ctx.params.id, query);
            return new Response(JSON.stringify(res));
        };
    },
    Create(collection: PocketBaseModel, options: Options = {}) {
        return async (
            req: Request,
            ctx: HandlerContext<void, { pb: PocketBase }>
        ) => {
            ctx.params = apply(options?.mutators?.params, ctx.params);
            const payload = apply(options?.mutators?.payload, await req.json());
            if (options?.validators?.payload) {
                try {
                    await options.validators.payload(payload);
                } catch (e) {
                    return new Response(e, { status: 400 });
                }
            }

            const res = await ctx.state.pb
                .collection(collection)
                .create(payload);
            return new Response(JSON.stringify(res));
        };
    },
    Update(collection: PocketBaseModel, options: Options = {}) {
        return async (
            req: Request,
            ctx: HandlerContext<void, { pb: PocketBase }>
        ) => {
            ctx.params = apply(options?.mutators?.params, ctx.params);
            const payload = apply(options?.mutators?.payload, await req.json());
            if (options?.validators?.payload) {
                try {
                    await options.validators.payload(payload);
                } catch (e) {
                    return new Response(e, { status: 400 });
                }
            }

            const res = await ctx.state.pb
                .collection(collection)
                .update(ctx.params.id, payload);
            return new Response(JSON.stringify(res));
        };
    },
    Delete(collection: PocketBaseModel, options: Options = {}) {
        return async (
            _req: Request,
            ctx: HandlerContext<void, { pb: PocketBase }>
        ) => {
            ctx.params = apply(options?.mutators?.params, ctx.params);

            const res = await ctx.state.pb
                .collection(collection)
                .delete(ctx.params.id);
            return new Response(JSON.stringify(res));
        };
    },
};

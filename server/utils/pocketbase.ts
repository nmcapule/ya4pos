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

/** A validator function. */
export type Validator<T = void> = (
    req: Request,
    ctx: HandlerContext<T, { pb: PocketBase }>
) => Promise<void> | void;

/** Creates an assert that throws an error if the input expr is false. */
export function assertExpression<T>(
    expr: (_: T) => boolean,
    err = "Assertion validator failed!"
): Validator {
    return async (req, _ctx) => {
        const payload: T = await req.clone().json();
        if (!expr(payload)) throw err;
    };
}

/** Custom options for all generic CRUD pocketbase functions. */
interface Options<J = unknown> {
    id?: string;
    mutators?: {
        filter?: (_: string) => string;
    };
    validators?: Validator[];
    proc?: (_: J, pb?: PocketBase) => Promise<J> | J;
}

/** Composes a single filter out of multiple string filters. */
export function composeFilters(filters: string[]): string {
    return filters
        .filter((f) => !!f)
        .map((f) => `(${f})`)
        .join(" && ");
}

/** Apply fn if it exists, otherwise, return original value. */
async function apply<T>(
    fn: ((_: T, ...args: unknown[]) => Promise<T> | T) | null | undefined,
    v: T,
    fallback?: T,
    ...args: unknown[]
) {
    if (!fn) return v || fallback!;
    return await fn(v, ...args);
}

/** Creates quick templated pocketbase CRUD handlers. */
export const CRUDFactory = {
    /** Retrieves a list of pocketbase records. */
    List<J>(collection: PocketBaseModel, options: Options<J> = {}) {
        return async (
            req: Request,
            ctx: HandlerContext<void, { pb: PocketBase }>
        ) => {
            const query = searchParamsAsJSON(new URL(req.url).searchParams);
            query.filter = await apply(
                options?.mutators?.filter,
                query.filter,
                ""
            );
            options?.validators?.forEach((fn) => fn(req, ctx));

            const res = await ctx.state.pb
                .collection(collection)
                .getFullList(null, query);
            return new Response(JSON.stringify(res));
        };
    },
    /** Views a single pocketbase record. */
    View<J>(collection: PocketBaseModel, options: Options<J> = {}) {
        return async (
            req: Request,
            ctx: HandlerContext<void, { pb: PocketBase }>
        ) => {
            const query = searchParamsAsJSON(new URL(req.url).searchParams);
            options?.validators?.forEach((fn) => fn(req, ctx));

            const res = await ctx.state.pb
                .collection(collection)
                .getOne(ctx.params.id, query);
            return new Response(JSON.stringify(res));
        };
    },
    /** Creates a pocketbase record. */
    Create<J>(collection: PocketBaseModel, options: Options<J> = {}) {
        return async (
            req: Request,
            ctx: HandlerContext<void, { pb: PocketBase }>
        ) => {
            options?.validators?.forEach((fn) => fn(req, ctx));

            const payload = apply(
                options?.proc,
                await req.json(),
                undefined,
                ctx.state.pb
            );
            const res = await ctx.state.pb
                .collection(collection)
                .create(payload);
            return new Response(JSON.stringify(res));
        };
    },
    /** Updates a pocketbase record. */
    Update<J>(collection: PocketBaseModel, options: Options<J> = {}) {
        return async (
            req: Request,
            ctx: HandlerContext<void, { pb: PocketBase }>
        ) => {
            options?.validators?.forEach((fn) => fn(req, ctx));

            const payload = apply(
                options?.proc,
                await req.json(),
                undefined,
                ctx.state.pb
            );
            const res = await ctx.state.pb
                .collection(collection)
                .update(ctx.params.id, payload);
            return new Response(JSON.stringify(res));
        };
    },
    /** Deletes a pocketbase record. */
    Delete<J>(collection: PocketBaseModel, options: Options<J> = {}) {
        return async (
            req: Request,
            ctx: HandlerContext<void, { pb: PocketBase }>
        ) => {
            options?.validators?.forEach((fn) => fn(req, ctx));

            const res = await ctx.state.pb
                .collection(collection)
                .delete(ctx.params.id);
            return new Response(JSON.stringify(res));
        };
    },
};

import type { MiddlewareHandlerContext } from "$fresh/server.ts";
import config from "@/utils/config.ts";
import { PocketBaseModels } from "@/models/index.ts";
import PocketBase from "pocketbase";

interface State {
    pb: PocketBase;
}

export async function handler(
    req: Request,
    ctx: MiddlewareHandlerContext<State>
) {
    // Load auth store from passed cookies.
    ctx.state.pb = new PocketBase(config.POCKETBASE_URL);
    ctx.state.pb.authStore.loadFromCookie(req.headers.get("cookie") ?? "");

    // If auth store is no longer valid, try refreshing the token.
    if (!ctx.state.pb.authStore.isValid) {
        try {
            await ctx.state.pb.collection(PocketBaseModels.USERS).authRefresh();
        } catch (_) {
            // If can't refresh, just clear the auth store then.
            ctx.state.pb.authStore.clear();
        }
    }

    // Instruct client to save cookie from the auth store.
    const res = await ctx.next();
    res.headers.append("set-cookie", ctx.state.pb.authStore.exportToCookie());
    return res;
}

import type { MiddlewareHandlerContext } from "$fresh/server.ts";
import config from "@/utils/config.ts";
import { PocketBaseModel } from "@/models/index.ts";
import PocketBase from "pocketbase";

const ALLOWED_ORIGINS = [
    "https://nmcapule-literate-parakeet-j4qvr9vv4xc5pgj-19006.preview.app.github.dev",
];

interface State {
    pb: PocketBase;
}

export async function handler(
    req: Request,
    ctx: MiddlewareHandlerContext<State>
) {
    // Hijack preflight requests if ALLOW_CORS is set.
    if (config.ALLOW_CORS && req.method === "OPTIONS") {
        return new Response(null, {
            headers: attachCORS(new Headers()),
            status: 200,
        });
    }

    // Attach authenticated PocketBase to context state.
    ctx.state.pb = new PocketBase(config.POCKETBASE_URL);
    await authenticate(ctx.state.pb, req);
    // Instruct client to save cookie from the auth store.
    const res = await ctx.next();
    // Set cookie if authenticated to PocketBase.
    res.headers.append("set-cookie", ctx.state.pb.authStore.exportToCookie());

    // Attach CORS header if ALLOW_CORS is set.
    if (config.ALLOW_CORS) {
        attachCORS(res.headers);
    }

    return res;
}

async function authenticate(pb: PocketBase, req: Request) {
    pb.authStore.loadFromCookie(req.headers.get("cookie") ?? "");

    // If auth store is no longer valid, try refreshing the token.
    if (!pb.authStore.isValid) {
        try {
            await pb.collection(PocketBaseModel.USERS).authRefresh();
        } catch (_) {
            // If can't refresh, just clear the auth store then.
            pb.authStore.clear();
        }
    }
}

function attachCORS(headers: Headers) {
    headers.append("Access-Control-Allow-Origin", ALLOWED_ORIGINS.join("|"));
    headers.append("Access-Control-Allow-Methods", "POST,PUT,GET,OPTIONS");
    headers.append("Access-Control-Allow-Headers", "Content-Type");
    headers.append("Access-Control-Allow-Credentials", "true");
    headers.append("Access-Control-Max-Age", "86400");
    headers.append("Vary", "Accept-Encoding,Origin");

    return headers;
}

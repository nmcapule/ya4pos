import type { Handlers } from "$fresh/server.ts";
import type PocketBase from "pocketbase";
import { PocketBaseModel } from "@/models/index.ts";

export const handler: Handlers<unknown, { pb: PocketBase }> = {
    GET(_req: Request, ctx) {
        return new Response(JSON.stringify(ctx.state.pb.authStore.model));
    },
    /** Log-in the user using the passed username and password. */
    async POST(req: Request, ctx) {
        const body = await req.json();
        const res = await ctx.state.pb
            .collection(PocketBaseModel.USERS)
            .authWithPassword(body.username, body.password);
        return new Response(JSON.stringify(res));
    },
    /** Log-out the currently logged-in user. */
    DELETE(_req: Request, ctx) {
        ctx.state.pb.authStore.clear();
        return new Response("ok");
    },
};

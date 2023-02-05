import type { Handlers, HandlerContext } from "$fresh/server.ts";
import type PocketBase from "pocketbase";
import { PocketBaseModel } from "@/models/index.ts";
import { CRUDFactory } from "@/utils/pocketbase.ts";

export const handler: Handlers<unknown, { pb: PocketBase }> = {
    GET: CRUDFactory.List(PocketBaseModel.TRANSFERS),
    POST: async (
        req: Request,
        ctx: HandlerContext<void, { pb: PocketBase }>
    ) => {
        const payload = await req.clone().json();
        // Disallow is_committed = true on creation.
        if (payload.is_committed) {
            throw `Cannot directly create a transfer where is_committed=true`;
        }

        return await CRUDFactory.Create(PocketBaseModel.TRANSFERS)(req, ctx);
    },
};

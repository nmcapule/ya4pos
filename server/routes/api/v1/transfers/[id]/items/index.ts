import type { Handlers, HandlerContext } from "$fresh/server.ts";
import type PocketBase from "pocketbase";
import { PocketBaseModel } from "@/models/index.ts";
import { CRUDFactory } from "@/utils/pocketbase.ts";

interface Transfer {
    is_committed?: boolean;
}

export const handler: Handlers<unknown, { pb: PocketBase }> = {
    GET: CRUDFactory.List(PocketBaseModel.TRANSFER_ITEMS),
    async POST(req: Request, ctx: HandlerContext<void, { pb: PocketBase }>) {
        return await CRUDFactory.Create(PocketBaseModel.TRANSFER_ITEMS, {
            validators: {
                payload: async (_v: Transfer) => {
                    // Block transfer item updates if is_committed=true.
                    const transfer: Transfer = await ctx.state.pb
                        .collection(PocketBaseModel.TRANSFERS)
                        .getOne(ctx.params.id);
                    if (transfer.is_committed) {
                        throw `Cannot update transfer if already committed`;
                    }
                },
            },
        })(req, ctx);
    },
};

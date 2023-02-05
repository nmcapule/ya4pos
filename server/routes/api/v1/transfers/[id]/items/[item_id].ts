import type { Handlers, HandlerContext } from "$fresh/server.ts";
import type PocketBase from "pocketbase";
import { PocketBaseModel } from "@/models/index.ts";
import { composeFilters, CRUDFactory } from "@/utils/pocketbase.ts";

interface Transfer {
    is_committed?: boolean;
}

interface TransferItem {
    transfer_id?: string;
}

export const handler: Handlers<unknown, { pb: PocketBase }> = {
    async GET(req: Request, ctx: HandlerContext<void, { pb: PocketBase }>) {
        return await CRUDFactory.View(PocketBaseModel.TRANSFER_ITEMS, {
            id: "item_id",
            mutators: {
                filter: (f) =>
                    composeFilters([f, `transfer_id=${ctx.params.id}`]),
            },
        })(req, ctx);
    },
    async PUT(req: Request, ctx: HandlerContext<void, { pb: PocketBase }>) {
        return await CRUDFactory.Update(PocketBaseModel.TRANSFER_ITEMS, {
            id: "item_id",
            validators: {
                payload: async (v: TransferItem) => {
                    // Block transfer item updates if is_committed=true.
                    const transfer: Transfer = await ctx.state.pb
                        .collection(PocketBaseModel.TRANSFERS)
                        .getOne(ctx.params.id);
                    if (transfer.is_committed) {
                        throw `Cannot update transfer if already committed`;
                    }
                    // Block updates to transfer_id.
                    if (v.transfer_id !== ctx.params.id) {
                        throw `Cannot directly update transfer_id`;
                    }
                },
            },
        })(req, ctx);
    },
    async DELETE(req: Request, ctx: HandlerContext<void, { pb: PocketBase }>) {
        return await CRUDFactory.Delete(PocketBaseModel.TRANSFER_ITEMS, {
            id: "item_id",
            validators: {
                payload: async (_v: TransferItem) => {
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

import type { Handlers, HandlerContext } from "$fresh/server.ts";
import type PocketBase from "pocketbase";
import { PocketBaseModel } from "@/models/index.ts";
import { composeFilters, CRUDFactory } from "@/utils/pocketbase.ts";
import {
    assertSameTransferId,
    assertTransferNotCommitted,
} from "@/routes/api/v1/transfers/_validators.ts";

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
    PUT: CRUDFactory.Update(PocketBaseModel.TRANSFER_ITEMS, {
        id: "item_id",
        validators: [assertTransferNotCommitted, assertSameTransferId],
    }),
    DELETE: CRUDFactory.Delete(PocketBaseModel.TRANSFER_ITEMS, {
        id: "item_id",
        validators: [assertTransferNotCommitted],
    }),
};

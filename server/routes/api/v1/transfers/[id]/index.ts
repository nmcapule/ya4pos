import type { Handlers } from "$fresh/server.ts";
import type PocketBase from "pocketbase";
import { PocketBaseModel, Transfer } from "@/models/index.ts";
import { assertExpression, CRUDFactory } from "@/utils/pocketbase.ts";
import { assertTransferNotCommitted } from "@/routes/api/v1/transfers/_validators.ts";

/** Commits a transfer record. */
export async function commit(pb: PocketBase, id: string) {
    const transfer: Transfer = await pb
        .collection(PocketBaseModel.TRANSFERS)
        .getOne(id);
    if (transfer.is_committed) {
        throw "This transfer has already been committed";
    }
    if (transfer.scheduled && new Date(transfer.scheduled) < new Date()) {
        throw "Cannot commit a transfer past schedule";
    }
}

export const handler: Handlers<unknown, { pb: PocketBase }> = {
    GET: CRUDFactory.View(PocketBaseModel.TRANSFERS),
    PUT: async (req, ctx) => {
        return await CRUDFactory.Update(PocketBaseModel.TRANSFERS, {
            validators: [assertTransferNotCommitted],
        })(req, ctx);
    },
};

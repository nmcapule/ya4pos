import type { Handlers } from "$fresh/server.ts";
import type PocketBase from "pocketbase";
import { PocketBaseModel, Transfer } from "@/models/index.ts";
import { CRUDFactory } from "@/utils/pocketbase.ts";
import { assertTransferNotCommitted } from "@/routes/api/v1/transfers/_validators.ts";
import { commit } from "@/routes/api/v1/transfers/[id]/_commit.ts";

export const handler: Handlers<unknown, { pb: PocketBase }> = {
    GET: CRUDFactory.View(PocketBaseModel.TRANSFERS),
    PUT: CRUDFactory.Update<Transfer>(PocketBaseModel.TRANSFERS, {
        validators: [assertTransferNotCommitted],
        proc: async (update, pb: PocketBase) => {
            const current: Transfer = await pb
                .collection(PocketBaseModel.TRANSFERS)
                .getOne(update.id);

            // Automate attaching user to the updatedBy.
            update.updatedBy = pb.authStore.model.id;

            // If toggling from !committed into committed, do a commit.
            if (update.committed && !current.committed) {
                return await commit(pb, update);
            }
            // Otherwise, do a simple update.
            return update;
        },
    }),
};

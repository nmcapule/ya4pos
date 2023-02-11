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

            // Automate attaching user to the updated_by.
            update.updated_by = pb.authStore.model.id;

            // If toggling from !is_committed into is_committed, do a commit.
            if (update.is_committed && !current.is_committed) {
                return await commit(pb, current, update);
            }
            // Otherwise, do a simple update.
            return update;
        },
    }),
};

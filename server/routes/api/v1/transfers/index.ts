import type { Handlers } from "$fresh/server.ts";
import type PocketBase from "pocketbase";
import { PocketBaseModel, Transfer } from "@/models/index.ts";
import { CRUDFactory } from "@/utils/pocketbase.ts";

export const handler: Handlers<unknown, { pb: PocketBase }> = {
    GET: CRUDFactory.List(PocketBaseModel.TRANSFERS),
    POST: CRUDFactory.Create(PocketBaseModel.TRANSFERS, {
        validators: {
            payload: (v: Transfer) => {
                // Disallow is_committed = true on creation.
                if (v.is_committed) {
                    throw `Cannot directly create a transfer where is_committed=true`;
                }
            },
        },
    }),
};

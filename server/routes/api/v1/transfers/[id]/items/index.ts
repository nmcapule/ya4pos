import type { Handlers } from "$fresh/server.ts";
import type PocketBase from "pocketbase";
import { PocketBaseModel } from "@/models/index.ts";
import { CRUDFactory } from "@/utils/pocketbase.ts";
import {
    assertSameTransferId,
    assertTransferNotCommitted,
} from "@/routes/api/v1/transfers/_validators.ts";

export const handler: Handlers<unknown, { pb: PocketBase }> = {
    GET: CRUDFactory.List(PocketBaseModel.TRANSFER_ITEMS),
    POST: CRUDFactory.Create(PocketBaseModel.TRANSFER_ITEMS, {
        validators: [assertTransferNotCommitted, assertSameTransferId],
    }),
};

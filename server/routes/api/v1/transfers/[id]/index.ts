import type { Handlers } from "$fresh/server.ts";
import type PocketBase from "pocketbase";
import { PocketBaseModel } from "@/models/index.ts";
import { assertExpression, CRUDFactory } from "@/utils/pocketbase.ts";
import { assertTransferNotCommitted } from "@/routes/api/v1/transfers/_validators.ts";

export const handler: Handlers<unknown, { pb: PocketBase }> = {
    GET: CRUDFactory.View(PocketBaseModel.TRANSFERS),
    PUT: CRUDFactory.Update(PocketBaseModel.TRANSFERS, {
        validators: [
            assertTransferNotCommitted,
            assertExpression(
                () => false,
                `This endpoint is not yet implemented`
            ),
        ],
    }),
};

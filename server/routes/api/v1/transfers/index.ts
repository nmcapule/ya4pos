import type { Handlers } from "$fresh/server.ts";
import type PocketBase from "pocketbase";
import { PocketBaseModel, Transfer } from "@/models/index.ts";
import { assertExpression, CRUDFactory } from "@/utils/pocketbase.ts";

export const handler: Handlers<unknown, { pb: PocketBase }> = {
    GET: CRUDFactory.List(PocketBaseModel.TRANSFERS),
    POST: CRUDFactory.Create(PocketBaseModel.TRANSFERS, {
        validators: [
            assertExpression<Transfer>(
                (v) => !v.committed,
                `New transfers should have committed=false`
            ),
        ],
    }),
};

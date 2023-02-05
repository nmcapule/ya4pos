import type { Handlers } from "$fresh/server.ts";
import type PocketBase from "pocketbase";
import { PocketBaseModel } from "@/models/index.ts";
import { CRUDFactory } from "@/utils/pocketbase.ts";

export const handler: Handlers<unknown, { pb: PocketBase }> = {
    GET: CRUDFactory.View(PocketBaseModel.TRANSFERS),
    PUT: CRUDFactory.Update(PocketBaseModel.TRANSFERS),
};

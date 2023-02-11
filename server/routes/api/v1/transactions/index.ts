import type { Handlers } from "$fresh/server.ts";
import type PocketBase from "pocketbase";
import { AccountingTransaction, PocketBaseModel } from "@/models/index.ts";
import { CRUDFactory } from "@/utils/pocketbase.ts";

export const handler: Handlers<unknown, { pb: PocketBase }> = {
    GET: CRUDFactory.List<AccountaingTransaction>(
        PocketBaseModel.ACCOUNTING_TRANSACTIONS
    ),
    POST: CRUDFactory.Create<AccountingTransaction>(
        PocketBaseModel.ACCOUNTING_TRANSACTIONS
    ),
};

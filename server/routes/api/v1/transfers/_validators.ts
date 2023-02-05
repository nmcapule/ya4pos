import type { HandlerContext } from "$fresh/server.ts";
import type PocketBase from "pocketbase";
import { PocketBaseModel, Transfer } from "@/models/index.ts";

/** Block transfer item updates if is_committed=true. */
export async function assertTransferNotCommitted(
    _req: Request,
    ctx: HandlerContext<void, { pb: PocketBase }>
) {
    const transfer: Transfer = await ctx.state.pb
        .collection(PocketBaseModel.TRANSFERS)
        .getOne(ctx.params.id);
    if (transfer.is_committed) {
        throw `Cannot update transfer if already committed`;
    }
}

/** Block updates to transfer_id. */
export async function assertNoUpdateTransferId(
    req: Request,
    ctx: HandlerContext<void, { pb: PocketBase }>
) {
    const v = await req.clone().json();
    if (v.transfer_id !== ctx.params.id) {
        throw `Cannot directly update transfer_id`;
    }
}

import type { HandlerContext } from "$fresh/server.ts";
import type PocketBase from "pocketbase";
import { PocketBaseModel, Transfer } from "@/models/index.ts";

/** Block transfer item updates if current transfer is_committed=true. */
export async function assertTransferNotCommitted(
    _req: Request,
    ctx: HandlerContext<void, { pb: PocketBase }>
) {
    const transfer: Transfer = await ctx.state.pb
        .collection(PocketBaseModel.TRANSFERS)
        .getOne(ctx.params.id);
    if (transfer.is_committed) {
        throw (
            "Cannot update transfer or transfer items since the transfer" +
            "has already been committed"
        );
    }
}

/** Block updates to transfer_id that is not equal to parent transfer. */
export async function assertSameTransferId(
    req: Request,
    ctx: HandlerContext<void, { pb: PocketBase }>
) {
    const v = await req.clone().json();
    if (v.transfer_id !== ctx.params.id) {
        throw `Cannot directly update transfer_id`;
    }
}

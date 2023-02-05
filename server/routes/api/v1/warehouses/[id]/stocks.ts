import type { HandlerContext } from "$fresh/server.ts";
import type PocketBase from "pocketbase";
import { PocketBaseModel } from "@/models/index.ts";
import { composeFilters, CRUDFactory } from "@/utils/pocketbase.ts";

export const handler = async (
    req: Request,
    ctx: HandlerContext<void, { pb: PocketBase }>
) => {
    return await CRUDFactory.List(PocketBaseModel.WAREHOUSE_STOCKS, {
        mutators: {
            // Add `warehouse_id` filter.
            filter: (f) =>
                composeFilters([f, `warehouse_id="${ctx.params.id}"`]),
        },
    })(req, ctx);
};

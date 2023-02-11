import type { HandlerContext, PageProps } from "$fresh/server.ts";
import type PocketBase from "pocketbase";
import { UnitConversion, PocketBaseModel } from "@/models/index.ts";
import { multiplierOf } from "@/routes/api/v1/conversions/_multiplier_of.ts";

export const handler = async (
    _req: Request,
    ctx: HandlerContext<PageProps, { pb: PocketBase }>
): Promise<Response> => {
    const { from, into } = ctx.params;
    const conversions: UnitConversion[] = await ctx.state.pb
        .collection(PocketBaseModel.UNIT_CONVERSIONS)
        .getFullList();
    try {
        const conversion: UnitConversion = {
            from_unit_id: from,
            into_unit_id: into,
            multiplier: multiplierOf(conversions, from, into),
        };
        return new Response(JSON.stringify(conversion));
    } catch (e) {
        return new Response(e, { status: 400 });
    }
};

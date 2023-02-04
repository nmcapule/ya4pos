import { HandlerContext, PageProps } from "$fresh/server.ts";
import type PocketBase from "pocketbase";

export const handler = async (
  _req: Request,
  ctx: HandlerContext<PageProps, { pb: PocketBase }>
) => {
  const { id } = ctx.params;
  const res = await ctx.state.pb.collection("warehouses").getOne(id);
  return new Response(JSON.stringify(res));
};

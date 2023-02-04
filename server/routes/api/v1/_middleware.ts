import { MiddlewareHandlerContext } from "$fresh/server.ts";
import config from "@/utils/config.ts";
import PocketBase from "pocketbase";

interface State {
  pb: PocketBase;
}

export async function handler(
  req: Request,
  ctx: MiddlewareHandlerContext<State>
) {
  ctx.state.pb = new PocketBase(config.POCKETBASE_URL);
  ctx.state.pb.authStore.loadFromCookie(req.headers.get("cookie") ?? "");

  if (!ctx.state.pb.authStore.isValid) {
    try {
      await ctx.state.pb.collection("users").authRefresh();
    } catch (_) {
      // If can't refresh, just clear the auth store then.
      ctx.state.pb.authStore.clear();
    }
  }

  const res = await ctx.next();
  res.headers.append("set-cookie", ctx.state.pb.authStore.exportToCookie());
  return res;
}

import config from "@/utils/config.ts";
import PocketBase from "pocketbase";

export function pocketbase(req: Request): PocketBase {
  const pb = new PocketBase(config.POCKETBASE_URL);
  pb.authStore.loadFromCookie(req.headers.get("cookie") as string);

  return pb;
}

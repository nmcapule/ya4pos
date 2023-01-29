import { Handlers } from "$fresh/server.ts";
import { deleteCookie } from "std/http/cookie.ts";

export const handler: Handlers = {
  GET(_req) {
    const headers = new Headers();
    deleteCookie(headers, "pb_auth", { path: "/" });
    headers.set("location", "/");

    return new Response(null, { status: 302, headers });
  },
};

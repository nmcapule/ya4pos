import type { Handlers, PageProps } from "$fresh/server.ts";
import { pocketbase } from "@/utils/pocketbase.ts";

interface Data {
  error: string;
}

export const handler: Handlers = {
  async POST(req: Request, ctx) {
    const form = await req.formData();
    const pb = pocketbase(req);

    try {
      await pb
        .collection("users")
        .authWithPassword(
          form.get("username") as string,
          form.get("password") as string
        );
    } catch (e) {
      return ctx.render({
        error: e,
      });
    }

    const headers = new Headers();
    headers.set("set-cookie", pb.authStore.exportToCookie());
    headers.set("location", "/");

    return new Response(null, { status: 303, headers });
  },
};

export default function Login({ data }: PageProps<Data>) {
  return (
    <div class="flex h-screen v-screen items-center justify-center">
      <form
        method="post"
        action="/account/login"
        class="flex flex-col gap-1 w-96"
      >
        <input
          type="text"
          name="username"
          placeholder="Username"
          class="bg-purple-100 focus:bg-purple-400 p-4"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          class="bg-purple-100 focus:bg-purple-400 p-4"
        />
        <button type="submit" class="bg-green-600 text-white p-4 mt-2">
          Submit
        </button>
        {data?.error && (
          <div class="bg-red-600 text-white p-2 rounded">
            {JSON.stringify(data.error)}
          </div>
        )}
      </form>
    </div>
  );
}

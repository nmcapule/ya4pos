import { config } from "std/dotenv/mod.ts";

const RAW_ENV = Object.assign(
    Deno.env.toObject(),
    await config({ export: true })
);
export default RAW_ENV;

// DO NOT EDIT. This file is generated by fresh.
// This file SHOULD be checked into source version control.
// This file is automatically updated during development when running `dev.ts`.

import config from "./deno.json" assert { type: "json" };
import * as $0 from "./routes/api/v1/_middleware.ts";
import * as $1 from "./routes/api/v1/authentication/index.ts";
import * as $2 from "./routes/api/v1/conversions/[from]/[into].ts";
import * as $3 from "./routes/api/v1/warehouses/[id]/index.ts";
import * as $4 from "./routes/api/v1/warehouses/[id]/stocks.ts";
import * as $5 from "./routes/api/v1/warehouses/index.ts";
import * as $6 from "./routes/index.tsx";
import * as $7 from "./routes/sandbox/index.tsx";
import * as $$0 from "./islands/Sandbox.tsx";

const manifest = {
  routes: {
    "./routes/api/v1/_middleware.ts": $0,
    "./routes/api/v1/authentication/index.ts": $1,
    "./routes/api/v1/conversions/[from]/[into].ts": $2,
    "./routes/api/v1/warehouses/[id]/index.ts": $3,
    "./routes/api/v1/warehouses/[id]/stocks.ts": $4,
    "./routes/api/v1/warehouses/index.ts": $5,
    "./routes/index.tsx": $6,
    "./routes/sandbox/index.tsx": $7,
  },
  islands: {
    "./islands/Sandbox.tsx": $$0,
  },
  baseUrl: import.meta.url,
  config,
};

export default manifest;

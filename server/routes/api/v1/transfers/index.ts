import { PocketBaseModel } from "@/models/index.ts";
import { CRUDFactory } from "@/utils/pocketbase.ts";

export const handler = CRUDFactory.List(PocketBaseModel.TRANSFERS);

/** Name of PocketBase tables as defined in @/../pocketbase/schema.json. */
export enum PocketBaseModel {
    USERS = "users",
    WAREHOUSES = "warehouses",
    WAREHOUSE_STOCKS = "warehouse_stocks",
    ITEMS = "items",
    TAGS = "tags",
    ITEM_TAGS = "item_tags",
    RECIPES = "recipes",
    RECIPE_INGREDIENTS = "recipe_ingredients",
    UNITS = "units",
    UNIT_CONVERSIONS = "unit_conversions",
    TRANSFERS = "transfers",
    TRANSFER_ITEMS = "transfer_items",
}

export interface Transfer {
    is_committed?: boolean;
}

export interface TransferItem {
    transfer_id?: string;
}

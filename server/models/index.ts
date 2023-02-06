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

export interface Transfer extends Record<string, unknown> {
    id?: string;
    from_warehouse_id?: string;
    into_warehouse_id?: string;
    total_cost?: number;
    description?: string;
    is_committed?: boolean;
    scheduled?: string;
    updated_by?: string;
}

export interface TransferItem extends Record<string, unknown> {
    transfer_id?: string;
}

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
    overhead_cost?: number;
    description?: string;
    is_committed?: boolean;
    scheduled?: string;
    updated_by?: string;
}

export interface TransferItem extends Record<string, unknown> {
    id?: string;
    transfer_id?: string;
    item_id?: string;
    quantity?: number;
    unit_id?: string;
    unit_price?: number;
    total_price?: number;
    is_virtual?: number;
    as_ingredient_of?: string;
}

export interface WarehouseStock extends Record<string, unknown> {
    warehouse_id?: string;
    item_id?: string;
    quantity?: number;
    unit_id?: string;
    unit_price?: number;
    is_virtual?: boolean;
    is_sellable?: boolean;
    expires?: string;
}

export interface UnitConversion extends Record<string, unknown> {
    from_unit_id?: string;
    multiplier?: number;
    into_unit_id?: string;
}

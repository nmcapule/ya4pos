/** Name of PocketBase tables as defined in @/../pocketbase/schema.json. */
export enum PocketBaseModel {
    ITEM_TAGS = "item_tags",
    ITEMS = "items",
    RECIPE_INGREDIENTS = "recipe_ingredients",
    RECIPES = "recipes",
    TAGS = "tags",
    TRANSFER_ITEMS = "transfer_items",
    TRANSFERS = "transfers",
    TRANSMUTES = "transmutes",
    UNIT_CONVERSIONS = "unit_conversions",
    UNITS = "units",
    USERS = "users",
    WAREHOUSE_STOCKS = "warehouse_stocks",
    WAREHOUSES = "warehouses",
}

export interface Item {
    id?: string;
    sku?: string;
    label?: string;
    unit_id?: string;
    unit_price?: number;
    expiry_secs?: number;
    description?: number;
}

export interface Transfer {
    id?: string;
    transaction_id?: string;
    from_warehouse_id?: string;
    into_warehouse_id?: string;
    overhead_cost?: number;
    description?: string;
    is_committed?: boolean;
    scheduled?: string;
    updated_by?: string;
}

export interface TransferItem {
    id?: string;
    transfer_id?: string;
    item_id?: string;
    quantity?: number;
    unit_id?: string;
    unit_price?: number;
    total_price?: number;
}

export interface WarehouseStock {
    id?: string;
    warehouse_id?: string;
    item_id?: string;
    quantity?: number;
    unit_id?: string;
    unit_price?: number;
    is_virtual?: boolean;
    is_sellable?: boolean;
    expires?: string;
}

export interface UnitConversion {
    from_unit_id?: string;
    multiplier?: number;
    into_unit_id?: string;
}

export interface Transmute {
    transaction_id?: string;
    recipe_id?: string;
    warehouse_id?: string;
    input_transfer_id?: string;
    output_transfer_id?: string;
}

export interface Recipe {
    id?: string;
    item_id?: string;
    label?: string;
}

export interface RecipeIngredient {
    recipe_id?: string;
    item_id?: string;
    quantity?: number;
    unit_id?: string;
}

/** Name of PocketBase tables as defined in @/../pocketbase/schema.json. */
export enum PocketBaseModel {
    ACCOUNTING_ENTITIES = "accounting_entities",
    ACCOUNTING_TRANSACTIONS = "accounting_transactions",
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

export interface Expandable {
    expand?: Record<string, any>;
}

export interface Item extends Expandable {
    id?: string;
    sku?: string;
    label?: string;
    unit_id?: string;
    unit_price?: number;
    expiry_secs?: number;
    description?: number;
}

export interface Transfer extends Expandable {
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

export interface TransferItem extends Expandable {
    id?: string;
    transfer_id?: string;
    item_id?: string;
    quantity?: number;
    unit_id?: string;
    unit_price?: number;
    total_price?: number;
}

export interface Warehouse extends Expandable {
    id?: string;
    label?: string;
    is_deleted?: boolean;
}

export interface WarehouseStock extends Expandable {
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

export interface Tag extends Expandable {
    id?: string;
    label?: string;
}

export interface UnitConversion extends Expandable {
    from_unit_id?: string;
    multiplier?: number;
    into_unit_id?: string;
}

export interface Transmute extends Expandable {
    transaction_id?: string;
    recipe_id?: string;
    warehouse_id?: string;
    input_transfer_id?: string;
    output_transfer_id?: string;
}

export interface Recipe extends Expandable {
    id?: string;
    item_id?: string;
    label?: string;
}

export interface RecipeIngredient extends Expandable {
    recipe_id?: string;
    item_id?: string;
    quantity?: number;
    unit_id?: string;
}

export interface AccountingEntity extends Expandable {
    id?: string;
    label?: string;
    description?: string;
}

export interface AccountingTransaction extends Expandable {
    description?: string;
    amount?: number;
    from_entity_id?: string;
    into_entity_id?: string;
}

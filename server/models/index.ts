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
    unit?: string;
    unitPrice?: number;
    expiryInSecs?: number;
    description?: number;
}

export interface Transfer extends Expandable {
    id?: string;
    transaction?: string;
    from?: string;
    into?: string;
    overhead?: number;
    description?: string;
    committed?: boolean;
    scheduled?: string;
    updatedBy?: string;
}

export interface TransferItem extends Expandable {
    id?: string;
    transfer?: string;
    item?: string;
    quantity?: number;
    unit?: string;
    unitPrice?: number;
    totalPrice?: number;
}

export interface Warehouse extends Expandable {
    id?: string;
    label?: string;
    deleted?: boolean;
}

export interface WarehouseStock extends Expandable {
    id?: string;
    warehouse?: string;
    item?: string;
    quantity?: number;
    unit?: string;
    unitPrice?: number;
    virtual?: boolean;
    sellable?: boolean;
    expires?: string;
}

export interface Tag extends Expandable {
    id?: string;
    label?: string;
}

export interface UnitConversion extends Expandable {
    from?: string;
    multiplier?: number;
    into?: string;
}

export interface Transmute extends Expandable {
    transaction?: string;
    recipe?: string;
    warehouse?: string;
    input?: string;
    output?: string;
}

export interface Recipe extends Expandable {
    id?: string;
    item?: string;
    label?: string;
}

export interface RecipeIngredient extends Expandable {
    recipe?: string;
    item?: string;
    quantity?: number;
    unit?: string;
}

export interface AccountingEntity extends Expandable {
    id?: string;
    label?: string;
    description?: string;
}

export interface AccountingTransaction extends Expandable {
    description?: string;
    amount?: number;
    from?: string;
    into?: string;
}

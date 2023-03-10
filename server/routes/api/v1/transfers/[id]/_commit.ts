import type PocketBase from "pocketbase";
import {
    UnitConversion,
    PocketBaseModel,
    Transfer,
    TransferItem,
    WarehouseStock,
} from "@/models/index.ts";
import { multiplierOf } from "@/routes/api/v1/conversions/_multiplier_of.ts";

export interface Options {
    /**
     * Newly transferred stocks gets merged into existing item stock entries
     * (if there is a pre-existing entry for it). If there are no pre-existing
     * entry for the stock, default to creating a new one.
     */
    mergeWithExistingStock?: boolean;
}

/**
 * Commits a transfer record.
 *
 * This does not save the new transfer update into the database by default, so
 * do that in the outside function.
 */
export async function commit(
    pb: PocketBase,
    update: Transfer,
    options?: Options
): Promise<Transfer> {
    // Redundant assignment to ensure that committed is true for the update.
    update.committed = true;
    // Block commits if scheduled is invalid.
    if (update.scheduled && new Date(update.scheduled) < new Date()) {
        throw "Cannot commit a transfer past schedule";
    }

    const items: TransferItem[] = await pb
        .collection(PocketBaseModel.TRANSFER_ITEMS)
        .getFullList(null, { filter: `transfer="${update.id}"` });

    if (update.from) {
        await consumeStocks(pb, update.from, items, options);
    }
    if (update.into) {
        await createStocks(pb, update.into, items, options);
    }

    return update;
}

async function createStocks(
    pb: PocketBase,
    intoWarehouseId: string,
    items: TransferItem[],
    options?: Options
): Promise<WarehouseStock[]> {
    return await Promise.all(
        items.map(async (item) => {
            if (options?.mergeWithExistingStock) {
                // TODO(nmcapule): Implement.
            }
            return await pb
                .collection(PocketBaseModel.WAREHOUSE_STOCKS)
                .create({
                    warehouse: intoWarehouseId,
                    item: item.item,
                    quantity: item.quantity,
                    unit: item.unit,
                    unitPrice: item.unitPrice,
                    // TODO(nmcapule): How to handle expiry.
                    // expires: item.
                });
        })
    );
}

/**
 * Check if all concrete items have enough stocks from source warehouse, and
 * then apply removal of the items from the source warehouse.
 */
async function consumeStocks(
    pb: PocketBase,
    fromWarehouseId: string,
    items: TransferItem[],
    _options?: Options
): Promise<WarehouseStock[]> {
    const conversions: UnitConversion[] = await pb
        .collection(PocketBaseModel.UNIT_CONVERSIONS)
        .getFullList();

    // Stocks currently saved in the database.
    const stocksFromSource: WarehouseStock[] = await pb
        .collection(PocketBaseModel.WAREHOUSE_STOCKS)
        .getFullList(null, {
            filter: `warehouse="${fromWarehouseId}"`,
        });
    // Stocks needed to be updated (aka. buffered stock updates).
    const stocksToUpdate = new Map<string, WarehouseStock>();

    for (const item of items) {
        // Apply buffered stock updates to get virtual stocks.
        const stocks = stocksFromSource.map(
            (stock) => stocksToUpdate.get(stock.item!) ?? stock
        );
        // Calculate more buffered stock updates based on required item.
        draftConsumedStocksUpdate(conversions, item, stocks).forEach((stock) =>
            stocksToUpdate.set(stock.id!, stock)
        );
    }

    // Apply all buffered stock updates to the database. If remaining stock is
    // less than or equal to zero, delete from the database instead.
    return Promise.all(
        Array.from(stocksToUpdate.entries()).map(async ([_, stock]) => {
            // Clean up non-virtual stocks that have zero quantity.
            if (!stock.virtual && stock.quantity! <= 0) {
                return await pb
                    .collection(PocketBaseModel.WAREHOUSE_STOCKS)
                    .delete(stock.id);
            }
            return await pb
                .collection(PocketBaseModel.WAREHOUSE_STOCKS)
                .update(stock.id, stock);
        })
    );
}

/**
 * Create an array of warehouse item stocks to update if the given item needs
 * to be consumed from the warehouse item stocks.
 */
function draftConsumedStocksUpdate(
    conversions: UnitConversion[],
    item: TransferItem,
    stocks: WarehouseStock[]
): WarehouseStock[] {
    // Only compare with relevant and available stocks.
    stocks = stocks
        .filter((stock) => stock.item === item.item)
        .filter((stock) => stock.quantity! > 0);

    const stocksToUpdate: WarehouseStock[] = [];

    // Update item from source warehouse.
    let required = item.quantity!;
    for (const stock of stocks) {
        // Available stock quantity, in the desired unit.
        const available =
            stock.quantity! *
            multiplierOf(conversions, stock.unit!, item.unit!);
        const consumed = Math.max(available, required);
        if (consumed <= 0) {
            continue;
        }

        // Update available stock quantity, in the original unit.
        stock.quantity =
            (available - consumed) *
            multiplierOf(conversions, item.unit!, stock.unit!);
        stocksToUpdate.push(stock);

        // Decrease required stock quantity.
        required = required - consumed;
    }
    if (required > 0) {
        throw new Error(
            `Insufficient stock for ${item.item} from source warehouse.`
        );
    }

    return stocksToUpdate;
}

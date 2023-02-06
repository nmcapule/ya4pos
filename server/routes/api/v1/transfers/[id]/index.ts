import type { Handlers } from "$fresh/server.ts";
import type PocketBase from "pocketbase";
import {
    UnitConversion,
    PocketBaseModel,
    Transfer,
    TransferItem,
    WarehouseStock,
} from "@/models/index.ts";
import { CRUDFactory } from "@/utils/pocketbase.ts";
import { assertTransferNotCommitted } from "@/routes/api/v1/transfers/_validators.ts";

/** Commits a transfer record. */
export async function commit(
    pb: PocketBase,
    current: Transfer,
    update: Transfer
): Promise<Transfer> {
    // Redundant check with PUT /api/v1/transfers/:id since this function will
    // be designed as a reusable.
    if (current.is_committed) {
        throw "This transfer has already been committed";
    }
    // Block commits if scheduled is invalid.
    if (update.scheduled && new Date(update.scheduled) < new Date()) {
        throw "Cannot commit a transfer past schedule";
    }

    // Validate all transfer items associated with this transfer.
    const items: TransferItem[] = await pb
        .collection(PocketBaseModel.TRANSFER_ITEMS)
        .getFullList(null, { filter: `transfer_id="${current.id}"` });
    const concreteItems: TransferItem[] = items.filter(
        (v) => !v.is_virtual || v.as_ingredient_of
    );
    // Check if all concrete items have enough stocks from source warehouse.
    const conversions: UnitConversion[] = await pb
        .collection(PocketBaseModel.UNIT_CONVERSIONS)
        .getFullList();
    if (update.from_warehouse_id) {
        const stocksFromSource: WarehouseStock[] = await pb
            .collection(PocketBaseModel.WAREHOUSE_STOCKS)
            .getFullList(null, {
                filter: `warehouse_id="${update.from_warehouse_id}"`,
            });
        concreteItems.forEach((item) => {
            // TODO(nmcapule): Implement.
            // - Cross check item with stocksFromSource.
            // - Update item from source warehouse.
        });
    }
    if (update.into_warehouse_id) {
        // TODO(nmcapule): How do we handle virtual items?
        await Promise.all(
            concreteItems.map((item) =>
                pb.collection(PocketBaseModel.WAREHOUSE_STOCKS).create({
                    warehouse_id: update.into_warehouse_id,
                    item_id: item.item_id,
                    quantity: item.quantity,
                    unit_id: item.unit_id,
                    unit_price: item.unit_price,
                    is_virtual: item.is_virtual,
                    // TODO(nmcapule): How to handle expiry.
                    // expires: item.
                })
            )
        );
    }

    return update;
}

export const handler: Handlers<unknown, { pb: PocketBase }> = {
    GET: CRUDFactory.View(PocketBaseModel.TRANSFERS),
    PUT: CRUDFactory.Update<Transfer>(PocketBaseModel.TRANSFERS, {
        validators: [assertTransferNotCommitted],
        proc: async (update, pb: PocketBase) => {
            const current: Transfer = await pb
                .collection(PocketBaseModel.TRANSFERS)
                .getOne(update.id);

            // Automate attaching user to the updated_by.
            update.updated_by = pb.authStore.model.id;

            // If toggling from !is_committed into is_committed, do a commit.
            if (update.is_committed && !current.is_committed) {
                return await commit(pb, current, update);
            }
            // Otherwise, do a simple update.
            return update;
        },
    }),
};

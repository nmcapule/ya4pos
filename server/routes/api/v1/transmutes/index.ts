import type { Handlers } from "$fresh/server.ts";
import type PocketBase from "pocketbase";
import {
    Item,
    PocketBaseModel,
    Recipe,
    RecipeIngredient,
    Transfer,
    TransferItem,
    Transmute,
} from "@/models/index.ts";
import { CRUDFactory } from "@/utils/pocketbase.ts";
import { commit } from "@/routes/api/v1/transfers/[id]/_commit.ts";

export const handler: Handlers<unknown, { pb: PocketBase }> = {
    POST: CRUDFactory.Create<Transmute>(PocketBaseModel.TRANSMUTES, {
        proc: async (transmute, pb: PocketBase) => {
            // TODO(nmcapule): Ideally, we validate first if the transmute is
            // possible before we create any transfer objects.

            const recipe: Recipe = await pb
                .collection(PocketBaseModel.RECIPES)
                .getOne(transmute.recipe);

            // Create transfer for output using recipe.
            const input = await createOutputTransfer(
                pb,
                transmute.transaction!,
                transmute.warehouse!,
                recipe.id!
            );
            transmute.input = input.id;

            // Create transfer for input using recipe.
            const output = await createInputTransfer(
                pb,
                transmute.transaction!,
                transmute.warehouse!,
                recipe.item!
            );
            transmute.output = output.id;

            // Commit transfer for output.
            await pb
                .collection(PocketBaseModel.TRANSFERS)
                .update(input.id, await commit(pb, input));
            // Commit transfer for input.
            await pb
                .collection(PocketBaseModel.TRANSFERS)
                .update(output.id, await commit(pb, output));

            return transmute;
        },
    }),
};

/**
 * Creates Transfer and TransferItem records from the input warehouse and
 * recipe.
 */
async function createOutputTransfer(
    pb: PocketBase,
    transactionId: string,
    warehouseId: string,
    recipeId: string
): Promise<Transfer> {
    const transfer: Transfer = await pb
        .collection(PocketBaseModel.TRANSFERS)
        .create({
            transaction: transactionId,
            from: warehouseId,
        });

    const ingredients: RecipeIngredient[] = await pb
        .collection(PocketBaseModel.RECIPE_INGREDIENTS)
        .getFullList(null, {
            filter: `recipe="${recipeId}"`,
        });
    await Promise.all(
        ingredients
            .map(
                (ing) =>
                    ({
                        transfer: transfer.id,
                        item: ing.item,
                        quantity: ing.quantity,
                        unit: ing.unit,
                    } as TransferItem)
            )
            .map(
                async (item) =>
                    await pb
                        .collection(PocketBaseModel.TRANSFER_ITEMS)
                        .create(item)
            )
    );

    return transfer;
}

/** Creates Transfer and TransferItem record for input warehouse and item. */
async function createInputTransfer(
    pb: PocketBase,
    transactionId: string,
    warehouseId: string,
    itemId: string
): Promise<Transfer> {
    const transfer: Transfer = await pb
        .collection(PocketBaseModel.TRANSFERS)
        .create({
            transaction: transactionId,
            into: warehouseId,
        });
    const item: Item = await pb
        .collection(PocketBaseModel.ITEMS)
        .getOne(itemId);
    await pb.collection(PocketBaseModel.TRANSFER_ITEMS).create({
        transfer: transfer.id,
        item: item.id,
        quantity: 1,
        unit: item.unit,
        unitPrice: item.unitPrice,
        totalPrice: 1 * item.unitPrice!,
    } as TransferItem);

    return transfer;
}

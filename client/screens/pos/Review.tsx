import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useEffect } from "react";
import { View } from "react-native";
import { DataTable, Text } from "react-native-paper";
import { Tag } from "../../models";
import { WarehouseService } from "../../services/warehouse";

import { RootStackParamList } from "../navigation";

const HARDCODED_WAREHOUSE_ID = "ffcf67ob673v8p0";

export default function ReviewScreen({
    route,
}: NativeStackScreenProps<RootStackParamList, "POS">) {
    const { orders }: { orders: Record<string, number> } = route.params!;

    useEffect(() => {
        const service = new WarehouseService();
        (async () => {
            const stocks = await service.Stocks(
                HARDCODED_WAREHOUSE_ID,
                new URLSearchParams({
                    filter: `is_sellable=true`,
                    expand: `item.tags`,
                })
            );
            const tags = stocks
                .map((stock) => stock.expand?.item.expand?.tags as Tag[])
                .flat()
                .filter((tag) => Boolean(tag))
                .reduce(
                    (tags, tag) => ({ ...tags, [tag.id!]: tag }),
                    {} as Record<string, Tag>
                );
        })();
    }, []);

    return (
        <View>
            <Text>{JSON.stringify(orders, null, 2)}</Text>
            <DataTable>
                <DataTable.Header>
                    <DataTable.Title>Item</DataTable.Title>
                    <DataTable.Title numeric>Quantity</DataTable.Title>
                    <DataTable.Title numeric>Total Price</DataTable.Title>
                </DataTable.Header>
            </DataTable>
        </View>
    );
}

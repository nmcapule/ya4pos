import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useEffect } from "react";
import { View } from "react-native";
import { DataTable, Text } from "react-native-paper";
import { WarehouseService } from "../../services/warehouse";

import { RootStackParamList } from "../navigation";

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
                    expand: `item_id.tags`,
                })
            );
            const tags = stocks
                .map((stock) => stock.expand?.item_id.expand?.tags as Tag[])
                .flat()
                .filter((tag) => Boolean(tag))
                .reduce(
                    (tags, tag) => ({ ...tags, [tag.id!]: tag }),
                    {} as Record<string, Tag>
                );

            setStocks(stocks);
            setTags(Object.values(tags));
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

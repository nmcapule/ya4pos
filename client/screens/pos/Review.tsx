import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Button, DataTable } from "react-native-paper";

import { WarehouseStock } from "../../models";
import { WarehouseService } from "../../services/warehouse";
import { RootStackParamList } from "../navigation";

const HARDCODED_WAREHOUSE_ID = "ffcf67ob673v8p0";

export default function ReviewScreen({
    route,
}: NativeStackScreenProps<RootStackParamList, "POS">) {
    const [stocksLookup, setStocksLookup] = useState<
        Record<string, WarehouseStock>
    >({});

    const { orders }: { orders: Record<string, number> } = route.params!;

    useEffect(() => {
        const service = new WarehouseService();
        (async () => {
            const stocks = await service.Stocks(
                HARDCODED_WAREHOUSE_ID,
                new URLSearchParams({
                    filter: `sellable=true`,
                    expand: `item.tags`,
                })
            );
            setStocksLookup(
                stocks
                    .filter((stock) => stock.quantity! > 0)
                    .reduce(
                        (lookup, stock) => ({ ...lookup, [stock.id!]: stock }),
                        {} as Record<string, WarehouseStock>
                    )
            );
        })();
    }, []);

    return (
        <View style={styles.container}>
            <ScrollView>
                <DataTable>
                    <DataTable.Header>
                        <DataTable.Title style={styles.labelCell}>
                            Item
                        </DataTable.Title>
                        <DataTable.Title numeric>Quantity</DataTable.Title>
                        <DataTable.Title numeric>Total Price</DataTable.Title>
                    </DataTable.Header>
                    {Object.entries(orders)
                        .map(([id, count]): [WarehouseStock, number] => [
                            stocksLookup[id!],
                            count,
                        ])
                        .filter(([stock, _]) => Boolean(stock))
                        .map(([stock, count]) => (
                            <DataTable.Row key={stock.id}>
                                <DataTable.Cell style={styles.labelCell}>
                                    {stock.expand?.item.label}
                                </DataTable.Cell>
                                <DataTable.Cell numeric>{count}</DataTable.Cell>
                                <DataTable.Cell numeric>
                                    PHP {count * stock.unitPrice!}
                                </DataTable.Cell>
                            </DataTable.Row>
                        ))}
                    <DataTable.Row>
                        <DataTable.Cell style={styles.labelCell}>
                            Total
                        </DataTable.Cell>
                        <DataTable.Cell numeric>--</DataTable.Cell>
                        <DataTable.Cell numeric>
                            PHP{" "}
                            {Object.entries(orders)
                                .map(
                                    ([id, count]): [WarehouseStock, number] => [
                                        stocksLookup[id!] ?? {},
                                        count,
                                    ]
                                )
                                .reduce(
                                    (sum, [stock, count]) =>
                                        sum + count * stock.unitPrice!,
                                    0
                                )}
                        </DataTable.Cell>
                    </DataTable.Row>
                </DataTable>
            </ScrollView>
            <View style={styles.spacer}></View>
            <Button style={styles.submit} mode="outlined">
                Confirm Order
            </Button>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#fcfcfc",
        flex: 1,
    },
    labelCell: {
        flexGrow: 2,
    },
    spacer: {
        flexGrow: 1,
    },
    submit: {
        margin: ".5em",
    },
});

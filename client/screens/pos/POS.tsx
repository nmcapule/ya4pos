import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Button, Card, Chip, FAB, List, Text } from "react-native-paper";

import type { WarehouseStock } from "../../models";
import { WarehouseService } from "../../services/warehouse";
import { RootStackParamList } from "../navigation";

const HARDCODED_WAREHOUSE_ID = "ffcf67ob673v8p0";

export default function POSScreen({
    navigation,
}: NativeStackScreenProps<RootStackParamList, "POS">) {
    const [stocks, setStocks] = useState<WarehouseStock[]>([]);
    const [orders, setOrders] = useState<Record<string, number>>({});

    const addOrder = (stock: WarehouseStock) =>
        setOrders({ ...orders, [stock.id!]: (orders[stock.id!] ?? 0) + 1 });
    const clearOrder = (stock: WarehouseStock) =>
        confirm(
            `Clear all current orders for ${stock.expand?.item_id.label}?`
        ) && setOrders({ ...orders, [stock.id!]: 0 });
    const reviewOrders = () => navigation.navigate("Review", { orders });

    const renderQuantity = (stock: WarehouseStock) => {
        const count = orders[stock.id!] ?? 0;
        if (count === 0) {
            return "";
        }
        const icon = stock.expand?.item_id.icon;
        return <Chip mode="outlined" icon={icon}>{`x${count}`}</Chip>;
    };

    useEffect(() => {
        const service = new WarehouseService();
        (async () => {
            setStocks(
                await service.Stocks(
                    HARDCODED_WAREHOUSE_ID,
                    new URLSearchParams({
                        filter: `is_sellable=true`,
                        expand: `item_id`,
                    })
                )
            );
        })();
    }, []);

    return (
        <View style={styles.container}>
            <ScrollView>
                {stocks.map((stock) => (
                    <List.Item
                        key={stock.id}
                        title={stock.expand?.item_id.label}
                        style={styles.item}
                        description={`PHP ${stock.unit_price}\n${stock.expand?.item_id.description}`}
                        onPress={() => addOrder(stock)}
                        onLongPress={() => clearOrder(stock)}
                        left={(props) => (
                            <List.Icon
                                {...props}
                                icon={stock.expand?.item_id.icon}
                            />
                        )}
                        right={(props) => (
                            <Text {...props}>{renderQuantity(stock)}</Text>
                        )}
                    />
                ))}
            </ScrollView>
            <FAB
                style={styles.fab}
                icon="checkbox-marked-circle-plus-outline"
                onPress={() => reviewOrders()}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    item: {
        backgroundColor: "#fcfcfc",
    },
    spacer: {
        flexGrow: 1,
    },
    fab: {
        position: "absolute",
        margin: 16,
        right: 0,
        bottom: 0,
    },
});

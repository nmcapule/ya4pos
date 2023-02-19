import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Button, Card, FAB, Text } from "react-native-paper";

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
        setOrders({
            ...orders,
            [stock.id!]: (orders[stock.id!] ?? 0) + 1,
        });
    const clearOrder = (stock: WarehouseStock) =>
        confirm(
            `Clear all current orders for ${stock.expand?.item_id.label}?`
        ) && setOrders({ ...orders, [stock.id!]: 0 });
    const reviewOrders = () => navigation.navigate("Review", { orders });

    const renderTitle = (stock: WarehouseStock): string =>
        `${stock.expand?.item_id.label} - PHP ${stock.expand?.item_id.unit_price}`;
    const renderQuantity = (stock: WarehouseStock): string => {
        const count = orders[stock.id!] ?? 0;
        const emoji = stock.expand?.item_id.emoji;
        if (count > 3) {
            return `${emoji} x${count}`;
        }
        return Array(count).fill(emoji).join("");
    };
    const showDetails = (stock: WarehouseStock) =>
        window.alert(JSON.stringify(stock, null, 2));

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
            <ScrollView style={styles.cards}>
                {stocks.map((stock) => (
                    <Card style={styles.card} key={stock.id}>
                        <Card.Title title={renderTitle(stock)} />
                        <Card.Content>
                            <Text>{stock.expand?.item_id.description}</Text>
                            <Button
                                mode="text"
                                onPress={() => showDetails(stock)}
                            >
                                Show details in JSON
                            </Button>
                        </Card.Content>
                        <Card.Actions>
                            <Button
                                mode="text"
                                onPress={() => clearOrder(stock)}
                            >
                                {renderQuantity(stock)}
                            </Button>
                            <View style={styles.spacer} />
                            <Button onPress={() => addOrder(stock)}>+1</Button>
                        </Card.Actions>
                    </Card>
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
        // height: "100vh",
        flex: 1,
    },
    spacer: {
        flexGrow: 1,
    },
    cards: {
        overflow: "scroll",
    },
    card: {},
    fab: {
        position: "absolute",
        margin: 16,
        right: 0,
        bottom: 0,
    },
});

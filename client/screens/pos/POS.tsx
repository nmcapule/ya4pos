import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Chip, FAB, List, Text } from "react-native-paper";

import type { Tag, WarehouseStock } from "../../models";
import type { RootStackParamList } from "../navigation";
import { WarehouseService } from "../../services/warehouse";

const HARDCODED_WAREHOUSE_ID = "ffcf67ob673v8p0";

export default function POSScreen({
    navigation,
}: NativeStackScreenProps<RootStackParamList, "POS">) {
    const [stocks, setStocks] = useState<WarehouseStock[]>([]);
    const [orders, setOrders] = useState<Record<string, number>>({});
    const [tags, setTags] = useState<Tag[]>([]);
    const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());

    const addOrder = (stock: WarehouseStock) =>
        setOrders({ ...orders, [stock.id!]: (orders[stock.id!] ?? 0) + 1 });
    const clearOrder = (stock: WarehouseStock) =>
        confirm(`Clear all current orders for ${stock.expand?.item.label}?`) &&
        setOrders({ ...orders, [stock.id!]: 0 });
    const reviewOrders = () => navigation.navigate("Review", { orders });

    const renderQuantity = (stock: WarehouseStock) => {
        const count = orders[stock.id!] ?? 0;
        if (count === 0) {
            return "";
        }
        const icon = stock.expand?.item.icon;
        return <Chip mode="outlined" icon={icon}>{`x${count}`}</Chip>;
    };

    const toggleSelectedTag = (tagId: string) => {
        if (selectedTags.has(tagId)) {
            selectedTags.delete(tagId);
        } else {
            selectedTags.add(tagId);
        }
        setSelectedTags(new Set(selectedTags));
    };

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
            const tags = stocks
                .map((stock) => stock.expand?.item.expand?.tags as Tag[])
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
        <View style={styles.container}>
            <View style={styles.tags}>
                {Array.from(tags).map((tag) => (
                    <Chip
                        mode="outlined"
                        style={styles.tag}
                        key={tag.id}
                        selected={selectedTags.has(tag.id!)}
                        onPress={() => toggleSelectedTag(tag.id!)}
                    >
                        {tag.label}
                    </Chip>
                ))}
            </View>
            <ScrollView>
                {stocks
                    .filter((stock) => {
                        if (selectedTags.size === 0) return true;
                        const tags = stock.expand?.item.tags;
                        return Array.from(selectedTags).every((tag) =>
                            tags.includes(tag)
                        );
                    })
                    .map((stock) => (
                        <List.Item
                            key={stock.id}
                            title={stock.expand?.item.label}
                            style={styles.item}
                            description={`PHP ${stock.unitPrice}\n${stock.expand?.item.description}`}
                            onPress={() => addOrder(stock)}
                            onLongPress={() => clearOrder(stock)}
                            left={(props) => (
                                <List.Icon
                                    {...props}
                                    icon={stock.expand?.item.icon}
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
    tags: {
        flexDirection: "row",
        overflow: "scroll",
    },
    tag: {
        margin: ".2em",
    },
    item: {
        backgroundColor: "#fcfcfc",
    },
    fab: {
        position: "absolute",
        margin: 16,
        right: 0,
        bottom: 0,
    },
});

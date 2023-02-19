import { useEffect, useState } from "react";
import { View } from "react-native";
import { Text } from "react-native-paper";

import type { WarehouseStock } from "../../models";
import { WarehouseService } from "../../services/warehouse";

const HARDCODED_WAREHOUSE_ID = "ffcf67ob673v8p0";

export default function POSScreen() {
    const [stocks, setStocks] = useState<WarehouseStock[]>([]);

    useEffect(() => {
        const service = new WarehouseService();

        (async () => {
            setStocks(await service.Stocks(HARDCODED_WAREHOUSE_ID));
        })();
    }, []);

    return (
        <View>
            <Text>{JSON.stringify(stocks)}</Text>
        </View>
    );
}

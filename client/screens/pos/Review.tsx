import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { View } from "react-native";
import { Text } from "react-native-paper";

import { RootStackParamList } from "../navigation";

export default function ReviewScreen({
    route,
}: NativeStackScreenProps<RootStackParamList, "POS">) {
    return (
        <View>
            <Text>{JSON.stringify(route.params, null, 2)}</Text>
        </View>
    );
}

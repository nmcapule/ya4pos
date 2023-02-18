import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { StyleSheet, Text, View } from "react-native";
import { Button } from "react-native-paper";

import { RootStackParamList } from "../navigation";

export default function HelloScreen({
    navigation,
}: NativeStackScreenProps<RootStackParamList, "Hello">) {
    return (
        <View style={styles.container}>
            <Text>Open up App.tsx to start working on your app!</Text>
            <Button
                mode="outlined"
                onPress={() => navigation.navigate("Login")}
            >
                Go to Login
            </Button>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
});

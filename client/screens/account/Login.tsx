import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button, TextInput } from "react-native-paper";

import type { RootStackParamList } from "../navigation";
import { AuthenticationService } from "../../services/authentication";

async function login(username: string, password: string) {
    const service = new AuthenticationService();
    console.log(await service.login(username, password));
}

export default function LoginScreen({
    navigation,
}: NativeStackScreenProps<RootStackParamList, "Hello">) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    useEffect(() => {
        const service = new AuthenticationService();
        (async () => {
            const user = await service.verify();
            if (user) {
                navigation.navigate("POS");
            }
        })();
    });

    return (
        <View style={styles.container}>
            <TextInput
                mode="outlined"
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
            ></TextInput>
            <TextInput
                mode="outlined"
                placeholder="Password"
                secureTextEntry={true}
                value={password}
                onChangeText={setPassword}
            ></TextInput>
            <Button
                mode="outlined"
                style={styles.submit}
                onPress={async () => {
                    try {
                        await login(username, password);
                    } catch (e: unknown) {
                        console.error(e);
                    }
                    navigation.navigate("POS");
                }}
            >
                Submit
            </Button>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "stretch",
        justifyContent: "center",
        padding: "5%",
    },
    submit: {
        marginTop: "8pt",
    },
});

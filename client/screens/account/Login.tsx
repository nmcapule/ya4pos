import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button, TextInput } from "react-native-paper";
import { AuthenticationService } from "../../services/authentication";

async function login(username: string, password: string) {
    const service = new AuthenticationService();
    console.log(await service.login(username, password));
}

export default function LoginScreen() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

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
                onPress={() => login(username, password)}
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

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { linking, RootStackParamList } from "./screens/navigation";

import HelloScreen from "./screens/sandbox/Hello";
import LoginScreen from "./screens/account/Login";
import POSScreen from "./screens/pos/POS";
import ReviewScreen from "./screens/pos/Review";

const RootStack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
    return (
        <NavigationContainer linking={linking}>
            <RootStack.Navigator
                initialRouteName="Hello"
                screenOptions={{ animation: "none" }}
            >
                <RootStack.Screen name="Hello" component={HelloScreen} />
                <RootStack.Screen name="Login" component={LoginScreen} />
                <RootStack.Screen name="POS" component={POSScreen} />
                <RootStack.Screen name="Review" component={ReviewScreen} />
            </RootStack.Navigator>
        </NavigationContainer>
    );
}

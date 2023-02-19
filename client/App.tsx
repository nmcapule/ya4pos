import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { linking, RootStackParamList } from "./screens/navigation";

import LoginScreen from "./screens/account/Login";
import HelloScreen from "./screens/sandbox/Hello";
import POSScreen from "./screens/pos/POS";

const RootStack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
    return (
        <NavigationContainer linking={linking}>
            <RootStack.Navigator initialRouteName="Hello">
                <RootStack.Screen name="Hello" component={HelloScreen} />
                <RootStack.Screen name="POS" component={POSScreen} />
                <RootStack.Screen name="Login" component={LoginScreen} />
            </RootStack.Navigator>
        </NavigationContainer>
    );
}

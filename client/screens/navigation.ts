import { LinkingOptions } from "@react-navigation/native";

export type RootStackParamList = {
    Hello: undefined;
    Login: undefined;
    POS: undefined;
};

export const linking: LinkingOptions<ReactNavigation.RootParamList> = {
    prefixes: ["*"],
    config: {
        screens: {
            Hello: "hello",
            Login: "login",
            POS: "pos",
        },
    },
};

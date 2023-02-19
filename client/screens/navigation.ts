import { LinkingOptions } from "@react-navigation/native";

// TODO(nmcapule): I don't know how to use this :P
export type RootStackParamList = {
    Hello: undefined;
    Login: undefined;
    POS: undefined;
    Review: {
        orders: Record<string, number>;
    };
};

export const linking: LinkingOptions<ReactNavigation.RootParamList> = {
    prefixes: ["*"],
    config: {
        screens: {
            Hello: "hello",
            Login: "login",
            POS: "pos",
            Review: "review",
        },
    },
};

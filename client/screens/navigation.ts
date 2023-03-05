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
    prefixes: [
        "https://nmcapule-literate-parakeet-j4qvr9vv4xc5pgj-19006.preview.app.github.dev",
        "http://nmcapule.github.dev/ya4pos",
    ],
    config: {
        screens: {
            Hello: "hello",
            Login: "login",
            POS: "pos",
            Review: "review",
        },
    },
};

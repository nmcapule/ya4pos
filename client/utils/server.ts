import config from "./config";

export async function api<T = unknown>(
    path: string,
    init?: RequestInit
): Promise<T> {
    const res = await fetch(
        `${config.SERVER_URL}${path}`,
        Object.assign(
            {
                method: "GET",
                mode: "cors",
                credentials: "include",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
            },
            init
        )
    );
    if (res.status >= 400) {
        throw new Error(await res.text());
    }
    return res.json() as T;
}

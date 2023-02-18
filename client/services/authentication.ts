import config from "../utils/config";

export class AuthenticationService {
    async login(username: string, password: string) {
        return await fetch(`${config.SERVER_URL}/api/v1/authentication`, {
            method: "POST",
            mode: "cors",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password }),
        });
    }
}

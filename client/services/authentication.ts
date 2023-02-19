import { api } from "../utils/server";

export class AuthenticationService {
    async login(username: string, password: string) {
        return await api("/api/v1/authentication", {
            method: "POST",
            body: JSON.stringify({ username, password }),
        });
    }
}

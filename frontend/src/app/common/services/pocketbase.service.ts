import { Injectable } from '@angular/core';
import PocketBase from 'pocketbase';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root',
})
export class PocketbaseService {
    pb = new PocketBase(environment.apiUrl);

    constructor() {
        this.tryLoadFromCookie(document.cookie);
    }

    private async tryLoadFromCookie(cookie: string) {
        this.pb.authStore.loadFromCookie(cookie);
        try {
            this.pb.authStore.isValid &&
                (await this.pb.collection('users').authRefresh());
        } catch (_) {
            this.pb.authStore.clear();
        }
    }

    private async saveToCookie() {
        document.cookie = this.pb.authStore.exportToCookie({ httpOnly: false });
    }

    async login(username: string, password: string) {
        const auth = await this.pb
            .collection('users')
            .authWithPassword(username, password);
        console.log(auth);
        this.saveToCookie();
    }

    async logout() {
        this.pb.authStore.clear();
        this.saveToCookie();
    }
}

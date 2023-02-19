import type { Warehouse, WarehouseStock } from "../models";
import { api } from "../utils/server";

export class WarehouseService {
    async List(params = new URLSearchParams()) {
        return await api<Warehouse[]>(
            `/api/v1/warehouses?${params?.toString()}`
        );
    }

    async View(id: string, params = new URLSearchParams()) {
        return await api<Warehouse[]>(
            `/api/v1/warehouses/${id}?${params?.toString()}`
        );
    }

    async Stocks(id: string, params = new URLSearchParams()) {
        return await api<WarehouseStock[]>(
            `/api/v1/warehouses/${id}/stocks?${params?.toString()}`
        );
    }
}

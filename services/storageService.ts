import { ZomatoOrder } from '../types';

const STORAGE_KEY = 'ck_orders_v1';

const getOrderKey = (o: any) => (o.order_id ?? o.orderId ?? o.id ?? JSON.stringify(o));

function loadRaw(): ZomatoOrder[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as ZomatoOrder[];
  } catch {
    return [];
  }
}

function persist(orders: ZomatoOrder[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
  } catch {
    // ignore storage failures (quota, private mode)
  }
}

export const storageService = {
  loadOrders(): ZomatoOrder[] {
    return loadRaw();
  },

  /**
   * Save newOrders by merging with existing ones and deduplicating.
   * Deduplication key tries common id fields (order_id, orderId, id)
   * and falls back to JSON string if none exist.
   */
  saveOrders(newOrders: ZomatoOrder[]): ZomatoOrder[] {
    const existing = loadRaw();
    const map = new Map<string, ZomatoOrder>();

    for (const o of existing) {
      map.set(getOrderKey(o), o);
    }
    for (const o of newOrders) {
      map.set(getOrderKey(o), o);
    }

    const merged = Array.from(map.values());
    persist(merged);
    return merged;
  },

  clearOrders() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }
};

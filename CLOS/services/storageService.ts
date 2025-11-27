
import { ZomatoOrder } from "../types";

const STORAGE_KEY = "cloud_kitchen_orders_v1";

export const storageService = {
  /**
   * Load all orders from local storage
   */
  loadOrders: (): ZomatoOrder[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error("Failed to load orders from storage", error);
      return [];
    }
  },

  /**
   * Save orders to local storage, merging with existing data and removing duplicates
   */
  saveOrders: (newOrders: ZomatoOrder[]): ZomatoOrder[] => {
    try {
      const existing = storageService.loadOrders();
      
      // Create a Map for deduplication based on Order ID
      const orderMap = new Map<string, ZomatoOrder>();
      
      // Load existing first
      existing.forEach(o => orderMap.set(o.orderId, o));
      
      // Add new (overwriting if ID exists, or you could skip. Overwriting ensures updates)
      newOrders.forEach(o => orderMap.set(o.orderId, o));
      
      const merged = Array.from(orderMap.values());
      
      // Sort by date desc
      merged.sort((a, b) => b.orderPlacedAt - a.orderPlacedAt);
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
      return merged;
    } catch (error) {
      console.error("Failed to save orders", error);
      alert("Storage limit reached! Try clearing old data.");
      return newOrders;
    }
  },

  /**
   * Clear all stored data
   */
  clearOrders: () => {
    localStorage.removeItem(STORAGE_KEY);
  }
};

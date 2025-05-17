import { useState, useCallback } from "react";
import { MenuItem, Table, OrderState } from "../lib/types";

export function useOrder() {
  const [orderState, setOrderState] = useState<OrderState>({
    items: [],
    selectedTable: null,
    orderNotes: "",
    kotGenerated: false,
  });

  const addItem = useCallback((item: MenuItem) => {
    setOrderState((prev) => {
      const existing = prev.items.find((o) => o.id === item.id);
      if (existing) {
        return {
          ...prev,
          items: prev.items.map((o) =>
            o.id === item.id ? { ...o, quantity: o.quantity + 1 } : o
          ),
          kotGenerated: false,
        };
      } else {
        return {
          ...prev,
          items: [...prev.items, { ...item, quantity: 1, notes: "" }],
          kotGenerated: false,
        };
      }
    });
  }, []);

  const adjustQuantity = useCallback((itemId: number, adjustment: number) => {
    setOrderState((prev) => {
      const existing = prev.items.find((o) => o.id === itemId);
      if (!existing) return prev;

      const newQuantity = existing.quantity + adjustment;
      if (newQuantity <= 0) {
        return {
          ...prev,
          items: prev.items.filter((o) => o.id !== itemId),
        };
      }

      return {
        ...prev,
        items: prev.items.map((o) =>
          o.id === itemId ? { ...o, quantity: newQuantity } : o
        ),
      };
    });
  }, []);

  const removeItem = useCallback((itemId: number) => {
    setOrderState((prev) => ({
      ...prev,
      items: prev.items.filter((o) => o.id !== itemId),
    }));
  }, []);

  const selectTable = useCallback((table: Table) => {
    if (table.status === "occupied") {
      if (
        !confirm("This table is currently occupied. Do you want to take over?")
      ) {
        return;
      }
    }
    setOrderState((prev) => ({ ...prev, selectedTable: table }));
  }, []);

  const updateItemNotes = useCallback((itemId: number, notes: string) => {
    setOrderState((prev) => ({
      ...prev,
      items: prev.items.map((item) =>
        item.id === itemId ? { ...item, notes } : item
      ),
    }));
  }, []);

  const updateOrderNotes = useCallback((notes: string) => {
    setOrderState((prev) => ({ ...prev, orderNotes: notes }));
  }, []);

  const generateKOT = useCallback(() => {
    if (!orderState.selectedTable) {
      alert("Please select a table first");
      return;
    }
    setOrderState((prev) => ({ ...prev, kotGenerated: true }));
  }, [orderState.selectedTable]);

  const closeKOT = useCallback(() => {
    setOrderState((prev) => ({ ...prev, kotGenerated: false }));
  }, []);

  const clearOrder = useCallback(() => {
    setOrderState((prev) => ({
      ...prev,
      items: [],
      orderNotes: "",
      kotGenerated: false,
    }));
  }, []);

  return {
    orderState,
    addItem,
    adjustQuantity,
    removeItem,
    selectTable,
    updateItemNotes,
    updateOrderNotes,
    generateKOT,
    closeKOT,
    clearOrder,
  };
}

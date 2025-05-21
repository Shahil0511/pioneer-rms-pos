// lib/types.ts
export interface DashboardProps {
  role: string;
  userName: string;
}

export interface MenuItem {
  id: number;
  name: string;
  price: number;
  category: string;
}

export interface OrderItem extends MenuItem {
  quantity: number;
  notes: string;
}

export interface Table {
  id: number;
  number: string;
  status: "vacant" | "occupied";
}

export interface RecentOrder {
  id: number;
  table: string;
  amount: number;
  time: string;
  status: "Preparing" | "Served" | "Delivered" | "Paid";
}

export type OrderState = {
  items: OrderItem[];
  selectedTable: Table | null;
  orderNotes: string;
  kotGenerated: boolean;
};

// lib/utils.ts
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return `₹${amount.toFixed(2)}`;
}

export function calculateTax(amount: number, rate: number = 0.05): number {
  return amount * rate;
}

export function calculateTotal(subtotal: number): number {
  return subtotal + calculateTax(subtotal);
}

export function formatTime(date: Date): string {
  return date.toLocaleTimeString("en-IN", {
    hour12: true,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

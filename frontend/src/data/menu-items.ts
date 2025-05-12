import { MenuItem } from "../lib/types";

export const MENU_ITEMS: MenuItem[] = [
  { id: 1, name: "Margherita Pizza", price: 250, category: "Pizza" },
  { id: 2, name: "Paneer Tikka", price: 180, category: "Appetizer" },
  { id: 3, name: "Veg Burger", price: 120, category: "Burger" },
  { id: 4, name: "French Fries", price: 90, category: "Sides" },
  { id: 5, name: "Cold Coffee", price: 80, category: "Beverage" },
  { id: 6, name: "Pepperoni Pizza", price: 280, category: "Pizza" },
  { id: 7, name: "Garlic Bread", price: 110, category: "Appetizer" },
  { id: 8, name: "Chicken Burger", price: 150, category: "Burger" },
  { id: 9, name: "Mojito", price: 120, category: "Beverage" },
  { id: 10, name: "Caesar Salad", price: 160, category: "Salad" },
  { id: 11, name: "Pasta Alfredo", price: 220, category: "Pasta" },
  { id: 12, name: "Masala Chai", price: 40, category: "Beverage" },
];

export const CATEGORIES = [
  "All",
  ...new Set(MENU_ITEMS.map((item) => item.category)),
];

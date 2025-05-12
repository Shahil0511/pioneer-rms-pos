// import { useState, useEffect } from "react";
// import { FiPlus, FiMinus, FiTrash2, FiPrinter, FiClock, FiUser } from "react-icons/fi";
// import { BsClockHistory } from "react-icons/bs";

// interface DashboardProps {
//     role: string;
//     userName: string;
// }

// interface MenuItem {
//     id: number;
//     name: string;
//     price: number;
//     category: string;
// }

// interface OrderItem extends MenuItem {
//     quantity: number;
//     notes: string;
// }

// interface Table {
//     id: number;
//     number: string;
//     status: "vacant" | "occupied";
// }

// const MENU_ITEMS: MenuItem[] = [
//     { id: 1, name: "Margherita Pizza", price: 250, category: "Pizza" },
//     { id: 2, name: "Paneer Tikka", price: 180, category: "Appetizer" },
//     { id: 3, name: "Veg Burger", price: 120, category: "Burger" },
//     { id: 4, name: "French Fries", price: 90, category: "Sides" },
//     { id: 5, name: "Cold Coffee", price: 80, category: "Beverage" },
//     { id: 6, name: "Pepperoni Pizza", price: 280, category: "Pizza" },
//     { id: 7, name: "Garlic Bread", price: 110, category: "Appetizer" },
//     { id: 8, name: "Chicken Burger", price: 150, category: "Burger" },
//     { id: 9, name: "Mojito", price: 120, category: "Beverage" },
// ];

// const TABLES: Table[] = [
//     { id: 1, number: "T1", status: "vacant" },
//     { id: 2, number: "T2", status: "occupied" },
//     { id: 3, number: "T3", status: "vacant" },
//     { id: 4, number: "T4", status: "vacant" },
//     { id: 5, number: "T5", status: "occupied" },
// ];

// export const Dashboard = ({ role, userName }: DashboardProps) => {
//     const [order, setOrder] = useState<OrderItem[]>([]);
//     const [kotGenerated, setKotGenerated] = useState(false);
//     const [selectedTable, setSelectedTable] = useState<Table | null>(null);
//     const [activeCategory, setActiveCategory] = useState<string>("All");
//     const [orderNotes, setOrderNotes] = useState<string>("");
//     const [itemNotes, setItemNotes] = useState<{ [key: number]: string }>({});
//     const [time, setTime] = useState<string>(new Date().toLocaleTimeString());
//     const [recentOrders, setRecentOrders] = useState<any[]>([]);

//     // Filter menu by category
//     const filteredMenu = activeCategory === "All"
//         ? MENU_ITEMS
//         : MENU_ITEMS.filter(item => item.category === activeCategory);

//     // Get unique categories
//     const categories = ["All", ...new Set(MENU_ITEMS.map(item => item.category))];

//     // Update time every second
//     useEffect(() => {
//         const timer = setInterval(() => {
//             setTime(new Date().toLocaleTimeString());
//         }, 1000);
//         return () => clearInterval(timer);
//     }, []);

//     // Mock recent orders data
//     useEffect(() => {
//         setRecentOrders([
//             { id: 1, table: "T2", amount: 450, time: "12:30 PM", status: "Preparing" },
//             { id: 2, table: "T5", amount: 680, time: "12:15 PM", status: "Served" },
//         ]);
//     }, []);

//     const addToOrder = (item: MenuItem) => {
//         setOrder((prev) => {
//             const existing = prev.find((o) => o.id === item.id);
//             if (existing) {
//                 return prev.map((o) =>
//                     o.id === item.id ? { ...o, quantity: o.quantity + 1 } : o
//                 );
//             } else {
//                 return [...prev, { ...item, quantity: 1, notes: "" }];
//             }
//         });
//         setKotGenerated(false);
//     };

//     const adjustQuantity = (itemId: number, adjustment: number) => {
//         setOrder((prev) => {
//             const existing = prev.find((o) => o.id === itemId);
//             if (!existing) return prev;

//             const newQuantity = existing.quantity + adjustment;
//             if (newQuantity <= 0) {
//                 return prev.filter((o) => o.id !== itemId);
//             }

//             return prev.map((o) =>
//                 o.id === itemId ? { ...o, quantity: newQuantity } : o
//             );
//         });
//     };

//     const removeFromOrder = (itemId: number) => {
//         setOrder((prev) => prev.filter((o) => o.id !== itemId));
//     };

//     const generateKOT = () => {
//         if (!selectedTable) {
//             alert("Please select a table first");
//             return;
//         }
//         setKotGenerated(true);
//         // In a real app, you would send this to the kitchen display system
//     };

//     const printBill = () => {
//         // In a real app, this would connect to a receipt printer
//         window.print();
//     };

//     const total = order.reduce((sum, item) => sum + item.price * item.quantity, 0);

//     const selectTable = (table: Table) => {
//         if (table.status === "occupied") {
//             if (!confirm("This table is currently occupied. Do you want to take over?")) {
//                 return;
//             }
//         }
//         setSelectedTable(table);
//     };

//     const updateItemNotes = (itemId: number, notes: string) => {
//         setItemNotes(prev => ({ ...prev, [itemId]: notes }));
//         setOrder(prev => prev.map(item =>
//             item.id === itemId ? { ...item, notes } : item
//         ));
//     };

//     return (
//         <div className="min-h-screen bg-gray-100 text-gray-900 font-sans">
//             {/* Header */}
//             <header className="bg-white shadow-sm">
//                 <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
//                     <div>
//                         <h1 className="text-2xl font-bold text-gray-800">Restaurant POS System</h1>
//                         <div className="flex items-center text-sm text-gray-600 mt-1">
//                             <FiClock className="mr-1" />
//                             <span>{new Date().toLocaleDateString()} | {time}</span>
//                         </div>
//                     </div>
//                     <div className="flex items-center space-x-4">
//                         <div className="flex items-center bg-blue-50 px-3 py-1 rounded-full">
//                             <FiUser className="mr-2 text-blue-600" />
//                             <span className="font-medium">{userName} ({role})</span>
//                         </div>
//                     </div>
//                 </div>
//             </header>

//             <main className="max-w-7xl mx-auto px-4 py-6">
//                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//                     {/* Left Column - Tables and Menu */}
//                     <div className="lg:col-span-2 space-y-6">
//                         {/* Tables Section */}
//                         <div className="bg-white rounded-lg shadow p-4">
//                             <h2 className="text-lg font-semibold mb-4">Tables</h2>
//                             <div className="grid grid-cols-5 gap-3">
//                                 {TABLES.map((table) => (
//                                     <button
//                                         key={table.id}
//                                         className={`p-3 rounded-lg text-center font-medium transition-all ${selectedTable?.id === table.id
//                                             ? "bg-blue-600 text-white"
//                                             : table.status === "occupied"
//                                                 ? "bg-red-100 text-red-800"
//                                                 : "bg-green-100 text-green-800 hover:bg-green-200"
//                                             }`}
//                                         onClick={() => selectTable(table)}
//                                     >
//                                         {table.number}
//                                         <div className="text-xs mt-1">
//                                             {table.status === "occupied" ? "Occupied" : "Vacant"}
//                                         </div>
//                                     </button>
//                                 ))}
//                             </div>
//                         </div>

//                         {/* Menu Section */}
//                         <div className="bg-white rounded-lg shadow p-4">
//                             <div className="flex justify-between items-center mb-4">
//                                 <h2 className="text-lg font-semibold">Menu</h2>
//                                 <div className="flex space-x-2 overflow-x-auto pb-2">
//                                     {categories.map((category) => (
//                                         <button
//                                             key={category}
//                                             className={`px-3 py-1 text-sm rounded-full whitespace-nowrap ${activeCategory === category
//                                                 ? "bg-blue-600 text-white"
//                                                 : "bg-gray-200 text-gray-700 hover:bg-gray-300"
//                                                 }`}
//                                             onClick={() => setActiveCategory(category)}
//                                         >
//                                             {category}
//                                         </button>
//                                     ))}
//                                 </div>
//                             </div>
//                             <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
//                                 {filteredMenu.map((item) => (
//                                     <button
//                                         key={item.id}
//                                         className="bg-gray-50 hover:bg-gray-100 p-3 rounded-lg text-left transition-colors"
//                                         onClick={() => addToOrder(item)}
//                                     >
//                                         <div className="font-medium">{item.name}</div>
//                                         <div className="text-sm text-gray-600">₹{item.price}</div>
//                                         <div className="text-xs text-gray-500 mt-1">{item.category}</div>
//                                     </button>
//                                 ))}
//                             </div>
//                         </div>
//                     </div>

//                     {/* Right Column - Order Summary */}
//                     <div className="space-y-6">
//                         {/* Current Order */}
//                         <div className="bg-white rounded-lg shadow p-4">
//                             <div className="flex justify-between items-center mb-4">
//                                 <h2 className="text-lg font-semibold">
//                                     {selectedTable ? `Table ${selectedTable.number}` : "No Table Selected"}
//                                 </h2>
//                                 {selectedTable && (
//                                     <span className={`px-2 py-1 text-xs rounded-full ${selectedTable.status === "occupied" ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}`}>
//                                         {selectedTable.status}
//                                     </span>
//                                 )}
//                             </div>

//                             {order.length === 0 ? (
//                                 <div className="text-center py-8 text-gray-500">
//                                     No items added. Select items from the menu.
//                                 </div>
//                             ) : (
//                                 <div className="space-y-3">
//                                     {order.map((item) => (
//                                         <div key={item.id} className="border-b pb-3 last:border-0">
//                                             <div className="flex justify-between items-start">
//                                                 <div>
//                                                     <div className="font-medium">{item.name}</div>
//                                                     <div className="text-sm text-gray-600">₹{item.price} x {item.quantity}</div>
//                                                     {item.notes && (
//                                                         <div className="text-xs text-gray-500 mt-1">Note: {item.notes}</div>
//                                                     )}
//                                                 </div>
//                                                 <div className="flex items-center space-x-2">
//                                                     <span className="font-medium">₹{item.price * item.quantity}</span>
//                                                     <div className="flex items-center bg-gray-100 rounded">
//                                                         <button
//                                                             className="px-2 py-1 text-gray-600 hover:bg-gray-200"
//                                                             onClick={() => adjustQuantity(item.id, -1)}
//                                                         >
//                                                             <FiMinus size={14} />
//                                                         </button>
//                                                         <span className="px-2 text-sm">{item.quantity}</span>
//                                                         <button
//                                                             className="px-2 py-1 text-gray-600 hover:bg-gray-200"
//                                                             onClick={() => adjustQuantity(item.id, 1)}
//                                                         >
//                                                             <FiPlus size={14} />
//                                                         </button>
//                                                     </div>
//                                                     <button
//                                                         className="text-red-500 hover:text-red-700"
//                                                         onClick={() => removeFromOrder(item.id)}
//                                                     >
//                                                         <FiTrash2 size={16} />
//                                                     </button>
//                                                 </div>
//                                             </div>
//                                             <input
//                                                 type="text"
//                                                 placeholder="Add note..."
//                                                 className="w-full mt-2 px-2 py-1 text-xs border rounded"
//                                                 value={itemNotes[item.id] || ""}
//                                                 onChange={(e) => updateItemNotes(item.id, e.target.value)}
//                                             />
//                                         </div>
//                                     ))}
//                                 </div>
//                             )}

//                             <div className="mt-4 pt-4 border-t">
//                                 <div className="flex justify-between font-medium mb-2">
//                                     <span>Subtotal:</span>
//                                     <span>₹{total}</span>
//                                 </div>
//                                 <div className="flex justify-between text-sm text-gray-600 mb-2">
//                                     <span>Tax (5%):</span>
//                                     <span>₹{(total * 0.05).toFixed(2)}</span>
//                                 </div>
//                                 <div className="flex justify-between font-bold text-lg">
//                                     <span>Total:</span>
//                                     <span>₹{(total * 1.05).toFixed(2)}</span>
//                                 </div>

//                                 <div className="mt-4 space-y-2">
//                                     <textarea
//                                         className="w-full px-3 py-2 text-sm border rounded"
//                                         placeholder="Order notes..."
//                                         value={orderNotes}
//                                         onChange={(e) => setOrderNotes(e.target.value)}
//                                         rows={2}
//                                     />
//                                     <div className="grid grid-cols-2 gap-2">
//                                         <button
//                                             className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center justify-center space-x-2 disabled:opacity-50"
//                                             onClick={generateKOT}
//                                             disabled={order.length === 0 || !selectedTable}
//                                         >
//                                             <FiPrinter size={18} />
//                                             <span>Send to Kitchen</span>
//                                         </button>
//                                         <button
//                                             className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded flex items-center justify-center space-x-2 disabled:opacity-50"
//                                             onClick={printBill}
//                                             disabled={order.length === 0 || !selectedTable}
//                                         >
//                                             <FiPrinter size={18} />
//                                             <span>Print Bill</span>
//                                         </button>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>

//                         {/* Recent Orders */}
//                         <div className="bg-white rounded-lg shadow p-4">
//                             <h2 className="text-lg font-semibold mb-4 flex items-center">
//                                 <BsClockHistory className="mr-2" />
//                                 Recent Orders
//                             </h2>
//                             {recentOrders.length === 0 ? (
//                                 <div className="text-center py-4 text-gray-500">No recent orders</div>
//                             ) : (
//                                 <div className="space-y-3">
//                                     {recentOrders.map((order) => (
//                                         <div key={order.id} className="border-b pb-3 last:border-0">
//                                             <div className="flex justify-between">
//                                                 <div>
//                                                     <div className="font-medium">Table {order.table}</div>
//                                                     <div className="text-sm text-gray-600">{order.time}</div>
//                                                 </div>
//                                                 <div className="text-right">
//                                                     <div className="font-medium">₹{order.amount}</div>
//                                                     <span className={`text-xs px-2 py-1 rounded-full ${order.status === "Served" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
//                                                         {order.status}
//                                                     </span>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     ))}
//                                 </div>
//                             )}
//                         </div>
//                     </div>
//                 </div>

//                 {/* KOT Modal */}
//                 {kotGenerated && (
//                     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//                         <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
//                             <div className="flex justify-between items-center mb-4">
//                                 <h3 className="text-xl font-bold">Kitchen Order Ticket</h3>
//                                 <button
//                                     className="text-gray-500 hover:text-gray-700"
//                                     onClick={() => setKotGenerated(false)}
//                                 >
//                                     ✕
//                                 </button>
//                             </div>
//                             <div className="mb-4">
//                                 <div className="font-medium">Table: {selectedTable?.number}</div>
//                                 <div className="text-sm text-gray-600">{new Date().toLocaleString()}</div>
//                             </div>
//                             <div className="border-y py-4 my-4">
//                                 {order.map((item) => (
//                                     <div key={item.id} className="flex justify-between mb-2">
//                                         <div>
//                                             {item.name} x {item.quantity}
//                                             {item.notes && (
//                                                 <div className="text-xs text-gray-500">Note: {item.notes}</div>
//                                             )}
//                                         </div>
//                                         <div>₹{item.price * item.quantity}</div>
//                                     </div>
//                                 ))}
//                             </div>
//                             <div className="flex justify-between font-bold">
//                                 <span>Total:</span>
//                                 <span>₹{total}</span>
//                             </div>
//                             <div className="mt-6 text-center text-sm text-gray-500">
//                                 Order sent to kitchen
//                             </div>
//                         </div>
//                     </div>
//                 )}
//             </main>
//         </div>
//     );
// };

import React, { useState, useEffect } from "react";
import { Header } from "../../components/pageComponents/dashboard/header";
import { TableSelector } from "../../components/pageComponents/dashboard/table-selector";
import { MenuSection } from "../../components/pageComponents/dashboard/menuSections";
import { OrderSummary } from "../../components/pageComponents/dashboard/order-summary";
import { RecentOrders } from "../../components/pageComponents/dashboard/recent-orders";
import { KOTModal } from "../../components/pageComponents/dashboard/kot-models";
import { useOrder } from "../../hooks/use-order";
import { MENU_ITEMS, CATEGORIES } from "../../data/menu-items";
import { TABLES } from "../../data/tables";
import { DashboardProps, RecentOrder } from "../../lib/types";

export const Dashboard: React.FC<DashboardProps> = ({ role, userName }) => {
    const [activeCategory, setActiveCategory] = useState<string>("All");
    const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);

    const {
        orderState,
        addItem,
        adjustQuantity,
        removeItem,
        selectTable,
        updateItemNotes,
        updateOrderNotes,
        generateKOT,
        closeKOT,

    } = useOrder();

    // Mock recent orders data
    useEffect(() => {
        setRecentOrders([
            { id: 1, table: "T2", amount: 450, time: "12:30 PM", status: "Preparing" },
            { id: 2, table: "T5", amount: 680, time: "12:15 PM", status: "Served" },
            { id: 3, table: "T1", amount: 320, time: "12:00 PM", status: "Delivered" },
        ]);
    }, []);

    const handlePrintBill = () => {
        // In a real application, this would connect to a receipt printer
        window.print();
    };

    return (
        <div className="min-h-screen bg-background">
            <Header userName={userName} role={role} />

            <main className="mx-auto max-w-7xl px-4 py-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Tables and Menu */}
                    <div className="lg:col-span-2 space-y-6">
                        <TableSelector
                            tables={TABLES}
                            selectedTable={orderState.selectedTable}
                            onSelectTable={selectTable}
                        />

                        <MenuSection
                            menuItems={MENU_ITEMS}
                            categories={CATEGORIES}
                            activeCategory={activeCategory}
                            onCategoryChange={setActiveCategory}
                            onAddToOrder={addItem}
                        />
                    </div>

                    {/* Right Column - Order Summary and Recent Orders */}
                    <div className="space-y-6">
                        <OrderSummary
                            orderState={orderState}
                            onAdjustQuantity={adjustQuantity}
                            onRemoveItem={removeItem}
                            onUpdateItemNotes={updateItemNotes}
                            onUpdateOrderNotes={updateOrderNotes}
                            onGenerateKOT={generateKOT}
                            onPrintBill={handlePrintBill}
                        />

                        <RecentOrders orders={recentOrders} />
                    </div>
                </div>

                {/* KOT Modal */}
                <KOTModal
                    open={orderState.kotGenerated}
                    onOpenChange={closeKOT}
                    orderState={orderState}
                />
            </main>
        </div>
    );
};

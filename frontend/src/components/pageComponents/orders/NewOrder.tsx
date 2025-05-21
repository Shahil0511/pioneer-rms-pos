import React, { useState, useEffect } from "react";
import { Header } from "../../../components/pageComponents/dashboard/utils/header";
import { TableSelector } from "../../../components/pageComponents/dashboard/utils/table-selector";
import { MenuSection } from "../menu/menuSections";
import { OrderSummary } from "../../../components/pageComponents/dashboard/utils/order-summary";
import { RecentOrders } from "../../../components/pageComponents/dashboard/utils/recent-orders";
import { KOTModal } from "../../../components/pageComponents/dashboard/utils/kot-models";
import { useOrder } from "../../../hooks/use-order";
import { MENU_ITEMS, CATEGORIES } from "../../../data/menu-items";
import { TABLES } from "../../../data/tables";
import { DashboardProps, RecentOrder } from "../../../lib/types";

export const NewOrder: React.FC<DashboardProps> = ({ role, userName }) => {
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

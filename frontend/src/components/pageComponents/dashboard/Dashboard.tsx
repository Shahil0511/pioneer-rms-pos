import React, { useState, useEffect } from "react";
import { Header } from "./utils/header";
import { TableSelector } from "./utils/table-selector";
import { RecentOrders } from "./utils/recent-orders";
import { useOrder } from "../../../hooks/use-order";
import { TABLES } from "../../../data/tables";
import { DashboardProps, RecentOrder } from "../../../lib/types";


export const Dashboard: React.FC<DashboardProps> = ({ role, userName }) => {
    const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
    const {
        orderState,
        selectTable,
    } = useOrder();

    // Mock recent orders data
    useEffect(() => {
        setRecentOrders([
            { id: 1, table: "T2", amount: 450, time: "12:30 PM", status: "Preparing" },
            { id: 2, table: "T5", amount: 680, time: "12:15 PM", status: "Served" },
            { id: 3, table: "T1", amount: 320, time: "12:00 PM", status: "Delivered" },
        ]);
    }, []);
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
                    </div>

                    {/* Right Column - Order Summary and Recent Orders */}
                    <div className="space-y-6">
                        <RecentOrders orders={recentOrders} />
                    </div>
                </div>
            </main>
        </div>
    );
};

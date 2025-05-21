import React, { useState, useEffect } from "react";
import { Header } from "./utils/header";
import { TableSelector } from "./utils/table-selector";
import { RecentOrders } from "./utils/recent-orders";
import { useOrder } from "../../../hooks/use-order";
import { TABLES } from "../../../data/tables";
import { DashboardProps, RecentOrder } from "../../../lib/types";
import { StatsCard } from "./utils/StatsCard";
import { QuickActions } from "./utils/QuickActions";
import { TodaysSpecial } from "./utils/TodaysSpecial";
import { KitchenStatus } from "./utils/KitchenStatus";

export const Dashboard: React.FC<DashboardProps> = ({ role, userName }) => {
    const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
    const [todaysRevenue, setTodaysRevenue] = useState(0);
    const [activeTables, setActiveTables] = useState(0);
    const [averageOrderTime, setAverageOrderTime] = useState(0);

    const {
        orderState,
        selectTable,
    } = useOrder();

    // Mock data initialization
    useEffect(() => {
        // Recent orders
        setRecentOrders([
            { id: 1, table: "T2", amount: 1450, time: "12:30 PM", status: "Preparing" },
            { id: 2, table: "T5", amount: 1680, time: "12:15 PM", status: "Served" },
            { id: 3, table: "T1", amount: 1320, time: "12:00 PM", status: "Delivered" },
            { id: 4, table: "T3", amount: 1520, time: "11:45 AM", status: "Paid" },
            { id: 5, table: "T2", amount: 1450, time: "12:30 PM", status: "Preparing" },
            { id: 6, table: "T5", amount: 1680, time: "12:15 PM", status: "Served" },
        ]);

        // Stats
        setTodaysRevenue(12450);
        setActiveTables(8);
        setAverageOrderTime(25);
    }, []);

    return (
        <div className="min-h-screen bg-background">
            <Header userName={userName} role={role} />

            <main className="mx-auto max-w-7xl px-4 py-6">
                {/* Stats Overview Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <StatsCard
                        title="Today's Revenue"
                        value={`₹${todaysRevenue}`}
                        change="+12% from yesterday"
                        icon="currency"
                    />
                    <StatsCard
                        title="Active Tables"
                        value={activeTables}
                        change={`${Math.round((activeTables / TABLES.length) * 100)}% occupancy`}
                        icon="table"
                    />
                    <StatsCard
                        title="Avg. Order Time"
                        value={`${averageOrderTime} mins`}
                        change="2 mins faster than last week"
                        icon="clock"
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Tables and Menu */}
                    <div className="lg:col-span-2 space-y-6">
                        <QuickActions
                            role={role}
                            onNewOrder={() => console.log("New order")}
                            onPrintBill={() => console.log("Print bill")}
                            onCallManager={() => console.log("Call manager")}
                        />

                        <TableSelector
                            tables={TABLES}
                            selectedTable={orderState.selectedTable}
                            onSelectTable={selectTable}
                        />

                        <TodaysSpecial
                            items={[
                                { id: 1, name: "Chef's Special Pasta", price: 1699, remaining: 12 },
                                { id: 2, name: "Seasonal Fruit Tart", price: 850, remaining: 5 }
                            ]}
                        />
                    </div>

                    {/* Right Column - Order Summary and Recent Orders */}
                    <div className="space-y-6">
                        <RecentOrders orders={recentOrders} />

                        <KitchenStatus
                            itemsInProgress={3}
                            itemsReady={2}
                            estimatedWaitTime="15-20 mins"
                        />
                    </div>
                </div>
            </main>
        </div>
    );
};
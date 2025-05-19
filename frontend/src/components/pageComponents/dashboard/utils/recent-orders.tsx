import React from "react";
import { Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../ui/card";
import { Badge } from "../../../ui/badge";
import { RecentOrder } from "../../../../lib/types";
import { formatCurrency } from "../../../../lib/utils";

interface RecentOrdersProps {
    orders: RecentOrder[];
}

export const RecentOrders: React.FC<RecentOrdersProps> = ({ orders }) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                    <Clock className="w-4 h-4" />
                    <span>Recent Orders</span>
                </CardTitle>
            </CardHeader>
            <CardContent>
                {orders.length === 0 ? (
                    <div className="text-center py-4 text-muted-foreground">
                        No recent orders
                    </div>
                ) : (
                    <div className="space-y-3">
                        {orders.map((order) => (
                            <div key={order.id} className="border-b pb-3 last:border-0">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <div className="font-medium">Table {order.table}</div>
                                        <div className="text-sm text-muted-foreground">{order.time}</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-medium">{formatCurrency(order.amount)}</div>
                                        <Badge
                                            variant={
                                                order.status === "Served" ? "default" :
                                                    order.status === "Preparing" ? "secondary" : "outline"
                                            }
                                            className="text-xs mt-1"
                                        >
                                            {order.status}
                                        </Badge>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
};
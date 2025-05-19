import React from "react";
import { Printer } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../ui/card";
import { Button } from "../../../ui/button";
import { Textarea } from "../../../ui/textarea";
import { Badge } from "../../../ui/badge";
import { Separator } from "../../../ui/separator";
import { OrderItemComponent } from "./order-items";
import { OrderState } from "../../../../lib/types";
import { formatCurrency, calculateTax, calculateTotal } from "../../../../lib/utils";

interface OrderSummaryProps {
    orderState: OrderState;
    onAdjustQuantity: (itemId: number, adjustment: number) => void;
    onRemoveItem: (itemId: number) => void;
    onUpdateItemNotes: (itemId: number, notes: string) => void;
    onUpdateOrderNotes: (notes: string) => void;
    onGenerateKOT: () => void;
    onPrintBill: () => void;
}

export const OrderSummary: React.FC<OrderSummaryProps> = ({
    orderState,
    onAdjustQuantity,
    onRemoveItem,
    onUpdateItemNotes,
    onUpdateOrderNotes,
    onGenerateKOT,
    onPrintBill,
}) => {
    const { items, selectedTable, orderNotes } = orderState;
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const tax = calculateTax(subtotal);
    const total = calculateTotal(subtotal);

    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-center">
                    <CardTitle>
                        {selectedTable ? `Table ${selectedTable.number}` : "No Table Selected"}
                    </CardTitle>
                    {selectedTable && (
                        <Badge variant={selectedTable.status === "occupied" ? "destructive" : "default"}>
                            {selectedTable.status}
                        </Badge>
                    )}
                </div>
            </CardHeader>
            <CardContent>
                {items.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                        No items added. Select items from the menu.
                    </div>
                ) : (
                    <div className="space-y-4">
                        {items.map((item) => (
                            <OrderItemComponent
                                key={item.id}
                                item={item}
                                onAdjustQuantity={onAdjustQuantity}
                                onRemove={onRemoveItem}
                                onUpdateNotes={onUpdateItemNotes}
                            />
                        ))}
                    </div>
                )}

                <div className="mt-6 pt-4 border-t space-y-2">
                    <div className="flex justify-between font-medium">
                        <span>Subtotal:</span>
                        <span>{formatCurrency(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                        <span>Tax (5%):</span>
                        <span>{formatCurrency(tax)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-bold text-lg">
                        <span>Total:</span>
                        <span>{formatCurrency(total)}</span>
                    </div>

                    <div className="mt-4 space-y-3">
                        <Textarea
                            placeholder="Order notes..."
                            value={orderNotes}
                            onChange={(e) => onUpdateOrderNotes(e.target.value)}
                            rows={2}
                        />
                        <div className="grid grid-cols-2 gap-3">
                            <Button
                                onClick={onGenerateKOT}
                                disabled={items.length === 0 || !selectedTable}
                                className="flex items-center space-x-2"
                            >
                                <Printer className="w-4 h-4" />
                                <span>Send to Kitchen</span>
                            </Button>
                            <Button
                                variant="outline"
                                onClick={onPrintBill}
                                disabled={items.length === 0 || !selectedTable}
                                className="flex items-center space-x-2"
                            >
                                <Printer className="w-4 h-4" />
                                <span>Print Bill</span>
                            </Button>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
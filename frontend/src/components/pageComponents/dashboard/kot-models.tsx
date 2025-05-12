import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../ui/dialog";
import { Separator } from "../../ui/separator";
import { OrderState } from "../../../lib/types";
import { formatCurrency } from "../../../lib/utils";

interface KOTModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    orderState: OrderState;
}

export const KOTModal: React.FC<KOTModalProps> = ({
    open,
    onOpenChange,
    orderState
}) => {
    const { items, selectedTable } = orderState;
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Kitchen Order Ticket</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <div>
                        <div className="font-medium">Table: {selectedTable?.number}</div>
                        <div className="text-sm text-muted-foreground">
                            {new Date().toLocaleString()}
                        </div>
                    </div>
                    <Separator />
                    <div className="space-y-2">
                        {items.map((item) => (
                            <div key={item.id} className="flex justify-between">
                                <div>
                                    {item.name} x {item.quantity}
                                    {item.notes && (
                                        <div className="text-xs text-muted-foreground">
                                            Note: {item.notes}
                                        </div>
                                    )}
                                </div>
                                <div>{formatCurrency(item.price * item.quantity)}</div>
                            </div>
                        ))}
                    </div>
                    <Separator />
                    <div className="flex justify-between font-bold">
                        <span>Total:</span>
                        <span>{formatCurrency(total)}</span>
                    </div>
                    <div className="text-center text-sm text-muted-foreground">
                        Order sent to kitchen
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

import React from "react";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "../../../ui/button";
import { Input } from "../../../ui/input";
import { OrderItem } from "../../../../lib/types";
import { formatCurrency } from "../../../../lib/utils";

interface OrderItemProps {
    item: OrderItem;
    onAdjustQuantity: (itemId: number, adjustment: number) => void;
    onRemove: (itemId: number) => void;
    onUpdateNotes: (itemId: number, notes: string) => void;
}

export const OrderItemComponent: React.FC<OrderItemProps> = ({
    item,
    onAdjustQuantity,
    onRemove,
    onUpdateNotes,
}) => {
    return (
        <div className="space-y-3 pb-3 border-b last:border-0">
            <div className="flex justify-between items-start">
                <div className="flex-1">
                    <div className="font-medium">{item.name}</div>
                    <div className="text-sm text-muted-foreground">
                        {formatCurrency(item.price)} x {item.quantity}
                    </div>
                    {item.notes && (
                        <div className="text-xs text-muted-foreground mt-1">
                            Note: {item.notes}
                        </div>
                    )}
                </div>
                <div className="flex items-center space-x-3">
                    <span className="font-medium">{formatCurrency(item.price * item.quantity)}</span>
                    <div className="flex items-center bg-muted rounded-md">
                        <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8"
                            onClick={() => onAdjustQuantity(item.id, -1)}
                        >
                            <Minus className="h-4 w-4" />
                        </Button>
                        <span className="px-3 text-sm">{item.quantity}</span>
                        <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8"
                            onClick={() => onAdjustQuantity(item.id, 1)}
                        >
                            <Plus className="h-4 w-4" />
                        </Button>
                    </div>
                    <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => onRemove(item.id)}
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            </div>
            <Input
                placeholder="Add note..."
                value={item.notes}
                onChange={(e) => onUpdateNotes(item.id, e.target.value)}
                className="text-xs"
            />
        </div>
    );
};
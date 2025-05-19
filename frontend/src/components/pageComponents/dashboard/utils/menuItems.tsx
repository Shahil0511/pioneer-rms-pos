import React from "react";
import { Button } from "../../../ui/button";
import { Badge } from "../../../ui/badge";
import { MenuItem } from "../../../../lib/types";
import { formatCurrency } from "../../../../lib/utils";

interface MenuItemProps {
    item: MenuItem;
    onAddToOrder: (item: MenuItem) => void;
}

export const MenuComponent: React.FC<MenuItemProps> = ({ item, onAddToOrder }) => {
    return (
        <Button
            variant="outline"
            className="h-auto p-4 text-left block w-full"
            onClick={() => onAddToOrder(item)}
        >
            <div className="space-y-2">
                <div className="font-medium">{item.name}</div>
                <div className="text-sm text-muted-foreground">{formatCurrency(item.price)}</div>
                <Badge variant="secondary" className="text-xs">
                    {item.category}
                </Badge>
            </div>
        </Button>
    );
};

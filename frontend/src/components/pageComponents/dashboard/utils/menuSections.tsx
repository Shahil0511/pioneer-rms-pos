import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../ui/card";
import { Button } from "../../../ui/button";
import { MenuComponent } from "./menuItems";

import { MenuItem } from "../../../../lib/types";


interface MenuSectionProps {
    menuItems: MenuItem[];
    categories: string[];
    activeCategory: string;
    onCategoryChange: (category: string) => void;
    onAddToOrder: (item: MenuItem) => void;
}

export const MenuSection: React.FC<MenuSectionProps> = ({
    menuItems,
    categories,
    activeCategory,
    onCategoryChange,
    onAddToOrder,
}) => {
    const filteredMenu = activeCategory === "All"
        ? menuItems
        : menuItems.filter(item => item.category === activeCategory);

    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-center">
                    <CardTitle>Menu</CardTitle>
                    <div className="flex space-x-2 overflow-x-auto pb-2">
                        {categories.map((category) => (
                            <Button
                                key={category}
                                variant={activeCategory === category ? "default" : "outline"}
                                size="sm"
                                className="whitespace-nowrap"
                                onClick={() => onCategoryChange(category)}
                            >
                                {category}
                            </Button>
                        ))}
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {filteredMenu.map((item) => (
                        <MenuComponent
                            key={item.id}
                            item={item}
                            onAddToOrder={onAddToOrder}
                        />
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};
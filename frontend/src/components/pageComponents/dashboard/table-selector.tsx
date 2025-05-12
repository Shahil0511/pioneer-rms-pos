import React from "react";
import { Button } from "../../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Badge } from "../../ui/badge";
import { Table } from "../../../lib/types";
import { cn } from "../../../lib/utils";

interface TableSelectorProps {
    tables: Table[];
    selectedTable: Table | null;
    onSelectTable: (table: Table) => void;
}

export const TableSelector: React.FC<TableSelectorProps> = ({
    tables,
    selectedTable,
    onSelectTable,
}) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Tables</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-4 gap-3">
                    {tables.map((table) => (
                        <Button
                            key={table.id}
                            variant={selectedTable?.id === table.id ? "default" : "outline"}
                            className={cn(
                                "h-auto p-4 flex flex-col space-y-2",
                                table.status === "occupied" && selectedTable?.id !== table.id &&
                                "border-destructive text-destructive hover:bg-destructive/10"
                            )}
                            onClick={() => onSelectTable(table)}
                        >
                            <span className="font-medium">{table.number}</span>
                            <Badge
                                variant={table.status === "occupied" ? "destructive" : "secondary"}
                                className="text-xs"
                            >
                                {table.status}
                            </Badge>
                        </Button>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};

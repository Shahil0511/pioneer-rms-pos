import React from "react";
import { Clock, User } from "lucide-react";
import { useTime } from "../../../hooks/use-time";
import { formatDate } from "../../../lib/utils";
import { Badge } from "../../ui/badge";

interface HeaderProps {
    userName: string;
    role: string;
}

export const Header: React.FC<HeaderProps> = ({ userName, role }) => {
    const time = useTime();
    const currentDate = formatDate(new Date());

    return (
        <header className="border-b bg-background shadow-sm">
            <div className="mx-auto max-w-7xl px-4 py-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">Restaurant POS System</h1>
                        <div className="flex items-center mt-1 text-sm text-muted-foreground">
                            <Clock className="w-4 h-4 mr-1" />
                            <span>{currentDate} | {time}</span>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <Badge variant="secondary" className="flex items-center space-x-2 px-3 py-2">
                            <User className="w-4 h-4" />
                            <span>{userName} ({role})</span>
                        </Badge>
                    </div>
                </div>
            </div>
        </header>
    );
};
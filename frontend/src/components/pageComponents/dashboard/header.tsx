"use client";

import React from "react";
import { Clock, User, Menu, X } from "lucide-react";
import { useTime } from "../../../hooks/use-time";
import { formatDate } from "../../../lib/utils";
import { Badge } from "../../ui/badge";
import { useState } from "react";

interface HeaderProps {
    userName: string;
    role: string;
}

export const Header: React.FC<HeaderProps> = ({ userName, role }) => {
    const time = useTime();
    const currentDate = formatDate(new Date());
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <header className="border-b bg-background shadow-sm w-full overflow-hidden">
            {/* Desktop and Tablet View */}
            <div className="mx-auto max-w-7xl px-3 py-3 sm:px-4 sm:py-4">
                <div className="flex flex-wrap items-center justify-between">
                    <div className="flex-1 min-w-0 pr-2">
                        {/* Title that wraps on small screens */}
                        <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground truncate">
                            Restaurant POS System
                        </h1>

                        {/* Date and Time - Hidden on smallest screens */}
                        <div className="hidden sm:flex items-center mt-1 text-xs sm:text-sm text-muted-foreground">
                            <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                            <span className="truncate">{currentDate} | {time}</span>
                        </div>
                    </div>

                    {/* Mobile view toggle */}
                    <button
                        className="sm:hidden p-1 rounded-md hover:bg-muted"
                        onClick={() => setIsExpanded(!isExpanded)}
                    >
                        {isExpanded ? (
                            <X className="h-5 w-5" />
                        ) : (
                            <Menu className="h-5 w-5" />
                        )}
                    </button>

                    {/* User badge - visible on sm screens and up */}
                    <div className="hidden sm:flex">
                        <Badge variant="secondary" className="flex items-center space-x-2 px-2 py-1 sm:px-3 sm:py-2">
                            <User className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span className="text-xs sm:text-sm truncate max-w-[120px] md:max-w-full">
                                {userName} ({role})
                            </span>
                        </Badge>
                    </div>
                </div>

                {/* Mobile Time Display */}
                <div className="sm:hidden flex items-center text-xs text-muted-foreground mt-1">
                    <Clock className="w-3 h-3 mr-1" />
                    <span className="truncate">{currentDate} | {time}</span>
                </div>

                {/* Mobile dropdown for user info */}
                {isExpanded && (
                    <div className="mt-2 pb-1 sm:hidden">
                        <Badge variant="secondary" className="flex items-center space-x-2 px-2 py-1 w-full justify-center">
                            <User className="w-3 h-3" />
                            <span className="text-xs truncate">
                                {userName} ({role})
                            </span>
                        </Badge>
                    </div>
                )}
            </div>
        </header>
    );
};
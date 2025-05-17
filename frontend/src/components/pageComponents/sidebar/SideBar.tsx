import {
    Home, Settings, Clock, BarChart, ChefHat, Truck, UserCog,
    ShoppingBasket, Package, HelpCircle, Utensils,
    LogOut, X, Menu
} from "lucide-react";
import { cn } from "../../../lib/utils";
import { NavLink } from "react-router-dom";
import { Button } from "../../ui/button";
import { useState, useEffect } from "react";

type Role = 'admin' | 'manager' | 'kitchen' | 'delivery' | 'customer';

interface SidebarProps {
    role: Role;
    defaultCollapsed?: boolean;
    className?: string;
}

export const Sidebar = ({ role, defaultCollapsed = false, className }: SidebarProps) => {
    const [collapsed, setCollapsed] = useState(defaultCollapsed);
    const [isMobileView, setIsMobileView] = useState(false);
    const [sidebarVisible, setSidebarVisible] = useState(false);

    // Detect mobile view and handle resize events
    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth < 768;
            setIsMobileView(mobile);

            // Auto-show sidebar when switching to desktop view
            if (!mobile) {
                setSidebarVisible(true);
                setCollapsed(defaultCollapsed);
            } else {
                setSidebarVisible(false);
            }
        };

        // Initial check
        handleResize();

        // Add event listener
        window.addEventListener('resize', handleResize);

        // Cleanup
        return () => window.removeEventListener('resize', handleResize);
    }, [defaultCollapsed]);

    // Common navigation items
    const commonNavItems = [
        {
            icon: <Home className="h-4 w-4" />,
            label: "Dashboard",
            path: "/dashboard",
            roles: ['admin', 'manager', 'kitchen', 'delivery']
        },
        {
            icon: <Clock className="h-4 w-4" />,
            label: "Orders",
            path: "/orders",
            roles: ['admin', 'manager', 'kitchen', 'delivery', 'customer'],
            subItems: role === 'customer' ? [] : [
                { label: "New Orders", path: "/orders/new" },
                { label: "In Progress", path: "/orders/processing" },
                { label: "Completed", path: "/orders/completed" }
            ]
        },
        {
            icon: <ShoppingBasket className="h-4 w-4" />,
            label: "Menu",
            path: "/menu",
            roles: ['admin', 'manager', 'customer'],
            subItems: role === 'customer' ? [] : [
                { label: "Categories", path: "/menu/categories" },
                { label: "Items", path: "/menu/items" },
                { label: "Special Offers", path: "/menu/offers" }
            ]
        }
    ];

    // Role-specific navigation items
    const roleNavItems = [
        // Admin specific
        {
            icon: <UserCog className="h-4 w-4" />,
            label: "Staff Management",
            path: "/staff",
            roles: ['admin'],
            subItems: [
                { label: "All Staff", path: "/staff/all" },
                { label: "Roles & Permissions", path: "/staff/roles" },
                { label: "Schedule", path: "/staff/schedule" }
            ]
        },
        // Manager specific
        {
            icon: <BarChart className="h-4 w-4" />,
            label: "Reports",
            path: "/reports",
            roles: ['admin', 'manager'],
            subItems: [
                { label: "Sales", path: "/reports/sales" },
                { label: "Inventory", path: "/reports/inventory" },
                { label: "Customer Insights", path: "/reports/customers" }
            ]
        },
        // Kitchen specific
        {
            icon: <ChefHat className="h-4 w-4" />,
            label: "Kitchen Display",
            path: "/kitchen",
            roles: ['kitchen'],
            subItems: [
                { label: "Active Orders", path: "/kitchen/active" },
                { label: "Prep Station", path: "/kitchen/prep" },
                { label: "Inventory Alerts", path: "/kitchen/inventory" }
            ]
        },
        // Delivery specific
        {
            icon: <Truck className="h-4 w-4" />,
            label: "Delivery Console",
            path: "/delivery",
            roles: ['delivery'],
            subItems: [
                { label: "Assigned Orders", path: "/delivery/assigned" },
                { label: "Delivery Zones", path: "/delivery/zones" },
                { label: "Driver Performance", path: "/delivery/performance" }
            ]
        },
        // Customer specific
        {
            icon: <Package className="h-4 w-4" />,
            label: "My Orders",
            path: "/my-orders",
            roles: ['customer'],
            subItems: [
                { label: "Current", path: "/my-orders/current" },
                { label: "History", path: "/my-orders/history" },
                { label: "Favorites", path: "/my-orders/favorites" }
            ]
        }
    ];

    // Settings and support items
    const bottomNavItems = [
        {
            icon: <Settings className="h-4 w-4" />,
            label: "Settings",
            path: "/settings",
            roles: ['admin', 'manager', 'kitchen', 'delivery', 'customer'],
            subItems: role === 'customer' ? [] : [
                { label: "Account", path: "/settings/account" },
                { label: "Notifications", path: "/settings/notifications" },
                ...(role === 'admin' ? [{ label: "System", path: "/settings/system" }] : [])
            ]
        },
        {
            icon: <HelpCircle className="h-4 w-4" />,
            label: "Help & Support",
            path: "/support",
            roles: ['admin', 'manager', 'kitchen', 'delivery', 'customer']
        }
    ];

    // Combine all navigation items
    const allNavItems = [...commonNavItems, ...roleNavItems, ...bottomNavItems]
        .filter(item => item.roles.includes(role));

    // Toggle sidebar function - handles both collapse and visibility
    const toggleSidebar = () => {
        if (isMobileView) {
            setSidebarVisible(!sidebarVisible);
        } else {
            setCollapsed(!collapsed);
        }
    };

    // Calculate sidebar classes
    const sidebarClasses = cn(
        "fixed md:relative z-50 transition-all duration-300 ease-in-out",
        "h-[calc(100vh-69px)] max-w-full",
        "border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        "[&::-webkit-scrollbar-thumb]:bg-orange-500 [&::-webkit-scrollbar-track]:bg-orange-100/50 dark:[&::-webkit-scrollbar-track]:bg-orange-900/20", // Scrollbar styling
        {
            "w-16": collapsed && !isMobileView,
            "w-64": (!collapsed && !isMobileView) || isMobileView,
            "translate-x-0": sidebarVisible,
            "-translate-x-full": !sidebarVisible,
        },
        className
    );

    return (
        <>
            <div className={sidebarClasses}>
                <div className="flex h-full flex-col">
                    {/* Header with toggle button */}
                    <div className="flex h-14 items-center justify-between border-b px-3 dark:border-gray-800">
                        {/* Branding - Only shown when not collapsed or on mobile */}
                        {(!collapsed || isMobileView) && (
                            <div className="flex items-center gap-2 font-semibold">
                                <div className="h-6 w-6 rounded-full bg-gradient-to-r from-primary to-orange-600 flex items-center justify-center text-white">
                                    <Utensils className="h-3 w-3" />
                                </div>
                                <span className="dark:text-white text-sm">PionerPOS</span>
                            </div>
                        )}

                        {/* Toggle button */}
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={toggleSidebar}
                            className="hover:bg-orange-100 dark:hover:bg-orange-900/20 text-foreground dark:text-white h-8 w-8"
                        >
                            {(collapsed && !isMobileView) ? (
                                <Menu className="h-4 w-4" />
                            ) : (
                                <X className="h-4 w-4" />
                            )}
                        </Button>
                    </div>

                    {/* Scrollable Navigation Area */}
                    <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar">
                        <div
                            className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-orange-500 scrollbar-track-orange-100/50 dark:scrollbar-track-orange-900/20"
                        >
                            <nav className="flex flex-col gap-1 px-2 py-3">
                                {allNavItems.map((item, index) => (
                                    <div key={index} className="w-full">
                                        <NavLink
                                            to={item.path}
                                            className={({ isActive }) => cn(
                                                "flex items-center h-10 px-3 rounded-md text-xs font-medium transition-colors",
                                                "hover:bg-orange-500 hover:text-white dark:hover:bg-orange-700 dark:hover:text-white",
                                                isActive
                                                    ? "bg-gradient-to-r from-primary/10 to-orange-600/10 text-primary dark:text-orange-400 border-l-2 border-primary dark:border-orange-500"
                                                    : "text-foreground/80 dark:text-gray-300",
                                                collapsed && !isMobileView ? "justify-center" : "justify-start"
                                            )}
                                        >
                                            <span className={cn(collapsed && !isMobileView ? "" : "mr-2")}>
                                                {item.icon}
                                            </span>
                                            {(!collapsed || isMobileView) && (
                                                <span className="truncate">{item.label}</span>
                                            )}
                                        </NavLink>

                                        {/* Sub-items - Only shown when not collapsed or on mobile */}
                                        {(!collapsed || isMobileView) && item.subItems && item.subItems.length > 0 && (
                                            <div className="ml-3 pl-3 border-l border-primary/20 py-1 space-y-1">
                                                {item.subItems.map((subItem, subIndex) => (
                                                    <NavLink
                                                        key={subIndex}
                                                        to={subItem.path}
                                                        className={({ isActive }) => cn(
                                                            "flex items-center h-8 px-2 rounded-md text-xs font-medium transition-colors",
                                                            isActive
                                                                ? "text-primary dark:text-orange-400 font-semibold"
                                                                : "text-muted-foreground dark:text-gray-400 hover:text-orange-600 dark:hover:text-orange-300"
                                                        )}
                                                    >
                                                        <span className="truncate">{subItem.label}</span>
                                                    </NavLink>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </nav>
                        </div>
                    </div>

                    {/* Bottom Section */}
                    <div className="mt-auto p-2 border-t">
                        <div className="space-y-1">
                            {/* Sign Out */}
                            <Button
                                variant="ghost"
                                size="sm"
                                className={cn(
                                    "w-full h-10 text-xs font-medium flex items-center transition-colors",
                                    "hover:bg-orange-500 hover:text-white dark:hover:bg-orange-700 dark:hover:text-white",
                                    "text-foreground/80 dark:text-gray-300",
                                    collapsed && !isMobileView ? "justify-center px-0" : "justify-start px-3"
                                )}
                            >
                                <LogOut className={cn("h-4 w-4", collapsed && !isMobileView ? "" : "mr-2")} />
                                {(!collapsed || isMobileView) && (
                                    <span className="truncate">Sign Out</span>
                                )}
                            </Button>

                        </div>

                        {/* User Profile - Only shown when not collapsed or on mobile */}
                        {(!collapsed || isMobileView) && (
                            <div className="flex items-center gap-2 p-2 mt-2 bg-muted/50 dark:bg-gray-800/50 rounded-md">
                                <div className="h-6 w-6 rounded-full bg-gradient-to-r from-primary to-orange-600 flex items-center justify-center text-white">
                                    {role === 'admin' && <UserCog className="h-3 w-3" />}
                                    {role === 'manager' && <BarChart className="h-3 w-3" />}
                                    {role === 'kitchen' && <ChefHat className="h-3 w-3" />}
                                    {role === 'delivery' && <Truck className="h-3 w-3" />}
                                    {role === 'customer' && <Package className="h-3 w-3" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-medium truncate dark:text-white">
                                        {role.charAt(0).toUpperCase() + role.slice(1)} User
                                    </p>
                                    <p className="text-xs text-muted-foreground dark:text-gray-400 truncate">
                                        {role}@example.com
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile menu toggle button - always visible on mobile when sidebar is hidden */}
            {isMobileView && (
                <Button
                    variant="outline"
                    size="icon"
                    onClick={toggleSidebar}
                    className={cn(
                        "fixed z-50 md:hidden shadow-md rounded-full h-10 w-10 transition-all duration-300",
                        "bg-orange-500 text-white hover:bg-orange-600", // Always orange
                        sidebarVisible ? "right-3 top-3" : "right-3 bottom-3"
                    )}
                >
                    {sidebarVisible ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
                </Button>
            )}

            {/* Overlay to close sidebar when clicking outside on mobile */}
            {isMobileView && sidebarVisible && (
                <div
                    className="fixed inset-0 bg-black/30 dark:bg-black/70 z-40 md:hidden backdrop-blur-sm"
                    onClick={toggleSidebar}
                    aria-hidden="true"
                />

            )}
        </>
    );
};
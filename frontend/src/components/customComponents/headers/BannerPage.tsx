"use client";

import { Sun, Moon, LogIn, UserPlus, Utensils, LogOut, Menu } from "lucide-react";
import { Button } from "../../ui/button";
import { toast } from "../../ui/toast/Toast";
import { useAppSelector } from "../../../store/hooks";
import { useState } from "react";

interface HeaderProps {
    theme: "light" | "dark";
    toggleTheme: () => void;
    isAuthenticated: boolean;
    onLogin: () => void;
    onSignup: () => void;
    onLogout: () => void;
}

export const Header = ({
    theme,
    toggleTheme,
    isAuthenticated,
    onLogin,
    onSignup,
    onLogout,
}: HeaderProps) => {
    const { user } = useAppSelector((state) => state.auth);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleLogoutWithToast = () => {
        onLogout();
        setMobileMenuOpen(false);
        toast({
            title: "Success",
            description: "Logged out successfully!",
            variant: "success",
        });
    };

    return (
        <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto px-3 py-3 sm:px-4 sm:py-4 flex justify-between items-center">
                <div className="flex items-center space-x-2">
                    <Utensils className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-primary flex-shrink-0" />
                    <h1 className="text-lg sm:text-xl md:text-2xl font-bold truncate">PioneerPOS</h1>
                </div>

                <div className="flex items-center">
                    {/* Theme Toggle */}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleTheme}
                        aria-label="Toggle theme"
                        className="hover:bg-transparent mr-2"
                    >
                        {theme === "dark" ? (
                            <Sun className="h-4 w-4 sm:h-5 sm:w-5" />
                        ) : (
                            <Moon className="h-4 w-4 sm:h-5 sm:w-5" />
                        )}
                    </Button>

                    {/* User Greeting (if authenticated) */}
                    {isAuthenticated && user && (
                        <span className="hidden md:inline text-sm font-medium text-muted-foreground mr-2">
                            Hello, {user.name}
                        </span>
                    )}

                    {/* Auth Buttons for Desktop */}
                    <div className="hidden md:flex space-x-2">
                        {isAuthenticated ? (
                            <Button
                                variant="secondary"
                                onClick={handleLogoutWithToast}
                                className="flex items-center gap-2"
                                size="sm"
                            >
                                <LogOut className="h-4 w-4" />
                                <span>Logout</span>
                            </Button>
                        ) : (
                            <>
                                <Button
                                    onClick={onLogin}
                                    className="flex items-center gap-2"
                                    size="sm"
                                >
                                    <LogIn className="h-4 w-4" />
                                    <span>Login</span>
                                </Button>
                                <Button
                                    variant="secondary"
                                    onClick={onSignup}
                                    className="flex items-center gap-2"
                                    size="sm"
                                >
                                    <UserPlus className="h-4 w-4" />
                                    <span>Sign Up</span>
                                </Button>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="p-1"
                        >
                            <Menu className="h-5 w-5" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden border-t bg-background/95 py-2 px-4 animate-in slide-in-from-top">
                    {isAuthenticated && user && (
                        <div className="py-2 border-b mb-2">
                            <span className="text-sm font-medium">Hello, {user.name}</span>
                        </div>
                    )}
                    <div className="flex flex-col space-y-2">
                        {isAuthenticated ? (
                            <Button
                                variant="secondary"
                                onClick={handleLogoutWithToast}
                                className="flex items-center justify-center gap-2 w-full"
                                size="sm"
                            >
                                <LogOut className="h-4 w-4" />
                                <span>Logout</span>
                            </Button>
                        ) : (
                            <>
                                <Button
                                    onClick={() => {
                                        onLogin();
                                        setMobileMenuOpen(false);
                                    }}
                                    className="flex items-center justify-center gap-2 w-full"
                                    size="sm"
                                >
                                    <LogIn className="h-4 w-4" />
                                    <span>Login</span>
                                </Button>
                                <Button
                                    variant="secondary"
                                    onClick={() => {
                                        onSignup();
                                        setMobileMenuOpen(false);
                                    }}
                                    className="flex items-center justify-center gap-2 w-full"
                                    size="sm"
                                >
                                    <UserPlus className="h-4 w-4" />
                                    <span>Sign Up</span>
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
};
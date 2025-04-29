"use client";

import { Sun, Moon, LogIn, UserPlus, Utensils, LogOut } from "lucide-react";
import { Button } from "../../ui/button";
import { toast } from "../../ui/toast/Toast";

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

    const handleLogoutWithToast = () => {
        onLogout();
        toast({
            title: "Success",
            description: "Logged out successfully!",
            variant: "success",
        });
    };

    return (
        <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <div className="flex items-center space-x-2">
                    <Utensils className="h-8 w-8 text-primary" />
                    <h1 className="text-2xl font-bold">PioneerPOS</h1>
                </div>

                <div className="flex items-center space-x-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleTheme}
                        aria-label="Toggle theme"
                        className="hover:bg-transparent"
                    >
                        {theme === 'dark' ? (
                            <Sun className="h-5 w-5" />
                        ) : (
                            <Moon className="h-5 w-5" />
                        )}
                    </Button>

                    <div className="hidden md:flex space-x-2">
                        {isAuthenticated ? (
                            <Button
                                variant="secondary"
                                onClick={handleLogoutWithToast}
                                className="flex items-center gap-2"
                            >
                                <LogOut className="h-4 w-4" />
                                <span>Logout</span>
                            </Button>
                        ) : (
                            <>
                                <Button
                                    onClick={onLogin}
                                    className="flex items-center gap-2"
                                >
                                    <LogIn className="h-4 w-4" />
                                    <span>Login</span>
                                </Button>
                                <Button
                                    variant="secondary"
                                    onClick={onSignup}
                                    className="flex items-center gap-2"
                                >
                                    <UserPlus className="h-4 w-4" />
                                    <span>Sign Up</span>
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};
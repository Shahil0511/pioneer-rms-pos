import { Sun, Moon, LogIn, UserPlus, Utensils } from "lucide-react";
import { Button } from "../../ui/button";

interface HeaderProps {
    theme: "light" | "dark";
    toggleTheme: () => void;
    setActiveAuthForm: (form: "login" | "signup") => void;
    setShowLogin: (show: boolean) => void;
    setShowSignup: (show: boolean) => void;
}

export const Header = ({
    theme,
    toggleTheme,
    setActiveAuthForm,
    setShowLogin,
    setShowSignup,
}: HeaderProps) => {
    return (
        <header className="container mx-auto px-4 py-6 flex justify-between items-center">
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
                >
                    {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </Button>

                <div className="hidden md:flex space-x-2">
                    <Button
                        onClick={() => {
                            setActiveAuthForm("login");
                            setShowLogin(true);
                            setShowSignup(false);
                        }}
                        className="flex items-center gap-2"
                    >
                        <LogIn className="h-4 w-4" />
                        <span>Login</span>
                    </Button>
                    <Button
                        variant="secondary"
                        onClick={() => {
                            setActiveAuthForm("signup");
                            setShowSignup(true);
                            setShowLogin(false);
                        }}
                        className="flex items-center gap-2"
                    >
                        <UserPlus className="h-4 w-4" />
                        <span>Sign Up</span>
                    </Button>
                </div>
            </div>
        </header>
    );
};
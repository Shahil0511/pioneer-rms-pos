import { Card, CardHeader, CardTitle, CardContent } from "../../ui/card";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { XCircle, LogIn, UserPlus } from "lucide-react";

interface AuthModalProps {
    activeAuthForm: "login" | "signup";
    formData: {
        email: string;
        password: string;
        name: string;
    };
    onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSubmit: (e: React.FormEvent) => void;
    onClose: () => void;
    onSwitchForm: (formType: "login" | "signup") => void;
}

export const AuthModal = ({
    activeAuthForm,
    formData,
    onInputChange,
    onSubmit,
    onClose,
    onSwitchForm,
}: AuthModalProps) => {
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-md">
                <CardHeader className="flex flex-row justify-between items-center">
                    <CardTitle>
                        {activeAuthForm === "login" ? "Login to Your Account" : "Create an Account"}
                    </CardTitle>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onClose}
                    >
                        <XCircle className="h-6 w-6" />
                    </Button>
                </CardHeader>
                <CardContent>
                    <form onSubmit={onSubmit} className="space-y-4">
                        {activeAuthForm === "signup" && (
                            <div className="space-y-2">
                                <Label htmlFor="name">Full Name</Label>
                                <Input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={onInputChange}
                                    required
                                />
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={onInputChange}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={onInputChange}
                                required
                            />
                        </div>

                        <Button type="submit" className="w-full flex gap-2">
                            {activeAuthForm === "login" ? (
                                <>
                                    <LogIn className="h-5 w-5" />
                                    <span>Login</span>
                                </>
                            ) : (
                                <>
                                    <UserPlus className="h-5 w-5" />
                                    <span>Sign Up</span>
                                </>
                            )}
                        </Button>
                    </form>

                    <div className="mt-4 text-center text-sm text-muted-foreground">
                        {activeAuthForm === "login" ? (
                            <p>
                                Don't have an account?{' '}
                                <Button
                                    variant="link"
                                    onClick={() => onSwitchForm("signup")}
                                    className="px-0"
                                >
                                    Sign up
                                </Button>
                            </p>
                        ) : (
                            <p>
                                Already have an account?{' '}
                                <Button
                                    variant="link"
                                    onClick={() => onSwitchForm("login")}
                                    className="px-0"
                                >
                                    Login
                                </Button>
                            </p>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
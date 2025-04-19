import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../../ui/card";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { XCircle, LogIn, UserPlus, MailCheck, RotateCw } from "lucide-react";
import { useToast } from "../../ui/toast/Toast";
import { authService } from "../../../services/authService";

type AuthForm = "login" | "signup" | "verify-email";

interface AuthModalProps {
    activeAuthForm: AuthForm;
    onClose: () => void;
    onAuthSuccess: (userData: any) => void;
}

interface FormData {
    email: string;
    password: string;
    name: string;
    otp: string;
}

export const AuthModal = ({
    activeAuthForm: initialForm,
    onClose,
    onAuthSuccess,
}: AuthModalProps) => {
    const [activeAuthForm, setActiveAuthForm] = useState<AuthForm>(initialForm);
    const [formData, setFormData] = useState<FormData>({
        email: "",
        password: "",
        name: "",
        otp: "",
    });
    const [isLoading, setIsLoading] = useState(false);
    const [, setOtpSent] = useState(false);
    const [otpCountdown, setOtpCountdown] = useState(0);
    const { toast } = useToast();

    useEffect(() => {
        if (otpCountdown > 0) {
            const timer = setTimeout(() => setOtpCountdown(otpCountdown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [otpCountdown]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            if (activeAuthForm === "signup") {
                await handleSignup();
            } else if (activeAuthForm === "verify-email") {
                await handleVerifyEmail();
            } else {
                await handleLogin();
            }
        } catch (error) {
            console.error("Authentication error:", error);
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "An unknown error occurred",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleSignup = async () => {
        // Basic validation
        if (!formData.name || !formData.email || !formData.password) {
            throw new Error("Please fill all fields");
        }

        // Send OTP to email
        await authService.sendOtp(formData.email);
        setOtpSent(true);
        setOtpCountdown(60); // 60 seconds countdown
        setActiveAuthForm("verify-email");
        toast({
            title: "OTP Sent",
            description: "We've sent a verification code to your email",
        });
    };

    const handleVerifyEmail = async () => {
        if (!formData.otp) {
            throw new Error("Please enter the OTP");
        }

        // Verify OTP and complete registration
        const user = await authService.verifyOtpAndRegister({
            email: formData.email,
            otp: formData.otp,
            name: formData.name,
            password: formData.password,
        });

        onAuthSuccess(user);
        onClose();
        toast({
            title: "Registration Successful",
            description: "Your account has been created successfully",
        });
    };

    const handleLogin = async () => {
        if (!formData.email || !formData.password) {
            throw new Error("Please fill all fields");
        }

        const user = await authService.login(formData.email, formData.password);
        onAuthSuccess(user);
        onClose();
        toast({
            title: "Login Successful",
            description: "You've successfully logged in",
        });
    };

    const resendOtp = async () => {
        if (otpCountdown > 0) return;

        setIsLoading(true);
        try {
            await authService.sendOtp(formData.email);
            setOtpCountdown(60);
            toast({
                title: "OTP Resent",
                description: "We've sent a new verification code to your email",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to resend OTP",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const switchForm = (formType: AuthForm) => {
        setActiveAuthForm(formType);
        setFormData({
            email: formType === "login" ? formData.email : "",
            password: "",
            name: "",
            otp: "",
        });
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-md">
                <CardHeader className="flex flex-row justify-between items-center">
                    <CardTitle>
                        {activeAuthForm === "login" && "Login to Your Account"}
                        {activeAuthForm === "signup" && "Create an Account"}
                        {activeAuthForm === "verify-email" && "Verify Your Email"}
                    </CardTitle>
                    <Button variant="ghost" size="icon" onClick={onClose}>
                        <XCircle className="h-6 w-6" />
                    </Button>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {activeAuthForm === "verify-email" ? (
                            <div className="space-y-4">
                                <div className="flex flex-col items-center space-y-2">
                                    <MailCheck className="h-12 w-12 text-primary" />
                                    <p className="text-center text-sm text-muted-foreground">
                                        We've sent a 6-digit verification code to{" "}
                                        <span className="font-medium text-foreground">
                                            {formData.email}
                                        </span>
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="otp">Verification Code</Label>
                                    <Input
                                        type="text"
                                        id="otp"
                                        name="otp"
                                        value={formData.otp}
                                        onChange={handleInputChange}
                                        placeholder="Enter 6-digit code"
                                        maxLength={6}
                                        required
                                    />
                                </div>

                                <div className="text-center text-sm">
                                    <Button
                                        variant="link"
                                        onClick={resendOtp}
                                        disabled={otpCountdown > 0 || isLoading}
                                        className="px-0"
                                    >
                                        {isLoading ? (
                                            <RotateCw className="h-4 w-4 animate-spin" />
                                        ) : (
                                            <>
                                                Didn't receive code?{" "}
                                                {otpCountdown > 0
                                                    ? `Resend in ${otpCountdown}s`
                                                    : "Resend now"}
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <>
                                {activeAuthForm === "signup" && (
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Full Name</Label>
                                        <Input
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
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
                                        onChange={handleInputChange}
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
                                        onChange={handleInputChange}
                                        required
                                        minLength={8}
                                    />
                                </div>
                            </>
                        )}

                        <Button
                            type="submit"
                            className="w-full flex gap-2"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <RotateCw className="h-5 w-5 animate-spin" />
                            ) : activeAuthForm === "login" ? (
                                <>
                                    <LogIn className="h-5 w-5" />
                                    <span>Login</span>
                                </>
                            ) : activeAuthForm === "verify-email" ? (
                                <>
                                    <MailCheck className="h-5 w-5" />
                                    <span>Verify Email</span>
                                </>
                            ) : (
                                <>
                                    <UserPlus className="h-5 w-5" />
                                    <span>Sign Up</span>
                                </>
                            )}
                        </Button>
                    </form>

                    {activeAuthForm !== "verify-email" && (
                        <div className="mt-4 text-center text-sm text-muted-foreground">
                            {activeAuthForm === "login" ? (
                                <p>
                                    Don't have an account?{" "}
                                    <Button
                                        variant="link"
                                        onClick={() => switchForm("signup")}
                                        className="px-0"
                                    >
                                        Sign up
                                    </Button>
                                </p>
                            ) : (
                                <p>
                                    Already have an account?{" "}
                                    <Button
                                        variant="link"
                                        onClick={() => switchForm("login")}
                                        className="px-0"
                                    >
                                        Login
                                    </Button>
                                </p>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};
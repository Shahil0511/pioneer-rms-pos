import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../../ui/card";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { XCircle, LogIn, UserPlus, MailCheck, RotateCw } from "lucide-react";
import { useToast } from "../../ui/toast/Toast";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import {
    loginUser,
    sendOtp,
    verifyOtpAndRegister,
    setOtpCountdown,
    decrementOtpCountdown,
    updateFormData
} from "../../../store/slices/authSlice";

type AuthForm = "login" | "signup" | "verify-email";

interface AuthModalProps {
    activeAuthForm: AuthForm;
    onClose: () => void;
    onAuthSuccess: (userData: any) => void;
    onSwitchForm: (formType: "login" | "signup") => void;
    formData: {
        email: string;
        password: string;
        name: string;
    };
    onFormDataChange: (data: {
        email: string;
        password: string;
        name: string;
    }) => void;
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
    onSwitchForm,
    formData: externalFormData,
    onFormDataChange,
}: AuthModalProps) => {
    const dispatch = useAppDispatch();
    const { loading, error, otpCountdown } = useAppSelector((state) => state.auth);

    const [activeAuthForm, setActiveAuthForm] = useState<AuthForm>(initialForm);
    const [internalFormData, setInternalFormData] = useState<FormData>({
        email: externalFormData.email,
        password: externalFormData.password,
        name: externalFormData.name,
        otp: "",
    });
    const [, setOtpSent] = useState(false);
    const { toast } = useToast();

    // Sync internal state with external form data changes
    useEffect(() => {
        setInternalFormData(prev => ({
            ...prev,
            email: externalFormData.email,
            password: externalFormData.password,
            name: externalFormData.name
        }));
    }, [externalFormData]);

    // Handle form switching
    useEffect(() => {
        setActiveAuthForm(initialForm);
    }, [initialForm]);

    // Handle OTP countdown timer
    useEffect(() => {
        if (otpCountdown > 0) {
            const timer = setTimeout(() => dispatch(decrementOtpCountdown()), 1000);
            return () => clearTimeout(timer);
        }
    }, [otpCountdown, dispatch]);

    // Display error toast when error occurs
    useEffect(() => {
        if (error) {
            toast({
                title: "Error",
                description: error,
                variant: "destructive",
            });
        }
    }, [error, toast]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const newData = {
            ...internalFormData,
            [name]: value
        };
        setInternalFormData(newData);

        // Update redux store form data for relevant fields
        if (name !== "otp") {
            dispatch(updateFormData({ field: name, value }));

            // Also update parent component's state
            onFormDataChange({
                email: name === "email" ? value : internalFormData.email,
                password: name === "password" ? value : internalFormData.password,
                name: name === "name" ? value : internalFormData.name
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

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
        }
    };

    const handleSignup = async () => {
        if (!internalFormData.name || !internalFormData.email || !internalFormData.password) {
            toast({
                title: "Error",
                description: "Please fill all fields",
                variant: "destructive",
            });
            return;
        }

        const resultAction = await dispatch(
            sendOtp({
                email: internalFormData.email,
                name: internalFormData.name,
                password: internalFormData.password
            })
        );

        if (sendOtp.fulfilled.match(resultAction)) {
            setOtpSent(true);
            setActiveAuthForm("verify-email");
            toast({
                title: "OTP Sent",
                description: "We've sent a verification code to your email",
                variant: "success",
            });
        }
    };

    const handleVerifyEmail = async () => {
        if (!internalFormData.otp) {
            toast({
                title: "Error",
                description: "Please enter the OTP",
                variant: "destructive",
            });
            return;
        }

        const resultAction = await dispatch(
            verifyOtpAndRegister({
                email: internalFormData.email,
                otp: internalFormData.otp
            })
        );

        if (verifyOtpAndRegister.fulfilled.match(resultAction)) {
            const userData = resultAction.payload;
            if (!userData.role) {
                userData.role = "CUSTOMER";
            }
            onAuthSuccess(userData);
            onClose();
            toast({
                title: "Registration Successful",
                description: "Your account has been created successfully",
                variant: "success"
            });
        }
    };

    const handleLogin = async () => {
        if (!internalFormData.email || !internalFormData.password) {
            toast({
                title: "Error",
                description: "Please fill all fields",
                variant: "destructive",
            });
            return;
        }

        const resultAction = await dispatch(
            loginUser({
                email: internalFormData.email,
                password: internalFormData.password
            })
        );

        if (loginUser.fulfilled.match(resultAction)) {
            onAuthSuccess(resultAction.payload);
            onClose();
            toast({
                title: "Login Successful",
                description: "You've successfully logged in",
                variant: "success"
            });
        }
    };

    const resendOtp = async () => {
        if (otpCountdown > 0) return;

        const resultAction = await dispatch(
            sendOtp({
                email: internalFormData.email,
                name: internalFormData.name,
                password: internalFormData.password
            })
        );

        if (sendOtp.fulfilled.match(resultAction)) {
            dispatch(setOtpCountdown(60));
            toast({
                title: "OTP Resent",
                description: "We've sent a new verification code to your email",
                variant: "success"
            });
        }
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
                                            {internalFormData.email}
                                        </span>
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="otp">Verification Code</Label>
                                    <Input
                                        type="text"
                                        id="otp"
                                        name="otp"
                                        value={internalFormData.otp}
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
                                        disabled={otpCountdown > 0 || loading}
                                        className="px-0"
                                    >
                                        {loading ? (
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
                                            value={internalFormData.name}
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
                                        value={internalFormData.email}
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
                                        value={internalFormData.password}
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
                            disabled={loading}
                        >
                            {loading ? (
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
                                        onClick={() => {
                                            onSwitchForm("signup");
                                            setActiveAuthForm("signup");
                                        }}
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
                                        onClick={() => {
                                            onSwitchForm("login");
                                            setActiveAuthForm("login");
                                        }}
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

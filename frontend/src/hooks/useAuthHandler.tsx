import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

// Define an enum for user roles
export enum UserRole {
    SUPER_ADMIN = "SUPER_ADMIN",
    ADMIN = "ADMIN",
    MANAGER = "MANAGER",
    KITCHEN = "KITCHEN",
    DELIVERY = "DELIVERY",
    CUSTOMER = "CUSTOMER",
}

// Centralized routes for scalability
const DASHBOARD_ROUTES: Record<UserRole, string> = {
    [UserRole.SUPER_ADMIN]: "/admin/dashboard",
    [UserRole.ADMIN]: "/admin/dashboard",
    [UserRole.MANAGER]: "/manager/dashboard",
    [UserRole.KITCHEN]: "/kitchen/dashboard",
    [UserRole.DELIVERY]: "/delivery/dashboard",
    [UserRole.CUSTOMER]: "/customer/dashboard",
};

// Strongly typed props for auth handler
type AuthSuccessHandlerProps = {
    userData: {
        token: string;
        role?: UserRole;
    };
};

export const useAuthHandler = () => {
    const navigate = useNavigate();

    const handleAuthSuccess = useCallback(
        ({ userData }: AuthSuccessHandlerProps) => {
            try {
                const userRole: UserRole = userData.role ?? UserRole.CUSTOMER;

                // Securely store token and role (consider sessionStorage for security)
                sessionStorage.setItem("authToken", userData.token);
                sessionStorage.setItem("userRole", userRole);

                // Determine target route
                const targetRoute = DASHBOARD_ROUTES[userRole] ?? "/";

                console.log("Navigating to:", targetRoute);
                navigate(targetRoute);

                return { targetRoute };
            } catch (error) {
                console.error("Auth Success Error:", error);
                throw new Error("Failed to handle authentication.");
            }
        },
        [navigate]
    );

    return { handleAuthSuccess };
};

export default useAuthHandler;

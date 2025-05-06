import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../../store/hooks";

interface ProtectedRouteProps {
    allowedRoles: string[];
    children: React.ReactNode;
}

export const ProtectedRoute = ({ allowedRoles, children }: ProtectedRouteProps) => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const { isAuthenticated, role: reduxRole } = useAppSelector((state) => state.auth);

    useEffect(() => {
        const checkAuth = () => {
            const token = localStorage.getItem("authToken");
            const localStorageRole = localStorage.getItem("userRole");

            // Determine the effective role (Redux state takes precedence)
            const effectiveRole = reduxRole || localStorageRole;

            // Check authorization
            if (!token || !effectiveRole || !allowedRoles.includes(effectiveRole)) {
                localStorage.removeItem("authToken");
                localStorage.removeItem("userRole");
                navigate('/');
            }
            setIsLoading(false);
        };

        checkAuth();
        window.addEventListener('storage', checkAuth);

        return () => window.removeEventListener('storage', checkAuth);
    }, [navigate, allowedRoles, isAuthenticated, reduxRole]);

    if (isLoading) {
        return <p>Loading</p>;
    }

    return <>{children}</>;
};
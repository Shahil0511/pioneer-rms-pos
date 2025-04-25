
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


interface ProtectedRouteProps {
    allowedRoles: string[];
    children: React.ReactNode;
}

export const ProtectedRoute = ({ allowedRoles, children }: ProtectedRouteProps) => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("authToken");
        const role = localStorage.getItem("userRole");

        if (!token || !role || !allowedRoles.includes(role)) {
            localStorage.removeItem("authToken");
            localStorage.removeItem("userRole");
            navigate('/login');
        }
        setIsLoading(false);
    }, [navigate, allowedRoles]);

    if (isLoading) {
        return <p>Loading</p>;
    }

    return <>{children}</>;
};
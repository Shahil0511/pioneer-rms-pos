import { Button } from "../ui/button";

interface DashboardProps {
    role: string;
}

export const Dashboard = ({ role }: DashboardProps) => {
    const handleLogout = () => {
        localStorage.removeItem("authToken");
        localStorage.removeItem("userRole");
        window.location.href = '/';
    };

    return (
        <div className="min-h-screen bg-background text-foreground p-8">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold">{role} Dashboard</h1>
                    <Button onClick={handleLogout}>Logout</Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-card p-6 rounded-lg shadow">
                        <h2 className="text-xl font-semibold mb-4">Welcome</h2>
                        <p>You are viewing the {role.toLowerCase()} dashboard</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
"use client";

interface StatsCardProps {
    title: string;
    value: string | number;
    change: string;
    icon: "currency" | "table" | "clock" | "users";
}

export const StatsCard: React.FC<StatsCardProps> = ({ title, value, change, icon }) => {
    const getIcon = () => {
        switch (icon) {
            case "currency": return "💰";
            case "table": return "🪑";
            case "clock": return "⏱️";
            case "users": return "👥";
            default: return "📊";
        }
    };

    return (
        <div className="bg-card text-card-foreground p-4 rounded-lg shadow border">
            <div className="flex items-center">
                <span className="text-2xl mr-3">{getIcon()}</span>
                <div>
                    <p className="text-sm text-muted-foreground">{title}</p>
                    <p className="text-2xl font-bold">{value}</p>
                </div>
            </div>
            <p className="text-xs mt-2 text-orange-500 dark:text-orange-400">{change}</p>
        </div>
    );
};
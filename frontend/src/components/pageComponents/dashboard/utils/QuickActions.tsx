"use client";

interface QuickActionsProps {
    role: string;
    onNewOrder: () => void;
    onPrintBill: () => void;
    onCallManager: () => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({
    role,
    onNewOrder,
    onPrintBill,
    onCallManager
}) => {
    return (
        <div className="bg-card text-card-foreground p-4 rounded-lg shadow border">
            <h3 className="font-medium mb-3">Quick Actions</h3>
            <div className="flex flex-wrap gap-2">
                <button
                    onClick={onNewOrder}
                    className="bg-primary text-primary-foreground px-3 py-2 rounded text-sm hover:bg-primary/90 transition-colors"
                >
                    New Order
                </button>

                <button
                    onClick={onPrintBill}
                    className="bg-orange-600 text-white px-3 py-2 rounded text-sm hover:bg-orange-700 transition-colors"
                >
                    Print Bill
                </button>

                {role === 'staff' && (
                    <button
                        onClick={onCallManager}
                        className="bg-yellow-500 text-white px-3 py-2 rounded text-sm hover:bg-yellow-600 transition-colors"
                    >
                        Call Manager
                    </button>
                )}
            </div>
        </div>
    );
};
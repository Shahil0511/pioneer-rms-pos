"use client";

interface KitchenStatusProps {
    itemsInProgress: number;
    itemsReady: number;
    estimatedWaitTime: string;
}

export const KitchenStatus: React.FC<KitchenStatusProps> = ({
    itemsInProgress,
    itemsReady,
    estimatedWaitTime
}) => {
    return (
        <div className="bg-card text-card-foreground p-4 rounded-lg shadow border">
            <h3 className="font-medium mb-3">Kitchen Status</h3>
            <div className="space-y-2">
                <div className="flex justify-between">
                    <span className="text-muted-foreground">In Progress:</span>

                    <span className="font-medium">{itemsInProgress}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Ready for Pickup:</span>
                    <span className="font-medium text-orange-500 dark:text-orange-400">{itemsReady}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Estimated Wait:</span>
                    <span className="font-medium">{estimatedWaitTime}</span>
                </div>
            </div>
        </div>
    );
};
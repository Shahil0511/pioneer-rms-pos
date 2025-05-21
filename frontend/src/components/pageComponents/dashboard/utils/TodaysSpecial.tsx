"use client";

interface SpecialItem {
    id: number;
    name: string;
    price: number;
    remaining: number;
}

interface TodaysSpecialProps {
    items: SpecialItem[];
}

export const TodaysSpecial: React.FC<TodaysSpecialProps> = ({ items }) => {
    return (
        <div className="bg-card text-card-foreground p-4 rounded-lg shadow border">
            <h3 className="font-medium mb-3">Today's Specials</h3>
            <div className="space-y-3">
                {items.map(item => (
                    <div key={item.id} className="flex justify-between items-center border-b pb-2 last:border-b-0">
                        <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-muted-foreground">₹{item.price.toFixed(2)}</p>
                        </div>
                        <span className="text-xs bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 px-2 py-1 rounded">
                            {item.remaining} left
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};
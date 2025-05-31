import { useEffect, useState } from 'react';

export const MenuItem = () => {
    const [localData, setLocalData] = useState<Record<string, string>>({});

    useEffect(() => {
        const allData: Record<string, string> = {};
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key) {
                allData[key] = localStorage.getItem(key) || '';
            }
        }
        setLocalData(allData);
    }, []);

    return (
        <div>
            <h2>Menu</h2>
            <h4>Local Storage Contents:</h4>
            <ul>
                {Object.entries(localData).map(([key, value]) => (
                    <li key={key}>
                        <strong>{key}:</strong> {value}
                    </li>
                ))}
            </ul>
        </div>
    );
};

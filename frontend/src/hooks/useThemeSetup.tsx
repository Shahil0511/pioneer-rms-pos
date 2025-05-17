import { useEffect, useState, useCallback } from "react";
import { useAppDispatch } from "../store/hooks";
import { setTheme } from "../store/slices/themeSlice";

// Theme mode constants
export enum ThemeMode {
    LIGHT = "light",
    DARK = "dark",
}

export const useThemeSetup = () => {
    const dispatch = useAppDispatch();
    const [mounted, setMounted] = useState(false);

    // Setup theme with safety and scalability
    const initializeTheme = useCallback(() => {
        try {
            const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
            const savedTheme = localStorage.getItem("theme") as ThemeMode | null;
            const themeToSet = savedTheme ?? (systemPrefersDark ? ThemeMode.DARK : ThemeMode.LIGHT);
            dispatch(setTheme(themeToSet));
        } catch (error) {
            console.error("Failed to initialize theme:", error);
        }
    }, [dispatch]);

    useEffect(() => {
        initializeTheme();
        setMounted(true);
    }, [initializeTheme]);

    // Return mounted state to ensure safe rendering
    return { mounted };
};

export default useThemeSetup;

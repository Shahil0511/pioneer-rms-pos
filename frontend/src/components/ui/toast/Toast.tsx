"use client";

import { X } from "lucide-react";
import { useState } from "react";

type ToastVariant = "default" | "destructive";

interface ToastProps {
    title?: string;
    description: string;
    variant?: ToastVariant;
    duration?: number;
}

export const useToast = () => {
    const [toast, setToast] = useState<ToastProps & { visible: boolean }>({
        visible: false,
        description: "",
    });

    const showToast = (props: ToastProps) => {
        setToast({ ...props, visible: true });

        // Auto-hide after duration
        const duration = props.duration || 3000;
        setTimeout(() => {
            setToast(prev => ({ ...prev, visible: false }));
        }, duration);
    };

    const ToastComponent = () => {
        if (!toast.visible) return null;

        const variantClasses = {
            default: "bg-background text-foreground border",
            destructive: "bg-destructive text-destructive-foreground border-destructive",
        };

        return (
            <div className={`fixed bottom-4 right-4 z-[100] p-4 rounded-lg shadow-lg w-[350px] ${variantClasses[toast.variant || "default"]
                }`}>
                <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                        {toast.title && <h3 className="font-medium">{toast.title}</h3>}
                        <p className="text-sm">{toast.description}</p>
                    </div>
                    <button
                        onClick={() => setToast(prev => ({ ...prev, visible: false }))}
                        className="p-1 rounded-md hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
            </div>
        );
    };

    return { toast: showToast, ToastComponent };
};
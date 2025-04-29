"use client";

import * as React from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertCircle, Info, XCircle } from "lucide-react";

const TOAST_LIMIT = 5;
const TOAST_REMOVE_DELAY = 1900;

type ToastVariant = "default" | "destructive" | "success" | "warning" | "info";

type ToasterToast = {
    id: string;
    title?: React.ReactNode;
    description?: React.ReactNode;
    variant?: ToastVariant;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    action?: React.ReactElement;
};

const actionTypes = {
    ADD_TOAST: "ADD_TOAST",
    UPDATE_TOAST: "UPDATE_TOAST",
    DISMISS_TOAST: "DISMISS_TOAST",
    REMOVE_TOAST: "REMOVE_TOAST",
} as const;

let count = 0;

function genId() {
    count = (count + 1) % Number.MAX_SAFE_INTEGER;
    return count.toString();
}

type ActionType = typeof actionTypes;

type Action =
    | {
        type: ActionType["ADD_TOAST"];
        toast: ToasterToast;
    }
    | {
        type: ActionType["UPDATE_TOAST"];
        toast: Partial<ToasterToast>;
    }
    | {
        type: ActionType["DISMISS_TOAST"];
        toastId?: ToasterToast["id"];
    }
    | {
        type: ActionType["REMOVE_TOAST"];
        toastId?: ToasterToast["id"];
    };

interface State {
    toasts: ToasterToast[];
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>();

const addToRemoveQueue = (toastId: string) => {
    if (toastTimeouts.has(toastId)) return;

    const timeout = setTimeout(() => {
        toastTimeouts.delete(toastId);
        dispatch({
            type: "REMOVE_TOAST",
            toastId: toastId,
        });
    }, TOAST_REMOVE_DELAY);

    toastTimeouts.set(toastId, timeout);
};

export const reducer = (state: State, action: Action): State => {
    switch (action.type) {
        case "ADD_TOAST":
            return {
                ...state,
                toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
            };

        case "UPDATE_TOAST":
            return {
                ...state,
                toasts: state.toasts.map((t) =>
                    t.id === action.toast.id ? { ...t, ...action.toast } : t
                ),
            };

        case "DISMISS_TOAST": {
            const { toastId } = action;
            if (toastId) {
                addToRemoveQueue(toastId);
            } else {
                state.toasts.forEach((toast) => {
                    addToRemoveQueue(toast.id);
                });
            }

            return {
                ...state,
                toasts: state.toasts.map((t) =>
                    t.id === toastId || toastId === undefined
                        ? {
                            ...t,
                            open: false,
                        }
                        : t
                ),
            };
        }
        case "REMOVE_TOAST":
            if (action.toastId === undefined) {
                return {
                    ...state,
                    toasts: [],
                };
            }
            return {
                ...state,
                toasts: state.toasts.filter((t) => t.id !== action.toastId),
            };
    }
};

const listeners: Array<(state: State) => void> = [];

let memoryState: State = { toasts: [] };

function dispatch(action: Action) {
    memoryState = reducer(memoryState, action);
    listeners.forEach((listener) => {
        listener(memoryState);
    });
}

type ToastOptions = Omit<ToasterToast, "id" | "open" | "onOpenChange">;

function toast(opts: ToastOptions) {
    const id = genId();

    const update = (props: ToastOptions) => {
        dispatch({
            type: "UPDATE_TOAST",
            toast: { ...props, id },
        });
    };

    const dismiss = () => {
        dispatch({ type: "DISMISS_TOAST", toastId: id });
    };

    dispatch({
        type: "ADD_TOAST",
        toast: {
            ...opts,
            id,
            open: true,
            onOpenChange: (open) => {
                if (!open) dismiss();
            },
        },
    });

    return {
        id,
        dismiss,
        update,
    };
}

function useToast() {
    const [state, setState] = React.useState<State>(memoryState);

    React.useEffect(() => {
        listeners.push(setState);
        return () => {
            const index = listeners.indexOf(setState);
            if (index > -1) {
                listeners.splice(index, 1);
            }
        };
    }, []);

    return {
        ...state,
        toast,
        dismiss: (toastId?: string) => dispatch({ type: "DISMISS_TOAST", toastId }),
    };
}

// Enhanced styling for enterprise look and feel
type ToastVariantStyles = {
    bg: string;
    text: string;
    border: string;
    icon: React.ReactNode | null;
    progress: string;
    shadow: string;
};

const getVariantStyles = (variant: ToastVariant = "default"): ToastVariantStyles => {
    const baseIconClass = "h-5 w-5 transition-opacity duration-200 ease-in-out";

    const variants: Record<ToastVariant, ToastVariantStyles> = {
        destructive: {
            bg: "bg-red-500/95 dark:bg-red-600/95 backdrop-blur-sm",
            text: "text-white",
            border: "border-red-600/30 dark:border-red-700/50",
            icon: <XCircle className={`${baseIconClass} text-red-100`} />,
            progress: "bg-gradient-to-r from-red-400 to-red-500",
            shadow: "shadow-lg shadow-red-500/20 dark:shadow-red-700/20",
        },
        success: {
            bg: "bg-emerald-500/95 dark:bg-emerald-600/95 backdrop-blur-sm",
            text: "text-white",
            border: "border-emerald-600/30 dark:border-emerald-700/50",
            icon: <CheckCircle2 className={`${baseIconClass} text-emerald-100`} />,
            progress: "bg-gradient-to-r from-emerald-400 to-emerald-500",
            shadow: "shadow-lg shadow-emerald-500/20 dark:shadow-emerald-700/20",
        },
        warning: {
            bg: "bg-amber-400/95 dark:bg-amber-500/95 backdrop-blur-sm",
            text: "text-amber-900 dark:text-amber-950",
            border: "border-amber-500/30 dark:border-amber-600/50",
            icon: <AlertCircle className={`${baseIconClass} text-amber-800`} />,
            progress: "bg-gradient-to-r from-amber-300 to-amber-400",
            shadow: "shadow-lg shadow-amber-400/20 dark:shadow-amber-500/20",
        },
        info: {
            bg: "bg-blue-500/95 dark:bg-blue-600/95 backdrop-blur-sm",
            text: "text-white",
            border: "border-blue-600/30 dark:border-blue-700/50",
            icon: <Info className={`${baseIconClass} text-blue-100`} />,
            progress: "bg-gradient-to-r from-blue-400 to-blue-500",
            shadow: "shadow-lg shadow-blue-500/20 dark:shadow-blue-700/20",
        },
        default: {
            bg: "bg-white/95 dark:bg-zinc-800/95 backdrop-blur-sm",
            text: "text-zinc-800 dark:text-zinc-100",
            border: "border-zinc-200/80 dark:border-zinc-700/50",
            icon: null,
            progress: "bg-gradient-to-r from-zinc-300 to-zinc-400 dark:from-zinc-600 dark:to-zinc-700",
            shadow: "shadow-lg shadow-black/5 dark:shadow-white/5",
        },
    };

    return variants[variant];
};

export function ToastComponent() {
    const { toasts } = useToast();

    return (
        <div className="fixed top-4 right-4 z-[100] space-y-3 pointer-events-none">
            <AnimatePresence>
                {toasts.map((toast) => (
                    <motion.div
                        key={toast.id}
                        layout
                        initial={{ opacity: 0, y: 15, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, x: 100, transition: { duration: 0.2 } }}
                        transition={{
                            type: "spring",
                            damping: 20,
                            stiffness: 300
                        }}
                        className="pointer-events-auto"
                    >
                        <ToastItem toast={toast} />
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
}

const ToastItem = ({ toast }: { toast: ToasterToast }) => {
    const { dismiss } = useToast();
    const variantStyles = getVariantStyles(toast.variant);

    React.useEffect(() => {
        if (toast.open) {
            const timer = setTimeout(() => {
                dismiss(toast.id);
            }, TOAST_REMOVE_DELAY);

            return () => clearTimeout(timer);
        }
    }, [toast.open, toast.id, dismiss]);

    return (
        <div
            className={`relative p-4 rounded-lg ${variantStyles.shadow} w-[350px] border ${variantStyles.bg} ${variantStyles.text} ${variantStyles.border} overflow-hidden`}
            role="alert"
        >
            <div className="flex gap-3">
                {variantStyles.icon && (
                    <div className="flex-shrink-0 pt-0.5">{variantStyles.icon}</div>
                )}
                <div className="flex-1 min-w-0">
                    {toast.title && (
                        <h3 className="font-medium leading-6 truncate pr-6">{toast.title}</h3>
                    )}
                    {toast.description && (
                        <p className="mt-1 text-sm opacity-90 line-clamp-2">{toast.description}</p>
                    )}
                    {toast.action && (
                        <div className="mt-2 flex justify-end">{toast.action}</div>
                    )}
                </div>
                <button
                    onClick={() => toast.onOpenChange?.(false)}
                    className="absolute top-2 right-2 p-1 rounded-md opacity-70 hover:opacity-100 transition-opacity focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background focus:ring-primary"
                    aria-label="Close notification"
                >
                    <X className="h-4 w-4" />
                </button>
            </div>
            {toast.open && (
                <motion.div
                    initial={{ width: "100%" }}
                    animate={{ width: "0%" }}
                    transition={{ duration: TOAST_REMOVE_DELAY / 1000, ease: "linear" }}
                    className={`absolute bottom-0 left-0 h-1 ${variantStyles.progress}`}
                />
            )}
        </div>
    );
};

export { useToast, toast };
"use client";

import * as React from "react";
import { X } from "lucide-react";

const TOAST_LIMIT = 1;
const TOAST_REMOVE_DELAY = 1000000;

type ToastVariant = "default" | "destructive";

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
    console.log("Adding to remove queue:", toastId);
    if (toastTimeouts.has(toastId)) {
        console.log("Toast already in remove queue:", toastId);
        return;
    }

    const timeout = setTimeout(() => {
        console.log("Remove timeout triggered for toast:", toastId);
        toastTimeouts.delete(toastId);
        dispatch({
            type: "REMOVE_TOAST",
            toastId: toastId,
        });
    }, TOAST_REMOVE_DELAY);

    toastTimeouts.set(toastId, timeout);
};

export const reducer = (state: State, action: Action): State => {
    console.log("Toast reducer called with action:", action.type, action);

    switch (action.type) {
        case "ADD_TOAST":
            console.log("Adding toast to state:", action.toast);
            return {
                ...state,
                toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
            };

        case "UPDATE_TOAST":
            console.log("Updating toast:", action.toast);
            return {
                ...state,
                toasts: state.toasts.map((t) =>
                    t.id === action.toast.id ? { ...t, ...action.toast } : t
                ),
            };

        case "DISMISS_TOAST": {
            const { toastId } = action;
            console.log("Dismissing toast:", toastId || "all toasts");

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
            console.log("Removing toast:", action.toastId || "all toasts");
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
    console.log("Dispatching action:", action.type);
    memoryState = reducer(memoryState, action);
    console.log("Memory state after action:", memoryState);
    listeners.forEach((listener) => {
        console.log("Notifying listener about state change");
        listener(memoryState);
    });
}

type ToastOptions = Omit<ToasterToast, "id" | "open" | "onOpenChange">;

function toast(opts: ToastOptions) {
    console.log("Toast function called with options:", opts);
    const id = genId();
    console.log("Generated ID for toast:", id);

    const update = (props: ToastOptions) => {
        console.log("Update function called for toast:", id, props);
        dispatch({
            type: "UPDATE_TOAST",
            toast: { ...props, id },
        });
    };

    const dismiss = () => {
        console.log("Dismiss function called for toast:", id);
        dispatch({ type: "DISMISS_TOAST", toastId: id });
    };

    dispatch({
        type: "ADD_TOAST",
        toast: {
            ...opts,
            id,
            open: true,
            onOpenChange: (open) => {
                console.log("onOpenChange called with:", open, "for toast:", id);
                if (!open) dismiss();
            },
        },
    });

    console.log("Returning toast controls for ID:", id);
    return {
        id,
        dismiss,
        update,
    };
}

function useToast() {
    console.log("useToast hook called");
    const [state, setState] = React.useState<State>(memoryState);

    React.useEffect(() => {
        console.log("useToast effect running, registering listener");
        listeners.push(setState);
        return () => {
            console.log("useToast cleanup, removing listener");
            const index = listeners.indexOf(setState);
            if (index > -1) {
                listeners.splice(index, 1);
            }
        };
    }, []);

    console.log("Current toasts in useToast:", state.toasts);
    return {
        ...state,
        toast,
        dismiss: (toastId?: string) => {
            console.log("Dismiss called from useToast for:", toastId || "all toasts");
            dispatch({ type: "DISMISS_TOAST", toastId });
        },
    };
}

export function ToastComponent() {
    console.log("ToastComponent rendering");
    const { toasts } = useToast();
    console.log("Toasts in ToastComponent:", toasts);

    if (!toasts.length) {
        console.log("No toasts to render, returning null");
        return null;
    }

    const variantClasses = {
        default: "bg-background text-foreground border",
        destructive:
            "bg-destructive text-destructive-foreground border-destructive",
    };

    console.log("Rendering toast container with toasts:", toasts);
    return (
        <div className="fixed bottom-4 right-4 z-[100] space-y-2">
            {toasts.map((toast) => {
                console.log("Rendering individual toast:", toast.id);
                return (
                    <div
                        key={toast.id}
                        className={`p-4 rounded-lg shadow-lg w-[350px] ${variantClasses[toast.variant || "default"]
                            }`}
                    >
                        <div className="flex justify-between items-start gap-4">
                            <div className="flex-1">
                                {toast.title && <h3 className="font-medium">{toast.title}</h3>}
                                <p className="text-sm">{toast.description}</p>
                            </div>
                            <button
                                onClick={() => {
                                    console.log("Close button clicked for toast:", toast.id);
                                    toast.onOpenChange?.(false);
                                }}
                                className="p-1 rounded-md hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export { useToast, toast };
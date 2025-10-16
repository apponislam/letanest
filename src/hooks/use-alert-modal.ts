import { useState } from "react";

interface AlertModalState {
    isOpen: boolean;
    title: string;
    description: string;
    type: "success" | "error" | "warning" | "info";
    confirmText?: string;
    onConfirm?: () => void;
    cancelText?: string;
}

export function useAlertModal() {
    const [modalState, setModalState] = useState<AlertModalState>({
        isOpen: false,
        title: "",
        description: "",
        type: "info",
    });

    const [isLoading, setIsLoading] = useState(false);

    const showAlert = (options: Omit<AlertModalState, "isOpen">) => {
        setModalState({
            isOpen: true,
            ...options,
        });
    };

    const closeAlert = () => {
        setModalState((prev) => ({ ...prev, isOpen: false }));
        setIsLoading(false);
    };

    const showSuccess = (title: string, description: string, onConfirm?: () => void) => {
        showAlert({
            title,
            description,
            type: "success",
            confirmText: "OK",
            onConfirm: onConfirm
                ? () => {
                      onConfirm();
                      closeAlert();
                  }
                : closeAlert,
        });
    };

    const showError = (title: string, description: string, onConfirm?: () => void) => {
        showAlert({
            title,
            description,
            type: "error",
            confirmText: "OK",
            onConfirm: onConfirm
                ? () => {
                      onConfirm();
                      closeAlert();
                  }
                : closeAlert,
        });
    };

    const showWarning = (title: string, description: string, onConfirm?: () => void, confirmText?: string) => {
        showAlert({
            title,
            description,
            type: "warning",
            confirmText: confirmText || "Continue",
            onConfirm: onConfirm
                ? async () => {
                      setIsLoading(true);
                      await onConfirm();
                      setIsLoading(false);
                      closeAlert();
                  }
                : closeAlert,
            cancelText: "Cancel",
        });
    };

    const showInfo = (title: string, description: string, onConfirm?: () => void) => {
        showAlert({
            title,
            description,
            type: "info",
            confirmText: "OK",
            onConfirm: onConfirm
                ? () => {
                      onConfirm();
                      closeAlert();
                  }
                : closeAlert,
        });
    };

    return {
        modalState: {
            ...modalState,
            isLoading,
        },
        showAlert,
        closeAlert,
        showSuccess,
        showError,
        showWarning,
        showInfo,
    };
}

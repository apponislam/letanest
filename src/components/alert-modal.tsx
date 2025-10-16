"use client";

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, CheckCircle, Info, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface AlertModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    description: string;
    type?: "success" | "error" | "warning" | "info";
    confirmText?: string;
    onConfirm?: () => void;
    cancelText?: string;
    isLoading?: boolean;
}

export function AlertModal({ isOpen, onClose, title, description, type = "info", confirmText = "Confirm", onConfirm, cancelText = "Cancel", isLoading = false }: AlertModalProps) {
    const getIcon = () => {
        switch (type) {
            case "success":
                return <CheckCircle className="h-6 w-6 text-green-600" />;
            case "error":
                return <XCircle className="h-6 w-6 text-red-600" />;
            case "warning":
                return <AlertTriangle className="h-6 w-6 text-yellow-600" />;
            case "info":
                return <Info className="h-6 w-6 text-blue-600" />;
            default:
                return <Info className="h-6 w-6 text-[#C9A94D]" />;
        }
    };

    const getButtonVariant = () => {
        switch (type) {
            case "success":
                return "bg-green-600 hover:bg-green-700 text-white";
            case "error":
                return "bg-red-600 hover:bg-red-700 text-white";
            case "warning":
                return "bg-yellow-600 hover:bg-yellow-700 text-white";
            case "info":
                return "bg-[#C9A94D] hover:bg-[#af8d28] text-white";
            default:
                return "bg-[#C9A94D] hover:bg-[#af8d28] text-white";
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="bg-[#2D3546] border-[#C9A94D] text-[#E6D7AD] sm:max-w-md">
                <DialogHeader className="flex flex-row items-center gap-3">
                    <div className="flex-shrink-0">{getIcon()}</div>
                    <div className="flex-1">
                        <DialogTitle className="text-[#C9A94D] text-lg">{title}</DialogTitle>
                        <DialogDescription className="text-[#E6D7AD] mt-2">{description}</DialogDescription>
                    </div>
                </DialogHeader>

                <DialogFooter className="flex flex-row gap-3 sm:justify-end mt-6">
                    {onConfirm && (
                        <Button onClick={onConfirm} disabled={isLoading} className={cn("transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed", getButtonVariant())}>
                            {isLoading ? (
                                <div className="flex items-center gap-2">
                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                    Loading...
                                </div>
                            ) : (
                                confirmText
                            )}
                        </Button>
                    )}

                    <Button onClick={onClose} disabled={isLoading} variant="outline" className="bg-transparent border border-[#C9A94D] text-[#C9A94D] hover:bg-[#C9A94D] hover:text-white transition-all font-medium disabled:opacity-50">
                        {cancelText}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

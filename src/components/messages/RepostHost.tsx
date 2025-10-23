"use client";

import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Swal from "sweetalert2";
import { useCreateReportMutation } from "@/redux/features/reports/reportApi";

interface ReportHostModalProps {
    isOpen: boolean;
    onClose: () => void;
    hostId: string;
    hostName: string;
}

// Validation schema
const reportSchema = z.object({
    reason: z.string().min(1, "Reason is required").max(100, "Reason cannot exceed 100 characters"),
    message: z.string().min(10, "Message must be at least 10 characters").max(500, "Message cannot exceed 500 characters"),
});

type ReportFormData = z.infer<typeof reportSchema>;

const ReportHostModal: React.FC<ReportHostModalProps> = ({ isOpen, onClose, hostId, hostName }) => {
    const [createReport, { isLoading }] = useCreateReportMutation();

    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
        watch,
        reset,
    } = useForm<ReportFormData>({
        resolver: zodResolver(reportSchema),
        mode: "onChange",
        defaultValues: {
            reason: "",
            message: "",
        },
    });

    const reason = watch("reason");
    const message = watch("message");

    const onSubmit = async (data: ReportFormData) => {
        try {
            await createReport({
                hostId,
                reason: data.reason,
                message: data.message,
            }).unwrap();

            Swal.fire({
                title: "Success!",
                text: "Report submitted successfully",
                icon: "success",
                iconColor: "#C9A94D",
                background: "#2D3546",
                color: "#F5F5F5",
                confirmButtonColor: "#C9A94D",
                confirmButtonText: "OK",
            });

            // Reset form and close modal
            reset();
            onClose();
        } catch (error) {
            console.error("Failed to submit report:", error);
            Swal.fire({
                title: "Error!",
                text: "Failed to submit report. Please try again.",
                icon: "error",
                iconColor: "#D00000",
                background: "#2D3546",
                color: "#F5F5F5",
                confirmButtonColor: "#D00000",
                confirmButtonText: "Try Again",
            });
        }
    };

    const handleClose = () => {
        reset();
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="bg-[#2D3546] border-[#C9A94D] text-white max-w-md w-full">
                <DialogHeader>
                    <DialogTitle className="text-[#C9A94D] text-xl text-center">Report Host</DialogTitle>
                    <DialogDescription className="text-gray-300 text-center">
                        Reporting: <span className="text-white font-semibold">{hostName}</span>
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
                    {/* Reason Input */}
                    <div>
                        <Label htmlFor="reason" className="text-white mb-2 block">
                            Reason for Report *
                        </Label>
                        <Input id="reason" {...register("reason")} placeholder="e.g., Poor communication, Cleanliness issues, etc." className={`w-full border bg-[#1a202c] text-white placeholder-gray-400 focus:ring-[#C9A94D] ${errors.reason ? "border-red-400" : "border-[#C9A94D]"}`} maxLength={100} />
                        <div className="flex justify-between mt-1">
                            {errors.reason ? <p className="text-red-400 text-sm">{errors.reason.message}</p> : <p className="text-xs text-gray-400">Brief reason for reporting</p>}
                            <p className="text-xs text-gray-400">{reason.length}/100</p>
                        </div>
                    </div>

                    {/* Message */}
                    <div>
                        <Label htmlFor="message" className="text-white mb-2 block">
                            Additional Details *
                        </Label>
                        <Textarea id="message" {...register("message")} placeholder="Please provide more details about your report..." className={`w-full border bg-[#1a202c] text-white placeholder-gray-400 focus:ring-[#C9A94D] resize-none ${errors.message ? "border-red-400" : "border-[#C9A94D]"}`} rows={4} maxLength={500} />
                        <div className="flex justify-between mt-1">
                            {errors.message ? <p className="text-red-400 text-sm">{errors.message.message}</p> : <p className="text-xs text-gray-400">Minimum 10 characters required</p>}
                            <p className="text-xs text-gray-400">{message.length}/500</p>
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3 mt-6">
                        <Button type="button" variant="outline" onClick={handleClose} className="flex-1 border-[#C9A94D] text-[#C9A94D] hover:bg-[#C9A94D] hover:text-white transition-colors">
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading || !isValid} className="flex-1 bg-[#C9A94D] text-white hover:bg-[#b8973e] transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                            {isLoading ? (
                                <div className="flex items-center justify-center gap-2">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    Submitting...
                                </div>
                            ) : (
                                "Submit Report"
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default ReportHostModal;

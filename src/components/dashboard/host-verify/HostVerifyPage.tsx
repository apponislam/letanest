"use client";
import React, { useState } from "react";
import { Star } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { EllipsisVertical } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import PageHeader from "@/components/PageHeader";
import { useGetAllVerificationsQuery, useUpdateVerificationStatusMutation } from "@/redux/features/verification/verificationApi";
import { toast } from "sonner";

const HostVerifyPage = () => {
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [selectedVerification, setSelectedVerification] = useState<any>(null);
    const [open, setOpen] = useState(false);

    const { data, isLoading, refetch } = useGetAllVerificationsQuery({
        status: statusFilter === "all" ? undefined : statusFilter,
    });

    const [updateStatus] = useUpdateVerificationStatusMutation();

    // console.log("Verifications data:", data);

    const handleStatusUpdate = async (verificationId: string, status: string, reviewNotes?: string) => {
        try {
            await updateStatus({
                id: verificationId,
                data: {
                    status: status as "approved" | "rejected" | "under_review",
                    reviewNotes,
                },
            }).unwrap();

            toast.success(`Verification ${status} successfully`);
            refetch();
        } catch (error: any) {
            console.error("Status update failed:", error);
            toast.error(error?.data?.message || "Failed to update status");
        }
    };

    const openHostDetails = (verification: any) => {
        setSelectedVerification(verification);
        setOpen(true);
    };

    const verifications = data?.data || [];

    if (isLoading) {
        return (
            <div className="container mx-auto">
                <PageHeader title="Host Verify" />
                <div className="flex justify-center items-center h-64">
                    <p className="text-[#C9A94D]">Loading verifications...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto">
            <PageHeader title="Host Verify" />

            <div className="w-full">
                <div className="bg-[#2D3546] border border-[#C9A94D] p-4 md:p-9 text-[#C9A94D] rounded-[20px] space-y-4">
                    <div className="flex justify-between md:items-center gap-3 flex-col md:flex-row">
                        <span className="text-[#C9A94D] text-xl md:text-[28px]">Review ({verifications.length})</span>

                        <div className="flex items-center gap-2">
                            <span className="text-[#C9A94D] text-lg md:text-[20px]">Filter By Status:</span>
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="bg-[#434D64] border border-[#C9A94D] text-[#C9A94D] rounded-[10px] w-36">
                                    <SelectValue placeholder="All Status" />
                                </SelectTrigger>
                                <SelectContent className="bg-[#2D3546] border border-[#C9A94D] text-white rounded-[10px]">
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="approved">Approved</SelectItem>
                                    <SelectItem value="rejected">Rejected</SelectItem>
                                    <SelectItem value="under_review">Under Review</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-3">
                        {verifications.length === 0 ? (
                            <div className="text-center py-8 text-[#C9A94D]">No verifications found</div>
                        ) : (
                            verifications.map((verification: any) => (
                                <div key={verification._id} className="p-3 rounded-[12px] flex justify-between md:items-center border border-[#C9A94D] flex-col md:flex-row gap-3">
                                    <div>
                                        <p className="font-bold text-lg">Date</p>
                                        <span>{new Date(verification.submittedAt).toLocaleDateString()}</span>
                                    </div>
                                    <div>
                                        <p className="font-bold text-lg">Name</p>
                                        <span>
                                            {verification.firstName} {verification.lastName}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="font-bold text-lg">Email</p>
                                        <span>{verification.userId?.email}</span>
                                    </div>
                                    <div>
                                        <p className="font-bold text-lg">Status</p>
                                        <span className={`px-2 py-1 text-white rounded text-sm ${verification.status === "approved" ? "bg-green-500" : verification.status === "rejected" ? "bg-red-500" : verification.status === "pending" ? "bg-yellow-500" : "bg-blue-500"}`}>{verification.status}</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <button className="bg-[#C9A94D] text-white rounded-[10px] font-bold text-[14px] py-1 px-3" onClick={() => openHostDetails(verification)}>
                                            View Details
                                        </button>

                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <button className="p-2 rounded-full bg-[#434D64] w-9">
                                                    <EllipsisVertical className="w-5 h-5 text-white" />
                                                </button>
                                            </DropdownMenuTrigger>

                                            <DropdownMenuContent className="bg-[#14213D] text-white rounded-[10px] w-48 flex flex-col gap-[14px] p-5 border-none">
                                                <DropdownMenuItem className="bg-[#D00000] text-white hover:bg-[#D00000] focus:bg-[#D00000] justify-center focus:text-white rounded-[20px] cursor-pointer" onClick={() => handleStatusUpdate(verification._id, "rejected", "Verification rejected")}>
                                                    <span className="w-full text-center">Reject</span>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="bg-[#C9A94D] text-white hover:bg-[#C9A94D] focus:bg-[#C9A94D] justify-center focus:text-white rounded-[20px] cursor-pointer" onClick={() => handleStatusUpdate(verification._id, "approved", "Verification approved")}>
                                                    <span className="w-full text-center">Approve</span>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="bg-[#135E9A] text-white hover:bg-[#135E9A] focus:bg-[#135E9A] justify-center focus:text-white rounded-[20px] cursor-pointer" onClick={() => handleStatusUpdate(verification._id, "under_review", "Under review")}>
                                                    <span className="w-full text-center">Under Review</span>
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Host Details Dialog */}
                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogContent className="bg-[#14213D] border border-[#C9A94D] rounded-[10px] p-6 ">
                            <style jsx global>{`
                                [data-slot="dialog-close"] {
                                    color: white !important;
                                    opacity: 1 !important;
                                }
                                [data-slot="dialog-close"]:hover {
                                    color: #c9a94d !important;
                                }
                                [data-slot="dialog-close"] svg {
                                    stroke: currentColor;
                                }
                            `}</style>

                            {selectedVerification && (
                                <>
                                    <DialogHeader>
                                        <DialogTitle className="text-[#C9A94D] text-center text-xl">Host Verification Details</DialogTitle>
                                    </DialogHeader>

                                    <div className="mt-4 space-y-4 text-[#C9A94D]">
                                        <div className="text-center">
                                            <p className="font-bold text-2xl text-white mb-2">
                                                {selectedVerification.firstName} {selectedVerification.lastName}
                                            </p>
                                            <p className="text-lg">{selectedVerification.userId?.email}</p>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="font-bold">Date of Birth</p>
                                                <p>{new Date(selectedVerification.dob).toLocaleDateString()}</p>
                                            </div>
                                            {/* <div>
                                                <p className="font-bold">Gender</p>
                                                <p>{selectedVerification.gender || "Not specified"}</p>
                                            </div> */}
                                            <div>
                                                <p className="font-bold">Country of Birth</p>
                                                <p>{selectedVerification.countryOfBirth}</p>
                                            </div>
                                            <div>
                                                <p className="font-bold">City of Birth</p>
                                                <p>{selectedVerification.cityOfBirth}</p>
                                            </div>
                                            <div>
                                                <p className="font-bold">Zip Code</p>
                                                <p>{selectedVerification.zip}</p>
                                            </div>
                                        </div>

                                        <div>
                                            <p className="font-bold mb-2">Documents:</p>
                                            <div className="space-y-3">
                                                {/* Proof of Address */}
                                                <div className="flex items-center justify-between bg-[#2D3546] p-3 rounded-lg border border-[#C9A94D] flex-col md:flex-row w-full gap-2">
                                                    <div className="flex items-center gap-3">
                                                        {selectedVerification.proofAddress.mimetype === "application/pdf" ? (
                                                            <div className="w-10 h-10 bg-red-500 rounded flex items-center justify-center">
                                                                <span className="text-white font-bold text-xs">PDF</span>
                                                            </div>
                                                        ) : (
                                                            <div className="w-10 h-10 bg-blue-500 rounded flex items-center justify-center">
                                                                <span className="text-white font-bold text-xs">IMG</span>
                                                            </div>
                                                        )}
                                                        <div>
                                                            <p className="font-semibold text-[#C9A94D]">Proof of Address</p>
                                                            <p className="text-sm text-gray-300 truncate max-w-[200px]">{selectedVerification.proofAddress.originalName}</p>
                                                            <p className="text-xs text-gray-400">{(selectedVerification.proofAddress.size / 1024).toFixed(1)} KB</p>
                                                        </div>
                                                    </div>
                                                    <button onClick={() => window.open(`${process.env.NEXT_PUBLIC_BASE_API}/${selectedVerification.proofAddress.path.replace(/\\/g, "/")}`, "_blank")} className="bg-[#C9A94D] text-white rounded-[10px] font-bold text-[12px] py-2 px-4 hover:bg-[#B89A45] transition-colors flex items-center gap-1">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                        </svg>
                                                        View
                                                    </button>
                                                </div>

                                                {/* Proof of ID */}
                                                <div className="flex items-center justify-between bg-[#2D3546] p-3 rounded-lg border border-[#C9A94D] flex-col md:flex-row w-full gap-2">
                                                    <div className="flex items-center gap-3">
                                                        {selectedVerification.proofID.mimetype === "application/pdf" ? (
                                                            <div className="w-10 h-10 bg-red-500 rounded flex items-center justify-center">
                                                                <span className="text-white font-bold text-xs">PDF</span>
                                                            </div>
                                                        ) : (
                                                            <div className="w-10 h-10 bg-blue-500 rounded flex items-center justify-center">
                                                                <span className="text-white font-bold text-xs">IMG</span>
                                                            </div>
                                                        )}
                                                        <div>
                                                            <p className="font-semibold text-[#C9A94D]">Proof of ID</p>
                                                            <p className="text-sm text-gray-300 truncate max-w-[200px]">{selectedVerification.proofID.originalName}</p>
                                                            <p className="text-xs text-gray-400">{(selectedVerification.proofID.size / 1024).toFixed(1)} KB</p>
                                                        </div>
                                                    </div>
                                                    <button onClick={() => window.open(`${process.env.NEXT_PUBLIC_BASE_API}/${selectedVerification.proofID.path.replace(/\\/g, "/")}`, "_blank")} className="bg-[#C9A94D] text-white rounded-[10px] font-bold text-[12px] py-2 px-4 hover:bg-[#B89A45] transition-colors flex items-center gap-1">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                        </svg>
                                                        View
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex justify-center">
                                            <button className={`flex items-center gap-1 px-7 py-1 rounded-[20px] text-base justify-center ${selectedVerification.status === "approved" ? "bg-[#135E9A] text-white" : selectedVerification.status === "rejected" ? "bg-red-600 text-white" : "bg-yellow-500 text-white"}`}>
                                                {selectedVerification.status === "approved" && <Star className="w-4 h-4" />}
                                                {selectedVerification.status?.charAt(0).toUpperCase() + selectedVerification.status?.slice(1) || "Pending"}
                                            </button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default HostVerifyPage;

"use client";
import { useState, useEffect } from "react";
import { CheckCircle, CreditCard, Plus, Edit, Trash2, X, Building, User, Globe } from "lucide-react";
import Image from "next/image";
import { useCreateBankDetailsMutation, useGetMyBankDetailsQuery, useUpdateMyBankDetailsMutation, useDeleteMyBankDetailsMutation } from "@/redux/features/bankdetails/bankDetailsApi";
import { toast } from "sonner";

const BankDetailsModal = () => {
    // API Hooks
    const { data: bankDetailsResponse, isLoading: bankDetailsLoading, refetch: refetchBankDetails } = useGetMyBankDetailsQuery();
    const [createBankDetails, { isLoading: isCreating }] = useCreateBankDetailsMutation();
    const [updateBankDetails, { isLoading: isUpdating }] = useUpdateMyBankDetailsMutation();
    const [deleteBankDetails, { isLoading: isDeleting }] = useDeleteMyBankDetailsMutation();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        accountHolderName: "",
        accountNumber: "",
        bankName: "",
        accountType: "personal" as "personal" | "business",
        country: "",
    });

    // Derived state
    const bankDetails = bankDetailsResponse?.data;
    const hasBankDetails = !!bankDetails;
    const isLoading = isCreating || isUpdating || isDeleting;

    useEffect(() => {
        if (bankDetails && isEditMode) {
            setFormData({
                accountHolderName: bankDetails.accountHolderName,
                accountNumber: bankDetails.accountNumber,
                bankName: bankDetails.bankName,
                accountType: bankDetails.accountType,
                country: bankDetails.country,
            });
        }
    }, [bankDetails, isEditMode]);

    const resetForm = () => {
        setFormData({
            accountHolderName: "",
            accountNumber: "",
            bankName: "",
            accountType: "personal",
            country: "",
        });
        setIsEditMode(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            if (isEditMode) {
                await updateBankDetails(formData).unwrap();
                toast.success("Bank details updated successfully");
            } else {
                await createBankDetails(formData).unwrap();
                toast.success("Bank details added successfully");
            }

            await refetchBankDetails();
            setIsModalOpen(false);
            resetForm();
        } catch (error: any) {
            toast.error(error?.data?.message || `Failed to ${isEditMode ? "update" : "add"} bank details`);
        }
    };

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete your bank details?")) return;

        try {
            await deleteBankDetails().unwrap();
            toast.success("Bank details deleted successfully");
            await refetchBankDetails();
            setIsModalOpen(false);
            resetForm();
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to delete bank details");
        }
    };

    const handleEdit = () => {
        setIsEditMode(true);
    };

    return (
        <>
            {/* Bank Details Button */}
            <div onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 cursor-pointer transition hover:text-[#C9A94D]">
                <Image src="/listing/add/plus-circle.png" alt="Add Bank Details" width={24} height={24} />
                {bankDetailsLoading ? <p>Checking Bank Details...</p> : hasBankDetails ? <p>Bank Details Added</p> : <p>Add Bank Details (To Receive Payment Via Bank Transfer)</p>}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-auto animate-in fade-in-90 zoom-in-90">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-200">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-[#C9A94D]/10 rounded-lg">
                                    <CreditCard className="w-5 h-5 text-[#C9A94D]" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-[#14213D]">{hasBankDetails && !isEditMode ? "Bank Details" : isEditMode ? "Edit Bank Details" : "Add Bank Details"}</h2>
                                    <p className="text-[#6B7280] text-sm">{hasBankDetails && !isEditMode ? "Manage your bank account" : "Add your bank account details"}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => {
                                    setIsModalOpen(false);
                                    resetForm();
                                }}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5 text-gray-400" />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-6">
                            {hasBankDetails && !isEditMode ? (
                                // View Mode
                                <div className="space-y-4">
                                    {/* Status */}
                                    <div className="p-4 rounded-xl border-2 border-green-200 bg-green-50">
                                        <div className="flex items-center gap-3">
                                            <CheckCircle className="w-5 h-5 text-green-600" />
                                            <div>
                                                <p className="font-semibold text-[#14213D]">Bank Details Added</p>
                                                <p className="text-sm text-[#6B7280]">Ready to receive payments</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Bank Details */}
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                            <User className="w-4 h-4 text-[#C9A94D]" />
                                            <div>
                                                <p className="text-xs text-gray-500">Account Holder</p>
                                                <p className="font-medium text-[#14213D]">{bankDetails.accountHolderName}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                            <CreditCard className="w-4 h-4 text-[#C9A94D]" />
                                            <div>
                                                <p className="text-xs text-gray-500">Account Number</p>
                                                <p className="font-medium text-[#14213D]">{bankDetails.accountNumber}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                            <Building className="w-4 h-4 text-[#C9A94D]" />
                                            <div>
                                                <p className="text-xs text-gray-500">Bank Name</p>
                                                <p className="font-medium text-[#14213D]">{bankDetails.bankName}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                            <Globe className="w-4 h-4 text-[#C9A94D]" />
                                            <div>
                                                <p className="text-xs text-gray-500">Country</p>
                                                <p className="font-medium text-[#14213D]">{bankDetails.country}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex gap-3 pt-4">
                                        <button onClick={handleEdit} className="flex-1 bg-[#C9A94D] text-white py-2 px-4 rounded-lg font-medium hover:bg-[#b8973e] transition-colors flex items-center justify-center gap-2">
                                            <Edit className="w-4 h-4" />
                                            Edit
                                        </button>
                                        <button onClick={handleDelete} disabled={isDeleting} className="flex-1 bg-white border border-red-300 text-red-600 py-2 px-4 rounded-lg font-medium hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2">
                                            {isDeleting ? <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" /> : <Trash2 className="w-4 h-4" />}
                                            {isDeleting ? "Deleting..." : "Delete"}
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                // Add/Edit Form
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-[#14213D] mb-1">Account Holder Name</label>
                                        <input type="text" required value={formData.accountHolderName} onChange={(e) => setFormData({ ...formData, accountHolderName: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#C9A94D] focus:border-transparent" placeholder="John Doe" />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-[#14213D] mb-1">Account Number</label>
                                        <input type="text" required value={formData.accountNumber} onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#C9A94D] focus:border-transparent" placeholder="1234567890" />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-[#14213D] mb-1">Bank Name</label>
                                        <input type="text" required value={formData.bankName} onChange={(e) => setFormData({ ...formData, bankName: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#C9A94D] focus:border-transparent" placeholder="Bank of America" />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-[#14213D] mb-1">Account Type</label>
                                            <select required value={formData.accountType} onChange={(e) => setFormData({ ...formData, accountType: e.target.value as "personal" | "business" })} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#C9A94D] focus:border-transparent">
                                                <option value="personal">Personal</option>
                                                <option value="business">Business</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-[#14213D] mb-1">Country</label>
                                            <input type="text" required value={formData.country} onChange={(e) => setFormData({ ...formData, country: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#C9A94D] focus:border-transparent" placeholder="United States" />
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex gap-3 pt-4">
                                        <button type="submit" disabled={isLoading} className="flex-1 bg-[#C9A94D] text-white py-2 px-4 rounded-lg font-medium hover:bg-[#b8973e] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2">
                                            {/* {isLoading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Plus className="w-4 h-4" />} */}
                                            {isLoading ? "Saving..." : isEditMode ? "Update Details" : "Add Bank Details"}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setIsModalOpen(false);
                                                resetForm();
                                            }}
                                            className="flex-1 bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default BankDetailsModal;

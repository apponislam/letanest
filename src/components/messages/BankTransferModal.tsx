"use client";
import { useGetBankDetailsByUserIdQuery } from "@/redux/features/bankdetails/bankDetailsApi";
import { useState } from "react";

interface BankTransferModalProps {
    isOpen: boolean;
    onClose: () => void;
    userId: string;
}

const BankTransferModal = ({ isOpen, onClose, userId }: BankTransferModalProps) => {
    const { data: bankDetails, isLoading, error } = useGetBankDetailsByUserIdQuery(userId);
    const [copiedField, setCopiedField] = useState<string | null>(null);

    const handleCopy = (text: string, field: string) => {
        navigator.clipboard.writeText(text);
        setCopiedField(field);
        setTimeout(() => setCopiedField(null), 2000);
    };

    if (!isOpen) return null;

    const bankData = bankDetails?.data;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-[#1E293B] rounded-lg max-w-md w-full shadow-xl">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-600">
                    <h2 className="text-xl font-bold text-white">Bank Transfer Details</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl transition-colors">
                        ×
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    {isLoading ? (
                        <div className="text-center py-4">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C9A94D] mx-auto"></div>
                            <p className="text-gray-400 mt-2">Loading bank details...</p>
                        </div>
                    ) : error ? (
                        <div className="text-center py-4">
                            <p className="text-red-400">Failed to load bank details</p>
                            <p className="text-gray-400 text-sm mt-1">Please contact support</p>
                        </div>
                    ) : bankData ? (
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="text-gray-400 text-sm">Account Holder</p>
                                    <p className="text-white font-medium">{bankData.accountHolderName}</p>
                                </div>
                                <button onClick={() => handleCopy(bankData.accountHolderName, "accountHolder")} className="bg-[#C9A94D] text-white px-3 py-1 rounded text-xs hover:bg-[#af8d28] transition-colors">
                                    {copiedField === "accountHolder" ? "Copied!" : "Copy"}
                                </button>
                            </div>

                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="text-gray-400 text-sm">Account Number</p>
                                    <p className="text-white font-medium">{bankData.accountNumber}</p>
                                </div>
                                <button onClick={() => handleCopy(bankData.accountNumber, "accountNumber")} className="bg-[#C9A94D] text-white px-3 py-1 rounded text-xs hover:bg-[#af8d28] transition-colors">
                                    {copiedField === "accountNumber" ? "Copied!" : "Copy"}
                                </button>
                            </div>

                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="text-gray-400 text-sm">Bank Name</p>
                                    <p className="text-white font-medium">{bankData.bankName}</p>
                                </div>
                                <button onClick={() => handleCopy(bankData.bankName, "bankName")} className="bg-[#C9A94D] text-white px-3 py-1 rounded text-xs hover:bg-[#af8d28] transition-colors">
                                    {copiedField === "bankName" ? "Copied!" : "Copy"}
                                </button>
                            </div>

                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="text-gray-400 text-sm">Account Type</p>
                                    <p className="text-white font-medium capitalize">{bankData.accountType}</p>
                                </div>
                            </div>

                            {bankData.isVerified && (
                                <div className="bg-green-900/30 border border-green-600 rounded p-2">
                                    <p className="text-green-400 text-sm text-center">✓ Verified Bank Account</p>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="text-center py-4">
                            <p className="text-yellow-400">No bank details found</p>
                            <p className="text-gray-400 text-sm mt-1">Please contact support for bank details</p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-600">
                    <button onClick={onClose} className="w-full bg-[#C9A94D] text-white py-2 px-4 rounded hover:bg-[#af8d28] transition-colors">
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BankTransferModal;

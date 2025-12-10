// "use client";
// import { useGetBankDetailsByUserIdQuery } from "@/redux/features/bankdetails/bankDetailsApi";
// import { useState } from "react";

// interface BankTransferModalProps {
//     isOpen: boolean;
//     onClose: () => void;
//     userId: string;
// }

// const BankTransferModal = ({ isOpen, onClose, userId }: BankTransferModalProps) => {
//     const { data: bankDetails, isLoading, error } = useGetBankDetailsByUserIdQuery(userId);
//     const [copiedField, setCopiedField] = useState<string | null>(null);

//     const handleCopy = (text: string, field: string) => {
//         navigator.clipboard.writeText(text);
//         setCopiedField(field);
//         setTimeout(() => setCopiedField(null), 2000);
//     };

//     if (!isOpen) return null;

//     const bankData = bankDetails?.data;

//     return (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//             <div className="bg-[#1E293B] rounded-lg max-w-md w-full shadow-xl">
//                 {/* Header */}
//                 <div className="flex justify-between items-center p-6 border-b border-gray-600">
//                     <h2 className="text-xl font-bold text-white">Bank Transfer Details</h2>
//                     <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl transition-colors">
//                         ×
//                     </button>
//                 </div>

//                 {/* Content */}
//                 <div className="p-6">
//                     {isLoading ? (
//                         <div className="text-center py-4">
//                             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C9A94D] mx-auto"></div>
//                             <p className="text-gray-400 mt-2">Loading bank details...</p>
//                         </div>
//                     ) : error ? (
//                         <div className="text-center py-4">
//                             <p className="text-red-400">Failed to load bank details</p>
//                             <p className="text-gray-400 text-sm mt-1">Please contact support</p>
//                         </div>
//                     ) : bankData ? (
//                         <div className="space-y-4">
//                             <div className="flex justify-between items-center">
//                                 <div>
//                                     <p className="text-gray-400 text-sm">Account Holder</p>
//                                     <p className="text-white font-medium">{bankData.accountHolderName}</p>
//                                 </div>
//                                 <button onClick={() => handleCopy(bankData.accountHolderName, "accountHolder")} className="bg-[#C9A94D] text-white px-3 py-1 rounded text-xs hover:bg-[#af8d28] transition-colors">
//                                     {copiedField === "accountHolder" ? "Copied!" : "Copy"}
//                                 </button>
//                             </div>

//                             <div className="flex justify-between items-center">
//                                 <div>
//                                     <p className="text-gray-400 text-sm">Account Number</p>
//                                     <p className="text-white font-medium">{bankData.accountNumber}</p>
//                                 </div>
//                                 <button onClick={() => handleCopy(bankData.accountNumber, "accountNumber")} className="bg-[#C9A94D] text-white px-3 py-1 rounded text-xs hover:bg-[#af8d28] transition-colors">
//                                     {copiedField === "accountNumber" ? "Copied!" : "Copy"}
//                                 </button>
//                             </div>

//                             <div className="flex justify-between items-center">
//                                 <div>
//                                     <p className="text-gray-400 text-sm">Bank Name</p>
//                                     <p className="text-white font-medium">{bankData.bankName}</p>
//                                 </div>
//                                 <button onClick={() => handleCopy(bankData.bankName, "bankName")} className="bg-[#C9A94D] text-white px-3 py-1 rounded text-xs hover:bg-[#af8d28] transition-colors">
//                                     {copiedField === "bankName" ? "Copied!" : "Copy"}
//                                 </button>
//                             </div>

//                             <div className="flex justify-between items-center">
//                                 <div>
//                                     <p className="text-gray-400 text-sm">Account Type</p>
//                                     <p className="text-white font-medium capitalize">{bankData.accountType}</p>
//                                 </div>
//                             </div>

//                             {bankData.isVerified && (
//                                 <div className="bg-green-900/30 border border-green-600 rounded p-2">
//                                     <p className="text-green-400 text-sm text-center">✓ Verified Bank Account</p>
//                                 </div>
//                             )}
//                         </div>
//                     ) : (
//                         <div className="text-center py-4">
//                             <p className="text-yellow-400">No bank details found</p>
//                             <p className="text-gray-400 text-sm mt-1">Please contact support for bank details</p>
//                         </div>
//                     )}
//                 </div>

//                 {/* Footer */}
//                 <div className="p-6 border-t border-gray-600">
//                     <button onClick={onClose} className="w-full bg-[#C9A94D] text-white py-2 px-4 rounded hover:bg-[#af8d28] transition-colors">
//                         Close
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default BankTransferModal;

"use client";
import { useGetBankDetailsByUserIdQuery } from "@/redux/features/bankdetails/bankDetailsApi";
import { useState } from "react";
import { Copy, Check, X } from "lucide-react";

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
        setTimeout(() => setCopiedField(null), 1500);
    };

    if (!isOpen) return null;

    const bankData = bankDetails?.data;

    // Bank details configuration
    const bankFields = [
        { label: "Account Holder", value: bankData?.accountHolderName, field: "holder", required: true },
        { label: "Account Number", value: bankData?.accountNumber, field: "account", required: true },
        { label: "Sort Code", value: bankData?.sortCode, field: "sort", required: false },
        { label: "Bank Name", value: bankData?.bankName, field: "bank", required: true },
        { label: "Country", value: bankData?.country, field: "country", required: true },
        { label: "IBAN", value: bankData?.iban, field: "iban", required: false },
        { label: "BIC/SWIFT", value: bankData?.bicSwift, field: "swift", required: false },
    ];

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-[#1E293B] rounded-lg max-w-md w-full shadow-xl max-h-[80vh] overflow-hidden flex flex-col">
                {/* Header - Compact */}
                <div className="flex justify-between items-center p-4 border-b border-gray-600">
                    <div>
                        <h2 className="text-lg font-bold text-white">Bank Transfer Details</h2>
                        <p className="text-gray-400 text-xs mt-1">Use in banking app to send money</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content - Scrollable */}
                <div className="flex-1 overflow-y-auto p-4">
                    {isLoading ? (
                        <div className="text-center py-4">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#C9A94D] mx-auto"></div>
                            <p className="text-gray-400 text-sm mt-2">Loading...</p>
                        </div>
                    ) : error ? (
                        <div className="text-center py-4">
                            <p className="text-red-400 text-sm">Failed to load</p>
                            <p className="text-gray-400 text-xs mt-1">Contact support</p>
                        </div>
                    ) : bankData ? (
                        <div className="space-y-3">
                            {/* Bank Details List */}
                            {bankFields
                                .filter((field) => field.value)
                                .map(({ label, value, field }) => (
                                    <div key={field} className="flex justify-between items-center bg-gray-800/50 p-3 rounded">
                                        <div className="min-w-0">
                                            <p className="text-xs text-gray-400">{label}</p>
                                            <p className="text-white font-medium text-sm truncate">{value}</p>
                                        </div>
                                        <button onClick={() => handleCopy(value!, field)} className="ml-2 p-2 bg-[#C9A94D] hover:bg-[#af8d28] rounded text-white flex-shrink-0" title="Copy">
                                            {copiedField === field ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                                        </button>
                                    </div>
                                ))}

                            {/* Verified Badge - Compact */}
                            {bankData.isVerified && (
                                <div className="p-2 bg-green-900/30 border border-green-600 rounded text-center">
                                    <p className="text-green-400 text-xs">✓ Verified Account</p>
                                </div>
                            )}

                            {/* Instructions - Compact */}
                            <div className="p-2 bg-blue-900/30 border border-blue-600 rounded">
                                <p className="text-blue-300 text-xs">
                                    <strong>Note:</strong> Copy details to your banking app.
                                    {bankData.sortCode && " For UK: Acc# + Sort Code"}
                                    {bankData.iban && " For Int'l: IBAN + BIC/SWIFT"}
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-4">
                            <p className="text-yellow-400 text-sm">No bank details</p>
                            <p className="text-gray-400 text-xs mt-1">Contact support</p>
                        </div>
                    )}
                </div>

                {/* Footer - Compact */}
                <div className="p-4 border-t border-gray-600">
                    <button onClick={onClose} className="w-full bg-[#C9A94D] text-white py-2 px-4 rounded hover:bg-[#af8d28] transition-colors text-sm font-medium">
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BankTransferModal;

// "use client";
// import { useState, useEffect } from "react";
// import { CheckCircle, CreditCard, Plus, Edit, Trash2, X, Building, User, Globe, Hash, GlobeIcon, Key } from "lucide-react";
// import Image from "next/image";
// import { useCreateBankDetailsMutation, useGetMyBankDetailsQuery, useUpdateMyBankDetailsMutation, useDeleteMyBankDetailsMutation, bankDetailsApi } from "@/redux/features/bankdetails/bankDetailsApi";
// import { toast } from "sonner";
// import Swal from "sweetalert2";
// import { useDispatch } from "react-redux";

// interface BankDetailsModalProps {
//     bankDetailsResponse: any;
//     bankDetailsLoading: boolean;
//     refetchBankDetails: () => void;
// }

// const BankDetailsModal = ({ bankDetailsResponse, bankDetailsLoading, refetchBankDetails }: BankDetailsModalProps) => {
//     const dispatch = useDispatch();
//     const [showBankRules, setShowBankRules] = useState(false);
//     // API Hooks
//     // const { data: bankDetailsResponse, isLoading: bankDetailsLoading, refetch: refetchBankDetails } = useGetMyBankDetailsQuery();
//     const [createBankDetails, { isLoading: isCreating }] = useCreateBankDetailsMutation();
//     const [updateBankDetails, { isLoading: isUpdating }] = useUpdateMyBankDetailsMutation();
//     const [deleteBankDetails, { isLoading: isDeleting }] = useDeleteMyBankDetailsMutation();

//     const [isModalOpen, setIsModalOpen] = useState(false);
//     const [isEditMode, setIsEditMode] = useState(false);

//     // Form state - UPDATED with new fields
//     const [formData, setFormData] = useState({
//         accountHolderName: "",
//         accountNumber: "",
//         sortCode: "", // NEW FIELD
//         bankName: "",
//         accountType: "personal" as "personal" | "business",
//         country: "",
//         iban: "", // NEW FIELD (optional)
//         bicSwift: "", // NEW FIELD (optional)
//     });

//     // Derived state
//     const bankDetails = bankDetailsResponse?.data;
//     const hasBankDetails = !!bankDetails;
//     const isLoading = isCreating || isUpdating || isDeleting;

//     useEffect(() => {
//         if (bankDetails && isEditMode) {
//             setFormData({
//                 accountHolderName: bankDetails.accountHolderName,
//                 accountNumber: bankDetails.accountNumber,
//                 sortCode: bankDetails.sortCode || "", // NEW
//                 bankName: bankDetails.bankName,
//                 accountType: bankDetails.accountType,
//                 country: bankDetails.country,
//                 iban: bankDetails.iban || "", // NEW
//                 bicSwift: bankDetails.bicSwift || "", // NEW
//             });
//         }
//     }, [bankDetails, isEditMode]);

//     const resetForm = () => {
//         setFormData({
//             accountHolderName: "",
//             accountNumber: "",
//             sortCode: "", // NEW
//             bankName: "",
//             accountType: "personal",
//             country: "",
//             iban: "", // NEW
//             bicSwift: "", // NEW
//         });
//         setIsEditMode(false);
//     };

//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();

//         // Create payload with optional fields only if they have values
//         const payload: any = {
//             accountHolderName: formData.accountHolderName,
//             accountNumber: formData.accountNumber,
//             sortCode: formData.sortCode, // NEW
//             bankName: formData.bankName,
//             accountType: formData.accountType,
//             country: formData.country,
//         };

//         // Add optional fields if they exist
//         if (formData.iban.trim()) payload.iban = formData.iban;
//         if (formData.bicSwift.trim()) payload.bicSwift = formData.bicSwift;

//         try {
//             if (isEditMode) {
//                 await updateBankDetails(payload).unwrap();
//                 toast.success("Bank details updated successfully");
//             } else {
//                 await createBankDetails(payload).unwrap();
//                 toast.success("Bank details added successfully");
//             }

//             await refetchBankDetails();
//             setIsModalOpen(false);
//             resetForm();
//         } catch (error: any) {
//             toast.error(error?.data?.message || `Failed to ${isEditMode ? "update" : "add"} bank details`);
//         }
//     };

//     const handleDelete = async () => {
//         const result = await Swal.fire({
//             title: "Are you sure?",
//             text: "You are about to delete your bank details",
//             icon: "warning",
//             showCancelButton: true,
//             confirmButtonColor: "#C9A94D",
//             cancelButtonColor: "#434D64",
//             confirmButtonText: "Yes, delete it!",
//             cancelButtonText: "Cancel",
//             background: "#2D3546",
//             color: "#FFFFFF",
//             customClass: {
//                 popup: "border border-[#C9A94D] rounded-[20px]",
//                 title: "text-[#C9A94D]",
//                 htmlContainer: "text-gray-300",
//                 confirmButton: "bg-[#C9A94D] hover:bg-[#b8973e] text-white font-medium py-2 px-6 rounded-lg transition",
//                 cancelButton: "bg-[#434D64] hover:bg-[#535a6b] text-white font-medium py-2 px-6 rounded-lg transition",
//                 icon: "text-[#C9A94D]",
//                 actions: "gap-3 mt-4",
//             },
//             buttonsStyling: false,
//             reverseButtons: true,
//         });

//         if (!result.isConfirmed) return;

//         try {
//             await deleteBankDetails().unwrap();
//             toast.success("Bank details deleted successfully");
//             dispatch(bankDetailsApi.util.invalidateTags(["MyBankDetails"]));
//             refetchBankDetails();
//             console.log(bankDetailsResponse);
//             setIsModalOpen(false);
//             resetForm();
//         } catch (error: any) {
//             toast.error(error?.data?.message || "Failed to delete bank details");
//             refetchBankDetails();
//         }
//     };

//     const handleEdit = () => {
//         setIsEditMode(true);
//     };

//     return (
//         <>
//             {/* Bank Details Button */}
//             <div className="flex items-center gap-2">
//                 <div className="flex items-center gap-2">
//                     <div onClick={() => setIsModalOpen(true)} className="flex items-center gap-1 cursor-pointer transition hover:text-[#C9A94D]">
//                         <Image src="/listing/add/plus-circle.png" alt="Add Bank Details" width={24} height={24} />
//                         {bankDetailsLoading ? <p>Checking Bank Details...</p> : hasBankDetails ? <p>Bank Details Added</p> : <p>Add Bank Details (To Receive Payment Via Bank Transfer)</p>}
//                     </div>

//                     {/* Tooltip */}
//                     <div className="relative inline-block" onMouseEnter={() => setShowBankRules(true)} onMouseLeave={() => setShowBankRules(false)} onClick={() => setShowBankRules(!showBankRules)}>
//                         <Image src="/listing/add/info-circle.png" alt="Info" width={24} height={24} />

//                         {showBankRules && (
//                             <div className="absolute -right-5 md:right-unset md:left-1/2 md:bottom-full bottom-full mb-2 md:mb-4 w-72 md:w-[520px] bg-[#14213D] text-white text-sm p-6 rounded-[10px] shadow-lg md:-translate-x-1/2 border border-[#C9A94D] z-50" style={{ maxHeight: "80vh", overflowY: "auto" }}>
//                                 <h2 className="font-bold mb-2 text-[14px]">Bank Details Information</h2>
//                                 <p className="mb-2">You can receive payments securely by adding your bank details — this is fully permitted and ensures your funds go directly to your account via bank transfer.</p>
//                                 <p className="mb-2">If you want to access additional features, you can also link or set up a Stripe account, but adding your bank details is enough to start receiving payments safely.</p>

//                                 {/* ADDED: Bank transfer requirements info */}
//                                 <div className="mt-4 pt-4 border-t border-gray-600">
//                                     <h3 className="font-bold mb-2 text-[13px]">For UK Bank Transfers, provide:</h3>
//                                     <ul className="space-y-1 text-[12px]">
//                                         <li>• Account Holder Name</li>
//                                         <li>• 8-digit Account Number</li>
//                                         <li>• 6-digit Sort Code (e.g., 12-34-56)</li>
//                                     </ul>
//                                     <p className="mt-2 text-[12px]">For international transfers, also provide IBAN and BIC/SWIFT code.</p>
//                                 </div>
//                             </div>
//                         )}
//                     </div>
//                 </div>
//             </div>

//             {/* Modal */}
//             {isModalOpen && (
//                 <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
//                     <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-auto animate-in fade-in-90 zoom-in-90">
//                         {/* Modal Header */}
//                         <div className="flex items-center justify-between p-6 border-b border-gray-200">
//                             <div className="flex items-center gap-3">
//                                 <div className="p-2 bg-[#C9A94D]/10 rounded-lg">
//                                     <CreditCard className="w-5 h-5 text-[#C9A94D]" />
//                                 </div>
//                                 <div>
//                                     <h2 className="text-xl font-bold text-[#14213D]">{hasBankDetails && !isEditMode ? "Bank Details" : isEditMode ? "Edit Bank Details" : "Add Bank Details"}</h2>
//                                     <p className="text-[#6B7280] text-sm">{hasBankDetails && !isEditMode ? "Manage your bank account" : "Add your bank account details"}</p>
//                                 </div>
//                             </div>
//                             <button
//                                 onClick={() => {
//                                     setIsModalOpen(false);
//                                     resetForm();
//                                 }}
//                                 className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
//                             >
//                                 <X className="w-5 h-5 text-gray-400" />
//                             </button>
//                         </div>

//                         {/* Modal Content */}
//                         <div className="p-6">
//                             {hasBankDetails && !isEditMode ? (
//                                 // View Mode
//                                 <div className="space-y-4">
//                                     {/* Status */}
//                                     <div className="p-4 rounded-xl border-2 border-green-200 bg-green-50">
//                                         <div className="flex items-center gap-3">
//                                             <CheckCircle className="w-5 h-5 text-green-600" />
//                                             <div>
//                                                 <p className="font-semibold text-[#14213D]">Bank Details Added</p>
//                                                 <p className="text-sm text-[#6B7280]">Ready to receive payments</p>
//                                             </div>
//                                         </div>
//                                     </div>

//                                     {/* Bank Details */}
//                                     <div className="space-y-3">
//                                         <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
//                                             <User className="w-4 h-4 text-[#C9A94D]" />
//                                             <div>
//                                                 <p className="text-xs text-gray-500">Account Holder</p>
//                                                 <p className="font-medium text-[#14213D]">{bankDetails.accountHolderName}</p>
//                                             </div>
//                                         </div>

//                                         <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
//                                             <CreditCard className="w-4 h-4 text-[#C9A94D]" />
//                                             <div>
//                                                 <p className="text-xs text-gray-500">Account Number</p>
//                                                 <p className="font-medium text-[#14213D]">{bankDetails.accountNumber}</p>
//                                             </div>
//                                         </div>

//                                         {/* NEW: Sort Code */}
//                                         {bankDetails.sortCode && (
//                                             <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
//                                                 <Hash className="w-4 h-4 text-[#C9A94D]" />
//                                                 <div>
//                                                     <p className="text-xs text-gray-500">Sort Code</p>
//                                                     <p className="font-medium text-[#14213D]">{bankDetails.sortCode}</p>
//                                                 </div>
//                                             </div>
//                                         )}

//                                         <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
//                                             <Building className="w-4 h-4 text-[#C9A94D]" />
//                                             <div>
//                                                 <p className="text-xs text-gray-500">Bank Name</p>
//                                                 <p className="font-medium text-[#14213D]">{bankDetails.bankName}</p>
//                                             </div>
//                                         </div>

//                                         <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
//                                             <Globe className="w-4 h-4 text-[#C9A94D]" />
//                                             <div>
//                                                 <p className="text-xs text-gray-500">Country</p>
//                                                 <p className="font-medium text-[#14213D]">{bankDetails.country}</p>
//                                             </div>
//                                         </div>

//                                         {/* NEW: IBAN */}
//                                         {bankDetails.iban && (
//                                             <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
//                                                 <GlobeIcon className="w-4 h-4 text-[#C9A94D]" />
//                                                 <div>
//                                                     <p className="text-xs text-gray-500">IBAN</p>
//                                                     <p className="font-medium text-[#14213D]">{bankDetails.iban}</p>
//                                                 </div>
//                                             </div>
//                                         )}

//                                         {/* NEW: BIC/SWIFT */}
//                                         {bankDetails.bicSwift && (
//                                             <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
//                                                 <Key className="w-4 h-4 text-[#C9A94D]" />
//                                                 <div>
//                                                     <p className="text-xs text-gray-500">BIC/SWIFT Code</p>
//                                                     <p className="font-medium text-[#14213D]">{bankDetails.bicSwift}</p>
//                                                 </div>
//                                             </div>
//                                         )}
//                                     </div>

//                                     {/* Action Buttons */}
//                                     <div className="flex gap-3 pt-4">
//                                         <button onClick={handleEdit} className="flex-1 bg-[#C9A94D] text-white py-2 px-4 rounded-lg font-medium hover:bg-[#b8973e] transition-colors flex items-center justify-center gap-2">
//                                             <Edit className="w-4 h-4" />
//                                             Edit
//                                         </button>
//                                         <button onClick={handleDelete} disabled={isDeleting} className="flex-1 bg-white border border-red-300 text-red-600 py-2 px-4 rounded-lg font-medium hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2">
//                                             {isDeleting ? <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" /> : <Trash2 className="w-4 h-4" />}
//                                             {isDeleting ? "Deleting..." : "Delete"}
//                                         </button>
//                                     </div>
//                                 </div>
//                             ) : (
//                                 // Add/Edit Form
//                                 <form onSubmit={handleSubmit} className="space-y-4">
//                                     <div>
//                                         <label className="block text-sm font-medium text-[#14213D] mb-1">Account Holder Name *</label>
//                                         <input type="text" required value={formData.accountHolderName} onChange={(e) => setFormData({ ...formData, accountHolderName: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#C9A94D] focus:border-transparent" placeholder="John Doe" />
//                                     </div>

//                                     <div className="grid grid-cols-2 gap-4">
//                                         <div>
//                                             <label className="block text-sm font-medium text-[#14213D] mb-1">Account Number *</label>
//                                             <input type="text" required value={formData.accountNumber} onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#C9A94D] focus:border-transparent" placeholder="12345678" />
//                                             <p className="text-xs text-gray-500 mt-1">8 digits for UK</p>
//                                         </div>

//                                         <div>
//                                             <label className="block text-sm font-medium text-[#14213D] mb-1">Sort Code *</label>
//                                             <input type="text" required value={formData.sortCode} onChange={(e) => setFormData({ ...formData, sortCode: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#C9A94D] focus:border-transparent" placeholder="12-34-56 or 123456" />
//                                             <p className="text-xs text-gray-500 mt-1">6 digits for UK</p>
//                                         </div>
//                                     </div>

//                                     <div>
//                                         <label className="block text-sm font-medium text-[#14213D] mb-1">Bank Name *</label>
//                                         <input type="text" required value={formData.bankName} onChange={(e) => setFormData({ ...formData, bankName: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#C9A94D] focus:border-transparent" placeholder="HSBC, Barclays, etc." />
//                                     </div>

//                                     <div className="grid grid-cols-2 gap-4">
//                                         <div>
//                                             <label className="block text-sm font-medium text-[#14213D] mb-1">Account Type *</label>
//                                             <select required value={formData.accountType} onChange={(e) => setFormData({ ...formData, accountType: e.target.value as "personal" | "business" })} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#C9A94D] focus:border-transparent">
//                                                 <option value="personal">Personal</option>
//                                                 <option value="business">Business</option>
//                                             </select>
//                                         </div>

//                                         <div>
//                                             <label className="block text-sm font-medium text-[#14213D] mb-1">Country *</label>
//                                             <input type="text" required value={formData.country} onChange={(e) => setFormData({ ...formData, country: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#C9A94D] focus:border-transparent" placeholder="United Kingdom" />
//                                         </div>
//                                     </div>

//                                     {/* NEW: International fields (optional) */}
//                                     <div>
//                                         <label className="block text-sm font-medium text-[#14213D] mb-1">IBAN (Optional)</label>
//                                         <input type="text" value={formData.iban} onChange={(e) => setFormData({ ...formData, iban: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#C9A94D] focus:border-transparent" placeholder="GB29NWBK60161331926819" />
//                                         <p className="text-xs text-gray-500 mt-1">For international transfers</p>
//                                     </div>

//                                     <div>
//                                         <label className="block text-sm font-medium text-[#14213D] mb-1">BIC/SWIFT Code (Optional)</label>
//                                         <input type="text" value={formData.bicSwift} onChange={(e) => setFormData({ ...formData, bicSwift: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#C9A94D] focus:border-transparent" placeholder="NWBKGB2L" />
//                                         <p className="text-xs text-gray-500 mt-1">For international transfers</p>
//                                     </div>

//                                     {/* Action Buttons */}
//                                     <div className="flex gap-3 pt-4">
//                                         <button type="submit" disabled={isLoading} className="flex-1 bg-[#C9A94D] text-white py-2 px-4 rounded-lg font-medium hover:bg-[#b8973e] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2">
//                                             {isLoading ? "Saving..." : isEditMode ? "Update Details" : "Add Bank Details"}
//                                         </button>
//                                         <button
//                                             type="button"
//                                             onClick={() => {
//                                                 setIsModalOpen(false);
//                                                 resetForm();
//                                             }}
//                                             className="flex-1 bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors"
//                                         >
//                                             Cancel
//                                         </button>
//                                     </div>
//                                 </form>
//                             )}
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </>
//     );
// };

// export default BankDetailsModal;

"use client";
import { useState, useEffect } from "react";
import { CheckCircle, CreditCard, Plus, Edit, Trash2, X, Building, User, Globe, Hash, GlobeIcon, Key } from "lucide-react";
import Image from "next/image";
import { useCreateBankDetailsMutation, useGetMyBankDetailsQuery, useUpdateMyBankDetailsMutation, useDeleteMyBankDetailsMutation, bankDetailsApi } from "@/redux/features/bankdetails/bankDetailsApi";
import { toast } from "sonner";
import Swal from "sweetalert2";
import { useDispatch } from "react-redux";

interface BankDetailsModalProps {
    bankDetailsResponse: any;
    bankDetailsLoading: boolean;
    refetchBankDetails: () => void;
}

const BankDetailsModal = ({ bankDetailsResponse, bankDetailsLoading, refetchBankDetails }: BankDetailsModalProps) => {
    const dispatch = useDispatch();
    const [showBankRules, setShowBankRules] = useState(false);
    const [createBankDetails, { isLoading: isCreating }] = useCreateBankDetailsMutation();
    const [updateBankDetails, { isLoading: isUpdating }] = useUpdateMyBankDetailsMutation();
    const [deleteBankDetails, { isLoading: isDeleting }] = useDeleteMyBankDetailsMutation();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);

    const [formData, setFormData] = useState({
        accountHolderName: "",
        accountNumber: "",
        sortCode: "",
        bankName: "",
        accountType: "personal" as "personal" | "business",
        country: "",
        iban: "",
        bicSwift: "",
    });

    const bankDetails = bankDetailsResponse?.data;
    const hasBankDetails = !!bankDetails;
    const isLoading = isCreating || isUpdating || isDeleting;

    useEffect(() => {
        if (bankDetails && isEditMode) {
            setFormData({
                accountHolderName: bankDetails.accountHolderName,
                accountNumber: bankDetails.accountNumber,
                sortCode: bankDetails.sortCode || "",
                bankName: bankDetails.bankName,
                accountType: bankDetails.accountType,
                country: bankDetails.country,
                iban: bankDetails.iban || "",
                bicSwift: bankDetails.bicSwift || "",
            });
        }
    }, [bankDetails, isEditMode]);

    const resetForm = () => {
        setFormData({
            accountHolderName: "",
            accountNumber: "",
            sortCode: "",
            bankName: "",
            accountType: "personal",
            country: "",
            iban: "",
            bicSwift: "",
        });
        setIsEditMode(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const payload: any = {
            accountHolderName: formData.accountHolderName,
            accountNumber: formData.accountNumber,
            sortCode: formData.sortCode,
            bankName: formData.bankName,
            accountType: formData.accountType,
            country: formData.country,
        };

        if (formData.iban.trim()) payload.iban = formData.iban;
        if (formData.bicSwift.trim()) payload.bicSwift = formData.bicSwift;

        try {
            if (isEditMode) {
                await updateBankDetails(payload).unwrap();
                toast.success("Bank details updated successfully");
            } else {
                await createBankDetails(payload).unwrap();
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
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "You are about to delete your bank details",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#C9A94D",
            cancelButtonColor: "#434D64",
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "Cancel",
            background: "#2D3546",
            color: "#FFFFFF",
            customClass: {
                popup: "border border-[#C9A94D] rounded-[20px]",
                title: "text-[#C9A94D]",
                htmlContainer: "text-gray-300",
                confirmButton: "bg-[#C9A94D] hover:bg-[#b8973e] text-white font-medium py-2 px-6 rounded-lg transition",
                cancelButton: "bg-[#434D64] hover:bg-[#535a6b] text-white font-medium py-2 px-6 rounded-lg transition",
                icon: "text-[#C9A94D]",
                actions: "gap-3 mt-4",
            },
            buttonsStyling: false,
            reverseButtons: true,
        });

        if (!result.isConfirmed) return;

        try {
            await deleteBankDetails().unwrap();
            toast.success("Bank details deleted successfully");
            dispatch(bankDetailsApi.util.invalidateTags(["MyBankDetails"]));
            refetchBankDetails();
            setIsModalOpen(false);
            resetForm();
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to delete bank details");
            refetchBankDetails();
        }
    };

    const handleEdit = () => {
        setIsEditMode(true);
    };

    return (
        <>
            {/* Bank Details Button */}
            <div className="flex items-center gap-2">
                <div className="flex items-center gap-2">
                    <div onClick={() => setIsModalOpen(true)} className="flex items-center gap-1 cursor-pointer transition hover:text-[#C9A94D]">
                        <Image src="/listing/add/plus-circle.png" alt="Add Bank Details" width={24} height={24} />
                        {bankDetailsLoading ? <p>Checking Bank Details...</p> : hasBankDetails ? <p>Bank Details Added</p> : <p>Add Bank Details (To Receive Payment Via Bank Transfer)</p>}
                    </div>

                    {/* Tooltip */}
                    <div className="relative inline-block" onMouseEnter={() => setShowBankRules(true)} onMouseLeave={() => setShowBankRules(false)} onClick={() => setShowBankRules(!showBankRules)}>
                        <Image src="/listing/add/info-circle.png" alt="Info" width={24} height={24} />

                        {showBankRules && (
                            <div className="absolute -right-5 md:right-unset md:left-1/2 md:bottom-full bottom-full mb-2 md:mb-4 w-72 md:w-[520px] bg-[#14213D] text-white text-sm p-6 rounded-[10px] shadow-lg md:-translate-x-1/2 border border-[#C9A94D] z-50" style={{ maxHeight: "80vh", overflowY: "auto" }}>
                                <h2 className="font-bold mb-2 text-[14px]">Bank Details Information</h2>
                                <p className="mb-2">You can receive payments securely by adding your bank details — this is fully permitted and ensures your funds go directly to your account via bank transfer.</p>
                                <p className="mb-2">If you want to access additional features, you can also link or set up a Stripe account, but adding your bank details is enough to start receiving payments safely.</p>

                                <div className="mt-4 pt-4 border-t border-gray-600">
                                    <h3 className="font-bold mb-2 text-[13px]">For UK Bank Transfers, provide:</h3>
                                    <ul className="space-y-1 text-[12px]">
                                        <li>• Account Holder Name</li>
                                        <li>• 8-digit Account Number</li>
                                        <li>• 6-digit Sort Code (e.g., 12-34-56)</li>
                                    </ul>
                                    <p className="mt-2 text-[12px]">For international transfers, also provide IBAN and BIC/SWIFT code.</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-auto animate-in fade-in-90 zoom-in-90 max-h-[90vh] flex flex-col">
                        {/* Modal Header - Fixed */}
                        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 flex-shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-[#C9A94D]/10 rounded-lg">
                                    <CreditCard className="w-5 h-5 text-[#C9A94D]" />
                                </div>
                                <div>
                                    <h2 className="text-lg sm:text-xl font-bold text-[#14213D]">{hasBankDetails && !isEditMode ? "Bank Details" : isEditMode ? "Edit Bank Details" : "Add Bank Details"}</h2>
                                    <p className="text-[#6B7280] text-xs sm:text-sm">{hasBankDetails && !isEditMode ? "Manage your bank account" : "Add your bank account details"}</p>
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

                        {/* Modal Content - Scrollable */}
                        <div className="p-4 sm:p-6 overflow-y-auto flex-grow">
                            {hasBankDetails && !isEditMode ? (
                                // View Mode
                                <div className="space-y-4">
                                    {/* Status */}
                                    <div className="p-4 rounded-xl border-2 border-green-200 bg-green-50">
                                        <div className="flex items-center gap-3">
                                            <CheckCircle className="w-5 h-5 text-green-600" />
                                            <div>
                                                <p className="font-semibold text-[#14213D] text-sm sm:text-base">Bank Details Added</p>
                                                <p className="text-xs sm:text-sm text-[#6B7280]">Ready to receive payments</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Bank Details */}
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                            <User className="w-4 h-4 text-[#C9A94D]" />
                                            <div>
                                                <p className="text-xs text-gray-500">Account Holder</p>
                                                <p className="font-medium text-[#14213D] text-sm sm:text-base">{bankDetails.accountHolderName}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                            <CreditCard className="w-4 h-4 text-[#C9A94D]" />
                                            <div>
                                                <p className="text-xs text-gray-500">Account Number</p>
                                                <p className="font-medium text-[#14213D] text-sm sm:text-base">{bankDetails.accountNumber}</p>
                                            </div>
                                        </div>

                                        {bankDetails.sortCode && (
                                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                                <Hash className="w-4 h-4 text-[#C9A94D]" />
                                                <div>
                                                    <p className="text-xs text-gray-500">Sort Code</p>
                                                    <p className="font-medium text-[#14213D] text-sm sm:text-base">{bankDetails.sortCode}</p>
                                                </div>
                                            </div>
                                        )}

                                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                            <Building className="w-4 h-4 text-[#C9A94D]" />
                                            <div>
                                                <p className="text-xs text-gray-500">Bank Name</p>
                                                <p className="font-medium text-[#14213D] text-sm sm:text-base">{bankDetails.bankName}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                            <Globe className="w-4 h-4 text-[#C9A94D]" />
                                            <div>
                                                <p className="text-xs text-gray-500">Country</p>
                                                <p className="font-medium text-[#14213D] text-sm sm:text-base">{bankDetails.country}</p>
                                            </div>
                                        </div>

                                        {bankDetails.iban && (
                                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                                <GlobeIcon className="w-4 h-4 text-[#C9A94D]" />
                                                <div>
                                                    <p className="text-xs text-gray-500">IBAN</p>
                                                    <p className="font-medium text-[#14213D] text-sm sm:text-base">{bankDetails.iban}</p>
                                                </div>
                                            </div>
                                        )}

                                        {bankDetails.bicSwift && (
                                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                                <Key className="w-4 h-4 text-[#C9A94D]" />
                                                <div>
                                                    <p className="text-xs text-gray-500">BIC/SWIFT Code</p>
                                                    <p className="font-medium text-[#14213D] text-sm sm:text-base">{bankDetails.bicSwift}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                // Add/Edit Form
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-[#14213D] mb-1">Account Holder Name *</label>
                                        <input type="text" required value={formData.accountHolderName} onChange={(e) => setFormData({ ...formData, accountHolderName: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#C9A94D] focus:border-transparent" placeholder="John Doe" />
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-[#14213D] mb-1">Account Number *</label>
                                            <input type="text" required value={formData.accountNumber} onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#C9A94D] focus:border-transparent" placeholder="12345678" />
                                            <p className="text-xs text-gray-500 mt-1">8 digits for UK</p>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-[#14213D] mb-1">Sort Code *</label>
                                            <input type="text" required value={formData.sortCode} onChange={(e) => setFormData({ ...formData, sortCode: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#C9A94D] focus:border-transparent" placeholder="12-34-56 or 123456" />
                                            <p className="text-xs text-gray-500 mt-1">6 digits for UK</p>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-[#14213D] mb-1">Bank Name *</label>
                                        <input type="text" required value={formData.bankName} onChange={(e) => setFormData({ ...formData, bankName: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#C9A94D] focus:border-transparent" placeholder="HSBC, Barclays, etc." />
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-[#14213D] mb-1">Account Type *</label>
                                            <select required value={formData.accountType} onChange={(e) => setFormData({ ...formData, accountType: e.target.value as "personal" | "business" })} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#C9A94D] focus:border-transparent h-auto">
                                                <option value="personal">Personal</option>
                                                <option value="business">Business</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-[#14213D] mb-1">Country *</label>
                                            <input type="text" required value={formData.country} onChange={(e) => setFormData({ ...formData, country: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#C9A94D] focus:border-transparent" placeholder="United Kingdom" />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-[#14213D] mb-1">IBAN (Optional)</label>
                                        <input type="text" value={formData.iban} onChange={(e) => setFormData({ ...formData, iban: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#C9A94D] focus:border-transparent" placeholder="GB29NWBK60161331926819" />
                                        <p className="text-xs text-gray-500 mt-1">For international transfers</p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-[#14213D] mb-1">BIC/SWIFT Code (Optional)</label>
                                        <input type="text" value={formData.bicSwift} onChange={(e) => setFormData({ ...formData, bicSwift: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#C9A94D] focus:border-transparent" placeholder="NWBKGB2L" />
                                        <p className="text-xs text-gray-500 mt-1">For international transfers</p>
                                    </div>
                                </form>
                            )}
                        </div>

                        {/* Action Buttons - Fixed at bottom */}
                        <div className="p-4 sm:p-6 border-t border-gray-200 flex-shrink-0">
                            {hasBankDetails && !isEditMode ? (
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <button onClick={handleEdit} className="flex-1 bg-[#C9A94D] text-white py-2 px-4 rounded-lg font-medium hover:bg-[#b8973e] transition-colors flex items-center justify-center gap-2">
                                        <Edit className="w-4 h-4" />
                                        Edit
                                    </button>
                                    <button onClick={handleDelete} disabled={isDeleting} className="flex-1 bg-white border border-red-300 text-red-600 py-2 px-4 rounded-lg font-medium hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2">
                                        {isDeleting ? <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" /> : <Trash2 className="w-4 h-4" />}
                                        {isDeleting ? "Deleting..." : "Delete"}
                                    </button>
                                </div>
                            ) : (
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <button type="submit" onClick={handleSubmit} disabled={isLoading} className="flex-1 bg-[#C9A94D] text-white py-2 px-4 rounded-lg font-medium hover:bg-[#b8973e] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2">
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
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default BankDetailsModal;

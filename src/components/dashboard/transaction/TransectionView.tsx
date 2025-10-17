// "use client";

// import React, { useEffect, useState } from "react";
// import { ChevronLeft, ChevronRight, FileDown } from "lucide-react";
// import { Transaction } from "@/types/transection";
// import PageHeader from "@/components/PageHeader";
// import { useGetAllPaymentsQuery } from "@/redux/features/propertyPayment/propertyPaymentApi";

// const TransectionView = () => {
//     const { data: transectionData, error } = useGetAllPaymentsQuery({});
//     console.log(transectionData);
//     console.log(error);

//     const [transactions, setTransactions] = useState<Transaction[]>([]);
//     const [currentPage, setCurrentPage] = useState(1);
//     const itemsPerPage = 10;

//     useEffect(() => {
//         fetch("/data/transaction.json")
//             .then((res) => res.json())
//             .then((data) => setTransactions(data.data))
//             .catch((err) => console.error(err));
//     }, []);

//     const totalPages = Math.ceil(transactions.length / itemsPerPage);
//     const displayedTransactions = transactions.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

//     const handlePageChange = (page: number) => setCurrentPage(page);

//     return (
//         <div>
//             {/* Header */}
//             <PageHeader title={"Transactions"}></PageHeader>

//             {/* Welcome Text */}
//             <div className="text-[#C9A94D] mb-8">
//                 <h1 className="font-bold text-[30px] mb-4">Transactions</h1>
//                 <p>Here’s the latest transaction data for your account.</p>
//             </div>

//             <div className="bg-[#2D3546] p-5 rounded-[4px] mb-4">
//                 {/* Table */}
//                 <div className="overflow-x-auto rounded-[4px] border border-[#B6BAC3]">
//                     <table className="min-w-full text-white">
//                         <thead className="bg-[#14213D] text-white">
//                             <tr>
//                                 <th className="py-3 px-6 text-left font-normal">Transaction ID</th>
//                                 <th className="py-3 px-6 text-left font-normal">Guest Name</th>
//                                 <th className="py-3 px-6 text-left font-normal">Property Price</th>
//                                 <th className="py-3 px-6 text-left font-normal">Admin Commission</th>
//                                 <th className="py-3 px-6 text-left font-normal">Payment Status</th>
//                                 <th className="py-3 px-6 text-left font-normal">Date</th>
//                                 <th className="py-3 px-6 text-center font-normal">Action</th>
//                             </tr>
//                         </thead>
//                         <tbody className="divide-y divide-gray-300">
//                             {displayedTransactions.map((tx) => (
//                                 <tr key={tx.id} className="hover:bg-[#C9A94D]/20">
//                                     <td className="py-3 px-6 font-normal">{tx.id}</td>
//                                     <td className="py-3 px-6 font-normal">{tx.guestName}</td>
//                                     <td className="py-3 px-6 font-normal">£{tx.propertyPrice}</td>
//                                     <td className="py-3 px-6 font-normal">{tx.adminCommission}</td>
//                                     <td className="py-3 px-6 font-normal">{tx.paymentStatus}</td>
//                                     <td className="py-3 px-6 font-normal">{tx.date}</td>
//                                     <td className="py-3 px-6 font-normal text-center">
//                                         <p className="px-4 py-2 rounded text-white  flex text-left items-center gap-2">
//                                             <FileDown className="h-6 w-6" /> Download <br /> as PDF
//                                         </p>
//                                     </td>
//                                 </tr>
//                             ))}

//                             {displayedTransactions.length === 0 && (
//                                 <tr>
//                                     <td colSpan={7} className="py-3 px-6 text-center text-gray-300">
//                                         No transactions found
//                                     </td>
//                                 </tr>
//                             )}
//                         </tbody>
//                     </table>
//                 </div>

//                 {/* Pagination */}
//                 <div className="flex justify-end items-center mt-6 gap-2">
//                     {/* Left Arrow */}
//                     <button onClick={() => handlePageChange(Math.max(1, currentPage - 1))} className="p-2 text-[#C9A94D]">
//                         <ChevronLeft className="w-8 h-8" />
//                     </button>

//                     {/* Page numbers with ellipsis */}
//                     {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((page) => {
//                         if (page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
//                             return (
//                                 <button key={page} onClick={() => handlePageChange(page)} className={`px-4 py-2 rounded-full font-medium ${currentPage === page ? "bg-[#C9A94D] text-white border border-[#C9A94D]" : "bg-transparent text-white border border-[#C9A94D] hover:bg-[#C9A94D]/20"}`}>
//                                     {page}
//                                 </button>
//                             );
//                         } else if (page === currentPage - 2 || page === currentPage + 2) {
//                             return (
//                                 <span key={page} className="px-2 text-white">
//                                     ...
//                                 </span>
//                             );
//                         } else {
//                             return null;
//                         }
//                     })}

//                     {/* Right Arrow */}
//                     <button onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))} className="p-2 text-[#C9A94D]">
//                         <ChevronRight className="w-8 h-8" />
//                     </button>
//                 </div>
//             </div>
//             <div>
//                 <div className="border border-[#C9A94D] bg-[#2D3546] rounded-2xl p-6 w-full max-w-[500px]">
//                     <h2 className="text-[#C9A94D] text-xl md:text-[28px] font-bold mb-5">Summary</h2>
//                     <div className="flex flex-col gap-3 border border-[#C9A94D] px-5 py-[10px] rounded-[12px] text-[#C9A94D]">
//                         <div className="flex justify-between  text-xl md:text-[24px] font-bold border-b border-[#C9A94D] ">
//                             <span>Total Revenue:</span>
//                             <span>£4,300.00</span>
//                         </div>
//                         <div className="flex justify-between">
//                             <span>Admin Commission Paid:</span>
//                             <span>£215.00</span>
//                         </div>
//                         <div className="flex justify-between">
//                             <span>Hosts Earnings (after commission):</span>
//                             <span>£4,085.00</span>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default TransectionView;

"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { useGetAllPaymentsQuery, useGetPaymentTotalsQuery } from "@/redux/features/propertyPayment/propertyPaymentApi";

const TransectionView = () => {
    const { data: transectionData, error, isLoading } = useGetAllPaymentsQuery({});
    const { data: totalsData } = useGetPaymentTotalsQuery();
    console.log(totalsData);
    const [currentPage, setCurrentPage] = useState(1);

    // Use real API data instead of mock data
    const transactions = transectionData?.data || [];
    const meta = transectionData?.meta || { page: 1, limit: 10, total: 0, totalPages: 0 };

    const totalPages = meta.totalPages;
    const displayedTransactions = transactions;

    const handlePageChange = (page: number) => setCurrentPage(page);

    // Use pre-calculated totals from the new endpoint
    const totalRevenue = totalsData?.data?.totalRevenue || 0;
    const totalCommission = totalsData?.data?.totalCommission || 0;
    const totalBookingFees = totalsData?.data?.totalBookingFees || 0;
    const totalExtraFees = totalsData?.data?.totalExtraFees || 0;
    const totalPlatformTotal = totalsData?.data?.totalPlatformTotal || 0;
    const totalHostEarnings = totalsData?.data?.totalHostEarnings || 0;

    if (isLoading) return <div className="text-white text-center py-8">Loading transactions...</div>;
    if (error) return <div className="text-red-500 text-center py-8">Error loading transactions</div>;

    return (
        <div>
            {/* Header */}
            <PageHeader title={"Transactions"}></PageHeader>

            {/* Welcome Text */}
            <div className="text-[#C9A94D] mb-8">
                <h1 className="font-bold text-[30px] mb-4">Transactions</h1>
                <p>Here's the latest transaction data for your account.</p>
            </div>

            <div className="bg-[#2D3546] p-5 rounded-[4px] mb-4">
                {/* Table */}
                <div className="overflow-x-auto rounded-[4px] border border-[#B6BAC3]">
                    <table className="min-w-full text-white">
                        <thead className="bg-[#14213D] text-white">
                            <tr>
                                <th className="py-3 px-6 text-left font-normal">Payment ID</th>
                                <th className="py-3 px-6 text-left font-normal">Guest</th>
                                <th className="py-3 px-6 text-left font-normal">Host</th>
                                <th className="py-3 px-6 text-left font-normal">Agreed Fee</th>
                                <th className="py-3 px-6 text-left font-normal">Total Paid</th>
                                <th className="py-3 px-6 text-left font-normal">Commission</th>
                                <th className="py-3 px-6 text-left font-normal">Host Earnings</th>
                                <th className="py-3 px-6 text-left font-normal">Platform Fee</th>
                                <th className="py-3 px-6 text-left font-normal">Status</th>
                                <th className="py-3 px-6 text-left font-normal">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-300">
                            {displayedTransactions.map((tx: any) => (
                                <tr key={tx._id} className="hover:bg-[#C9A94D]/20">
                                    <td className="py-3 px-6 font-normal">
                                        <div className="relative group">
                                            <span
                                                className="cursor-help truncate max-w-[120px] inline-block border-b border-dashed border-gray-400 select-all"
                                                onDoubleClick={(e) => {
                                                    navigator.clipboard.writeText(tx.stripePaymentIntentId);
                                                    const originalText = e.currentTarget.textContent;
                                                    e.currentTarget.textContent = "Copied!";
                                                    setTimeout(() => {
                                                        e.currentTarget.textContent = originalText;
                                                    }, 1000);
                                                }}
                                                title="Double-click to copy"
                                            >
                                                {tx.stripePaymentIntentId.slice(0, 8)}...
                                            </span>
                                            <div className="absolute left-0 -top-8 hidden group-hover:block bg-gray-800 text-white text-xs p-2 rounded shadow-lg z-10 whitespace-nowrap">
                                                {tx.stripePaymentIntentId}
                                                <div className="text-[10px] text-gray-300 mt-1">Double-click to copy</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-3 px-6 font-normal">{tx.userId?.name || "N/A"}</td>
                                    <td className="py-3 px-6 font-normal">{tx.propertyId?.createdBy?.name || "N/A"}</td>
                                    <td className="py-3 px-6 font-normal">£{tx.agreedFee}</td>
                                    <td className="py-3 px-6 font-normal">£{tx.totalAmount}</td>
                                    <td className="py-3 px-6 font-normal">£{tx.commissionAmount}</td>
                                    <td className="py-3 px-6 font-normal">£{tx.hostAmount}</td>
                                    <td className="py-3 px-6 font-normal">£{tx.platformTotal}</td>
                                    <td className="py-3 px-6 font-normal">
                                        <span className={`px-2 py-1 rounded-full text-xs ${tx.status === "completed" ? "bg-green-500" : tx.status === "pending" ? "bg-yellow-500" : "bg-red-500"}`}>{tx.status}</span>
                                    </td>
                                    <td className="py-3 px-6 font-normal">{new Date(tx.paidAt || tx.createdAt).toLocaleDateString()}</td>
                                </tr>
                            ))}

                            {displayedTransactions.length === 0 && (
                                <tr>
                                    <td colSpan={10} className="py-3 px-6 text-center text-gray-300">
                                        No transactions found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination - Only show if more than 1 page */}
                {totalPages > 1 && (
                    <div className="flex justify-end items-center mt-6 gap-2">
                        {/* Left Arrow */}
                        <button onClick={() => handlePageChange(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="p-2 text-[#C9A94D] disabled:opacity-50">
                            <ChevronLeft className="w-8 h-8" />
                        </button>

                        {/* Page numbers with ellipsis */}
                        {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((page) => {
                            if (page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
                                return (
                                    <button key={page} onClick={() => handlePageChange(page)} className={`px-4 py-2 rounded-full font-medium ${currentPage === page ? "bg-[#C9A94D] text-white border border-[#C9A94D]" : "bg-transparent text-white border border-[#C9A94D] hover:bg-[#C9A94D]/20"}`}>
                                        {page}
                                    </button>
                                );
                            } else if (page === currentPage - 2 || page === currentPage + 2) {
                                return (
                                    <span key={page} className="px-2 text-white">
                                        ...
                                    </span>
                                );
                            } else {
                                return null;
                            }
                        })}

                        {/* Right Arrow */}
                        <button onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className="p-2 text-[#C9A94D] disabled:opacity-50">
                            <ChevronRight className="w-8 h-8" />
                        </button>
                    </div>
                )}
            </div>

            {/* Summary Section */}
            <div>
                <div className="border border-[#C9A94D] bg-[#2D3546] rounded-2xl p-6 w-full max-w-[500px]">
                    <h2 className="text-[#C9A94D] text-xl md:text-[28px] font-bold mb-5">Summary</h2>
                    <div className="flex flex-col gap-3 border border-[#C9A94D] px-5 py-[10px] rounded-[12px] text-[#C9A94D]">
                        <div className="flex justify-between text-xl md:text-[24px] font-bold border-b border-[#C9A94D] pb-2">
                            <span>Total Payments:</span>
                            <span>£{totalRevenue.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Commissions:</span>
                            <span>£{totalCommission.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Booking Fees:</span>
                            <span>£{totalBookingFees.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Extra Fees:</span>
                            <span>£{totalExtraFees.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between border-t border-[#C9A94D] pt-2 font-bold">
                            <span>Owner Total:</span>
                            <span>£{totalPlatformTotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Hosts Earnings:</span>
                            <span>£{totalHostEarnings.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TransectionView;

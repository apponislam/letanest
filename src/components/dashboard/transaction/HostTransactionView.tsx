// "use client";
// import { useGetHostPaymentsQuery } from "@/redux/features/propertyPayment/propertyPaymentApi";
// import React from "react";

// const HostTransectionView = () => {
//     const {
//         data: paymentsData,
//         isLoading,
//         error,
//     } = useGetHostPaymentsQuery({
//         page: 1,
//         limit: 100,
//     });

//     const payments = paymentsData?.data || [];
//     const meta = paymentsData?.meta;

//     const formatDate = (dateString: string) => {
//         return new Date(dateString).toLocaleDateString("en-US", {
//             year: "numeric",
//             month: "long",
//             day: "numeric",
//         });
//     };

//     const getStatusBadge = (status: string) => {
//         const statusColors = {
//             completed: "bg-green-500",
//             pending: "bg-yellow-500",
//             failed: "bg-red-500",
//             canceled: "bg-red-500",
//             processing: "bg-blue-500",
//             requires_action: "bg-orange-500",
//         };

//         return <span className={`px-2 py-1 rounded-full text-xs text-white ${statusColors[status as keyof typeof statusColors] || "bg-gray-500"}`}>{status.replace("_", " ").toUpperCase()}</span>;
//     };

//     return (
//         <div className="container mx-auto p-6">
//             <h1 className="text-3xl font-bold text-[#C9A94D] mb-6">My Payments</h1>

//             <div className="bg-[#2D3546] border border-[#C9A94D] rounded-[20px] p-6">
//                 {/* Header */}
//                 <div className="flex justify-between items-center mb-6">
//                     <h2 className="text-2xl font-semibold text-[#C9A94D]">Payment History</h2>
//                     <div className="text-white">
//                         Total Earnings: <span className="text-[#C9A94D] font-bold">${meta?.totalAmount || 0}</span>
//                     </div>
//                 </div>

//                 {isLoading ? (
//                     <div className="text-center py-8 text-[#C9A94D]">Loading payments...</div>
//                 ) : error ? (
//                     <div className="text-center py-8 text-red-500">Error loading payments</div>
//                 ) : payments.length === 0 ? (
//                     <div className="text-center py-8 text-[#C9A94D]">No payments found</div>
//                 ) : (
//                     <div className="space-y-4">
//                         {payments.map((payment: any) => (
//                             <div key={payment._id} className="p-4 rounded-[12px] border border-[#C9A94D] bg-[#1a2235]">
//                                 <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
//                                     <div>
//                                         <p className="font-bold text-white">Property</p>
//                                         <p className="text-[#C9A94D]">{payment.propertyId?.title || "N/A"}</p>
//                                     </div>
//                                     <div>
//                                         <p className="font-bold text-white">Guest</p>
//                                         <p className="text-[#C9A94D]">{payment.userId?.name || "N/A"}</p>
//                                     </div>
//                                     <div>
//                                         <p className="font-bold text-white">Host Amount</p>
//                                         <p className="text-green-500 font-semibold">+${payment.hostAmount}</p>
//                                     </div>
//                                     <div>
//                                         <p className="font-bold text-white">Date</p>
//                                         <p className="text-[#C9A94D]">{formatDate(payment.createdAt)}</p>
//                                     </div>
//                                     <div>
//                                         <p className="font-bold text-white">Status</p>
//                                         {getStatusBadge(payment.status)}
//                                     </div>
//                                 </div>

//                                 {/* Payment Details */}
//                                 <div className="mt-3 pt-3 border-t border-[#434D64]">
//                                     <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
//                                         <div>
//                                             <span className="text-gray-400">Total Amount:</span>
//                                             <p className="text-white">${payment.totalAmount}</p>
//                                         </div>
//                                         <div>
//                                             <span className="text-gray-400">Commission:</span>
//                                             <p className="text-red-400">-${payment.commissionAmount}</p>
//                                         </div>
//                                         <div>
//                                             <span className="text-gray-400">Booking Fee:</span>
//                                             <p className="text-yellow-400">${payment.bookingFee}</p>
//                                         </div>
//                                         <div>
//                                             <span className="text-gray-400">Extra Fee:</span>
//                                             <p className="text-blue-400">${payment.extraFee || 0}</p>
//                                         </div>
//                                     </div>
//                                 </div>

//                                 {/* Check-in/Check-out Dates */}
//                                 {payment.messageId?.checkInDate && (
//                                     <div className="mt-2 text-sm">
//                                         <span className="text-gray-400">Stay: </span>
//                                         <span className="text-white">
//                                             {formatDate(payment.messageId.checkInDate)} - {formatDate(payment.messageId.checkOutDate)}
//                                         </span>
//                                     </div>
//                                 )}

//                                 {/* Payment ID */}
//                                 <div className="mt-2 text-xs">
//                                     <span className="text-gray-400">Payment ID: </span>
//                                     <span className="text-gray-300">{payment.stripePaymentIntentId}</span>
//                                 </div>
//                             </div>
//                         ))}
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default HostTransectionView;

"use client";
import { useGetHostPaymentsQuery } from "@/redux/features/propertyPayment/propertyPaymentApi";
import React, { useState } from "react";

const HostTransectionView = () => {
    const [page, setPage] = useState(1);
    const limit = 10;

    const {
        data: paymentsData,
        isLoading,
        error,
    } = useGetHostPaymentsQuery({
        page,
        limit,
    });

    const payments = paymentsData?.data || [];
    const meta = paymentsData?.meta;
    const totalPages = meta?.total ? Math.ceil(meta.total / limit) : 0;

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const getStatusBadge = (status: string) => {
        const statusColors = {
            completed: "bg-green-500",
            pending: "bg-yellow-500",
            failed: "bg-red-500",
            canceled: "bg-red-500",
            processing: "bg-blue-500",
            requires_action: "bg-orange-500",
        };

        return <span className={`px-2 py-1 rounded-full text-xs text-white ${statusColors[status as keyof typeof statusColors] || "bg-gray-500"}`}>{status.replace("_", " ").toUpperCase()}</span>;
    };

    const handlePreviousPage = () => {
        if (page > 1) {
            setPage(page - 1);
        }
    };

    const handleNextPage = () => {
        if (page < totalPages) {
            setPage(page + 1);
        }
    };

    return (
        <div className="container mx-auto md:p-6">
            <h1 className="text-3xl font-bold text-[#C9A94D] mb-6">My Payments</h1>

            <div className="bg-[#2D3546] border border-[#C9A94D] rounded-[20px] p-6">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold text-[#C9A94D]">Payment History</h2>
                    <div className="text-white">
                        Total Earnings: <span className="text-[#C9A94D] font-bold">${meta?.totalAmount || 0}</span>
                    </div>
                </div>

                {/* Pagination Info */}
                <div className="flex justify-between items-center mb-4">
                    <div className="text-white text-sm">
                        Showing {payments.length} of {meta?.total || 0} payments
                    </div>
                    <div className="text-white text-sm">
                        Page {page} of {totalPages}
                    </div>
                </div>

                {isLoading ? (
                    <div className="text-center py-8 text-[#C9A94D]">Loading payments...</div>
                ) : error ? (
                    <div className="text-center py-8 text-red-500">Error loading payments</div>
                ) : payments.length === 0 ? (
                    <div className="text-center py-8 text-[#C9A94D]">No payments found</div>
                ) : (
                    <>
                        <div className="space-y-4">
                            {payments.map((payment: any) => (
                                <div key={payment._id} className="p-4 rounded-[12px] border border-[#C9A94D] bg-[#1a2235]">
                                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center border-b border-[#434D64] mb-3 pb-3">
                                        <div>
                                            <p className="font-bold text-white">Property</p>
                                            <p className="text-[#C9A94D]">{payment.propertyId?.title || "N/A"}</p>
                                        </div>
                                        <div>
                                            <p className="font-bold text-white">Guest</p>
                                            <p className="text-[#C9A94D]">{payment.userId?.name || "N/A"}</p>
                                        </div>
                                        <div>
                                            <p className="font-bold text-white">Host Amount</p>
                                            <p className="text-green-500 font-semibold">+${payment.hostAmount}</p>
                                        </div>
                                        <div>
                                            <p className="font-bold text-white">Date</p>
                                            <p className="text-[#C9A94D]">{formatDate(payment.createdAt)}</p>
                                        </div>
                                        <div>
                                            <p className="font-bold text-white">Status</p>
                                            {getStatusBadge(payment.status)}
                                        </div>
                                    </div>

                                    {/* Payment Details */}
                                    {/* <div className="mt-3 pt-3 border-t border-[#434D64]">
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                            <div>
                                                <span className="text-gray-400">Total Amount:</span>
                                                <p className="text-white">${payment.totalAmount}</p>
                                            </div>
                                            <div>
                                                <span className="text-gray-400">Commission:</span>
                                                <p className="text-red-400">-${payment.commissionAmount}</p>
                                            </div>
                                            <div>
                                                <span className="text-gray-400">Booking Fee:</span>
                                                <p className="text-yellow-400">${payment.bookingFee}</p>
                                            </div>
                                            <div>
                                                <span className="text-gray-400">Extra Fee:</span>
                                                <p className="text-blue-400">${payment.extraFee || 0}</p>
                                            </div>
                                        </div>
                                    </div> */}

                                    {/* Check-in/Check-out Dates */}
                                    {payment.messageId?.checkInDate && (
                                        <div className="mt-2 text-sm">
                                            <span className="text-gray-400">Stay: </span>
                                            <span className="text-white">
                                                {formatDate(payment.messageId.checkInDate)} - {formatDate(payment.messageId.checkOutDate)}
                                            </span>
                                        </div>
                                    )}

                                    {/* Payment ID */}
                                    <div className="mt-2 text-xs">
                                        <span className="text-gray-400">Payment ID: </span>
                                        <span className="text-gray-300">{payment.stripePaymentIntentId}</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination Controls */}
                        {totalPages > 1 && (
                            <div className="flex justify-between items-center mt-6 pt-4 border-t border-[#C9A94D]">
                                <button onClick={handlePreviousPage} disabled={page === 1} className="px-4 py-2 bg-[#434D64] text-white rounded-lg hover:bg-[#535a6b] disabled:opacity-50 disabled:cursor-not-allowed transition">
                                    Previous
                                </button>

                                <div className="text-white text-sm">
                                    Page {page} of {totalPages}
                                </div>

                                <button onClick={handleNextPage} disabled={page >= totalPages} className="px-4 py-2 bg-[#434D64] text-white rounded-lg hover:bg-[#535a6b] disabled:opacity-50 disabled:cursor-not-allowed transition">
                                    Next
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default HostTransectionView;

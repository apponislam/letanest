// "use client";
// import { useGetHostPaymentsQuery, useGetHostSingleInvoicePDFMutation, useDownloadHostPaymentsPDFMutation } from "@/redux/features/propertyPayment/propertyPaymentApi";
// import React, { useState } from "react";
// import { format } from "date-fns";
// import { Calendar as CalendarIcon, Download } from "lucide-react";
// import { Calendar } from "@/components/ui/calendar";
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
// import { Button } from "@/components/ui/button";
// import { cn } from "@/lib/utils";
// import StripeAccountManager from "../payments/StripeAccountManager";

// const HostTransectionView = () => {
//     const [page, setPage] = useState(1);
//     const [fromDate, setFromDate] = useState<Date>();
//     const [toDate, setToDate] = useState<Date>();
//     const limit = 10;

//     const {
//         data: paymentsData,
//         isLoading,
//         error,
//     } = useGetHostPaymentsQuery({
//         page,
//         limit,
//     });

//     const payments = paymentsData?.data || [];
//     const meta = paymentsData?.meta;
//     const totalPages = meta?.total ? Math.ceil(meta.total / limit) : 0;

//     const [getHostSingleInvoicePDF, { isLoading: generateLoading }] = useGetHostSingleInvoicePDFMutation();
//     const [downloadHostPaymentsPDF, { isLoading: downloadLoading }] = useDownloadHostPaymentsPDFMutation();

//     // const { data: dashboardData, isLoading: StripeDashLoading } = useGetStripeDashboardQuery();

//     // const handleStripeDashboard = () => {
//     //     if (dashboardData?.data?.dashboardUrl) {
//     //         window.open(dashboardData.data.dashboardUrl, "_blank");
//     //     } else if (error) {
//     //         console.error("Failed to load Stripe dashboard:", error);
//     //     }
//     // };

//     const handleDownloadInvoice = async (paymentId: string) => {
//         try {
//             await getHostSingleInvoicePDF(paymentId).unwrap();
//         } catch (error) {
//             console.error("Download failed:", error);
//             alert("Failed to download invoice. Please try again.");
//         }
//     };

//     const handleDownloadReport = async () => {
//         if (!fromDate || !toDate) {
//             alert("Please select both from and to dates");
//             return;
//         }

//         try {
//             await downloadHostPaymentsPDF({
//                 fromDate: format(fromDate, "yyyy-MM-dd"),
//                 toDate: format(toDate, "yyyy-MM-dd"),
//             }).unwrap();
//         } catch (error) {
//             console.error("Download failed:", error);
//             alert("Failed to download PDF report. Please try again.");
//         }
//     };

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

//     const handlePreviousPage = () => {
//         if (page > 1) {
//             setPage(page - 1);
//         }
//     };

//     const handleNextPage = () => {
//         if (page < totalPages) {
//             setPage(page + 1);
//         }
//     };

//     return (
//         <div className="container mx-auto md:p-6">
//             <div className="flex items-center justify-between mb-6">
//                 <h1 className="text-3xl font-bold text-[#C9A94D]">My Payments</h1>
//                 {/* <button onClick={handleStripeDashboard} disabled={StripeDashLoading} className="bg-[#C9A94D] py-2 px-6 text-white rounded-sm disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed">
//                     {StripeDashLoading ? "Opening..." : "View Payment Dashboard"}
//                 </button> */}
//                 <StripeAccountManager></StripeAccountManager>
//             </div>

//             <div className="bg-[#2D3546] border border-[#C9A94D] rounded-[20px] p-6">
//                 {/* Header */}
//                 <div className="flex justify-between items-center mb-6">
//                     <h2 className="text-2xl font-semibold text-[#C9A94D]">Payment History</h2>
//                     <div className="text-white">
//                         Total Earnings: <span className="text-[#C9A94D] font-bold">${meta?.totalAmount || 0}</span>
//                     </div>
//                 </div>

//                 {/* Pagination Info */}
//                 <div className="flex justify-between items-center mb-4">
//                     <div className="text-white text-sm">
//                         Showing {payments.length} of {meta?.total || 0} payments
//                     </div>
//                     <div className="text-white text-sm">
//                         Page {page} of {totalPages}
//                     </div>
//                 </div>

//                 {isLoading ? (
//                     <div className="text-center py-8 text-[#C9A94D]">Loading payments...</div>
//                 ) : error ? (
//                     <div className="text-center py-8 text-red-500">Error loading payments</div>
//                 ) : payments.length === 0 ? (
//                     <div className="text-center py-8 text-[#C9A94D]">No payments found</div>
//                 ) : (
//                     <>
//                         <div className="space-y-4">
//                             {payments.map((payment: any) => (
//                                 <div key={payment._id} className="p-4 rounded-[12px] border border-[#C9A94D] bg-[#1a2235]">
//                                     <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center border-b border-[#434D64] mb-3 pb-3">
//                                         <div>
//                                             <p className="font-bold text-white">Property</p>
//                                             <p className="text-[#C9A94D]">{payment.propertyId?.title || "N/A"}</p>
//                                         </div>
//                                         <div>
//                                             <p className="font-bold text-white">Guest</p>
//                                             <p className="text-[#C9A94D]">{payment.userId?.name || "N/A"}</p>
//                                         </div>
//                                         <div>
//                                             <p className="font-bold text-white">Host Amount</p>
//                                             <p className="text-green-500 font-semibold">+${payment.hostAmount}</p>
//                                         </div>
//                                         <div>
//                                             <p className="font-bold text-white">Date</p>
//                                             <p className="text-[#C9A94D]">{formatDate(payment.createdAt)}</p>
//                                         </div>
//                                         <div>
//                                             <p className="font-bold text-white">Status</p>
//                                             {getStatusBadge(payment.status)}
//                                         </div>
//                                     </div>

//                                     {/* Check-in/Check-out Dates */}
//                                     <div className="flex items-center gap-4 justify-between flex-col md:flex-row">
//                                         <div>
//                                             {payment.messageId?.checkInDate && (
//                                                 <div className="mt-2 text-sm">
//                                                     <span className="text-gray-400">Stay: </span>
//                                                     <span className="text-white">
//                                                         {formatDate(payment.messageId.checkInDate)} - {formatDate(payment.messageId.checkOutDate)}
//                                                     </span>
//                                                 </div>
//                                             )}
//                                             {/* Payment ID */}
//                                             <div className="mt-2 text-xs">
//                                                 <span className="text-gray-400">Payment ID: </span>
//                                                 <span className="text-gray-300">{payment.stripePaymentIntentId}</span>
//                                             </div>
//                                         </div>
//                                         <div>
//                                             <button className="bg-[#C9A94D] text-white px-3 py-2 rounded hover:bg-[#b8973e] disabled:opacity-50 disabled:cursor-not-allowed transition text-sm" onClick={() => handleDownloadInvoice(payment._id)} disabled={generateLoading}>
//                                                 {generateLoading ? "Downloading..." : "Download Invoice"}
//                                             </button>
//                                         </div>
//                                     </div>
//                                 </div>
//                             ))}
//                         </div>

//                         {/* Date Range Picker - Middle above pagination controls */}
//                         <div className="flex flex-col md:flex-row justify-end items-center  mt-4 gap-4">
//                             <div className="flex items-center gap-3">
//                                 {/* From Date Popover */}
//                                 <Popover>
//                                     <PopoverTrigger asChild>
//                                         <Button variant="outline" className={cn("justify-start text-left font-normal bg-[#434D64] border-[#C9A94D] text-white hover:text-[#C9A94D] hover:bg-[#434D64] text-sm", !fromDate && "text-muted-foreground")}>
//                                             <CalendarIcon className="mr-2 h-4 w-4 text-[#C9A94D]" />
//                                             {fromDate ? format(fromDate, "PPP") : "From date"}
//                                         </Button>
//                                     </PopoverTrigger>
//                                     <PopoverContent className="w-auto p-0 bg-[#2D3546] border-[#C9A94D]">
//                                         <Calendar mode="single" selected={fromDate} onSelect={setFromDate} initialFocus className="bg-[#2D3546] text-white" />
//                                     </PopoverContent>
//                                 </Popover>

//                                 {/* To Date Popover */}
//                                 <Popover>
//                                     <PopoverTrigger asChild>
//                                         <Button variant="outline" className={cn("justify-start text-left font-normal bg-[#434D64] border-[#C9A94D] text-white hover:text-[#C9A94D] hover:bg-[#434D64] text-sm", !toDate && "text-muted-foreground")}>
//                                             <CalendarIcon className="mr-2 h-4 w-4 text-[#C9A94D]" />
//                                             {toDate ? format(toDate, "PPP") : "To date"}
//                                         </Button>
//                                     </PopoverTrigger>
//                                     <PopoverContent className="w-auto p-0 bg-[#2D3546] border-[#C9A94D]">
//                                         <Calendar mode="single" selected={toDate} onSelect={setToDate} initialFocus className="bg-[#2D3546] text-white" />
//                                     </PopoverContent>
//                                 </Popover>

//                                 {/* Download Report Button */}
//                                 <Button onClick={handleDownloadReport} disabled={!fromDate || !toDate || downloadLoading} className="bg-[#C9A94D] text-white hover:bg-[#b8973e] disabled:opacity-50 disabled:cursor-not-allowed text-sm">
//                                     <Download className="w-4 h-4 mr-2" />
//                                     {downloadLoading ? "Downloading..." : "Download Report"}
//                                 </Button>
//                             </div>
//                         </div>

//                         {/* Pagination Controls */}
//                         {totalPages > 1 && (
//                             <div className="flex justify-between items-center mt-4">
//                                 <button onClick={handlePreviousPage} disabled={page === 1} className="px-4 py-2 bg-[#434D64] text-white rounded-lg hover:bg-[#535a6b] disabled:opacity-50 disabled:cursor-not-allowed transition">
//                                     Previous
//                                 </button>

//                                 <div className="text-white text-sm">
//                                     Page {page} of {totalPages}
//                                 </div>

//                                 <button onClick={handleNextPage} disabled={page >= totalPages} className="px-4 py-2 bg-[#434D64] text-white rounded-lg hover:bg-[#535a6b] disabled:opacity-50 disabled:cursor-not-allowed transition">
//                                     Next
//                                 </button>
//                             </div>
//                         )}
//                     </>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default HostTransectionView;

"use client";
import { useGetHostPaymentsQuery, useGetHostSingleInvoicePDFMutation, useDownloadHostPaymentsPDFMutation } from "@/redux/features/propertyPayment/propertyPaymentApi";
import React, { useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Download, Search } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import StripeAccountManager from "../payments/StripeAccountManager";

const HostTransectionView = () => {
    const [page, setPage] = useState(1);
    const [fromDate, setFromDate] = useState<Date>();
    const [toDate, setToDate] = useState<Date>();
    const [searchTerm, setSearchTerm] = useState("");
    const limit = 10;

    const {
        data: paymentsData,
        isLoading,
        error,
    } = useGetHostPaymentsQuery({
        page,
        limit,
        search: searchTerm || undefined,
    });

    const payments = paymentsData?.data || [];
    const meta = paymentsData?.meta;
    const totalPages = meta?.total ? Math.ceil(meta.total / limit) : 0;

    const [getHostSingleInvoicePDF, { isLoading: generateLoading }] = useGetHostSingleInvoicePDFMutation();
    const [downloadHostPaymentsPDF, { isLoading: downloadLoading }] = useDownloadHostPaymentsPDFMutation();

    const handleDownloadInvoice = async (paymentId: string) => {
        try {
            await getHostSingleInvoicePDF(paymentId).unwrap();
        } catch (error) {
            console.error("Download failed:", error);
            alert("Failed to download invoice. Please try again.");
        }
    };

    const handleDownloadReport = async () => {
        if (!fromDate || !toDate) {
            alert("Please select both from and to dates");
            return;
        }

        try {
            await downloadHostPaymentsPDF({
                fromDate: format(fromDate, "yyyy-MM-dd"),
                toDate: format(toDate, "yyyy-MM-dd"),
            }).unwrap();
        } catch (error) {
            console.error("Download failed:", error);
            alert("Failed to download PDF report. Please try again.");
        }
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        setPage(1); // Reset to first page when searching
    };

    const clearSearch = () => {
        setSearchTerm("");
        setPage(1);
    };

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
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold text-[#C9A94D]">My Payments</h1>
                <StripeAccountManager></StripeAccountManager>
            </div>

            <div className="bg-[#2D3546] border border-[#C9A94D] rounded-[20px] p-6">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold text-[#C9A94D]">Payment History</h2>
                    <div className="text-white">
                        Total Earnings: <span className="text-[#C9A94D] font-bold">${meta?.totalAmount || 0}</span>
                    </div>
                </div>

                {/* Search Results Info */}
                {searchTerm && (
                    <div className="mb-4 text-sm text-gray-300 flex items-center gap-2">
                        <span>
                            Showing {meta?.total || 0} results for "{searchTerm}"
                        </span>
                        <button onClick={clearSearch} className="text-[#C9A94D] hover:underline text-xs">
                            Clear search
                        </button>
                    </div>
                )}

                {/* Pagination Info */}
                <div className="flex justify-between items-center mb-4">
                    <div className="text-white text-sm">
                        Showing {payments.length} of {meta?.total || 0} payments
                    </div>
                    <div className="text-white text-sm">
                        Page {page} of {totalPages}
                    </div>
                </div>

                {/* Search Bar - Added here */}
                <div className="mb-4">
                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#C9A94D]" />
                        <Input type="text" placeholder="Search by Payment ID, Guest, or Property..." value={searchTerm} onChange={handleSearch} className="pl-10 pr-10 bg-transparent border-[#C9A94D] text-white placeholder:text-gray-300 focus:ring-[#C9A94D] focus:border-[#C9A94D]" />
                        {searchTerm && (
                            <button onClick={clearSearch} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white">
                                ×
                            </button>
                        )}
                    </div>
                </div>

                {isLoading ? (
                    <div className="text-center py-8 text-[#C9A94D]">Loading payments...</div>
                ) : error ? (
                    <div className="text-center py-8 text-red-500">Error loading payments</div>
                ) : payments.length === 0 ? (
                    <div className="text-center py-8 text-[#C9A94D]">{searchTerm ? "No payments found matching your search" : "No payments found"}</div>
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

                                    {/* Check-in/Check-out Dates */}
                                    <div className="flex items-center gap-4 justify-between flex-col md:flex-row">
                                        <div>
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
                                        <div>
                                            <button className="bg-[#C9A94D] text-white px-3 py-2 rounded hover:bg-[#b8973e] disabled:opacity-50 disabled:cursor-not-allowed transition text-sm" onClick={() => handleDownloadInvoice(payment._id)} disabled={generateLoading}>
                                                {generateLoading ? "Downloading..." : "Download Invoice"}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Date Range Picker - Middle above pagination controls */}
                        <div className="flex flex-col md:flex-row justify-end items-center  mt-4 gap-4">
                            <div className="flex items-center gap-3">
                                {/* From Date Popover */}
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant="outline" className={cn("justify-start text-left font-normal bg-[#434D64] border-[#C9A94D] text-white hover:text-[#C9A94D] hover:bg-[#434D64] text-sm", !fromDate && "text-muted-foreground")}>
                                            <CalendarIcon className="mr-2 h-4 w-4 text-[#C9A94D]" />
                                            {fromDate ? format(fromDate, "PPP") : "From date"}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0 bg-[#2D3546] border-[#C9A94D]">
                                        <Calendar mode="single" selected={fromDate} onSelect={setFromDate} initialFocus className="bg-[#2D3546] text-white" />
                                    </PopoverContent>
                                </Popover>

                                {/* To Date Popover */}
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant="outline" className={cn("justify-start text-left font-normal bg-[#434D64] border-[#C9A94D] text-white hover:text-[#C9A94D] hover:bg-[#434D64] text-sm", !toDate && "text-muted-foreground")}>
                                            <CalendarIcon className="mr-2 h-4 w-4 text-[#C9A94D]" />
                                            {toDate ? format(toDate, "PPP") : "To date"}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0 bg-[#2D3546] border-[#C9A94D]">
                                        <Calendar mode="single" selected={toDate} onSelect={setToDate} initialFocus className="bg-[#2D3546] text-white" />
                                    </PopoverContent>
                                </Popover>

                                {/* Download Report Button */}
                                <Button onClick={handleDownloadReport} disabled={!fromDate || !toDate || downloadLoading} className="bg-[#C9A94D] text-white hover:bg-[#b8973e] disabled:opacity-50 disabled:cursor-not-allowed text-sm">
                                    <Download className="w-4 h-4 mr-2" />
                                    {downloadLoading ? "Downloading..." : "Download Report"}
                                </Button>
                            </div>
                        </div>

                        {/* Pagination Controls */}
                        {totalPages > 1 && (
                            <div className="flex justify-between items-center mt-4">
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

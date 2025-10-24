"use client";
import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { useDownloadPaymentsPDFMutation, useGetAllPaymentsQuery, useGetPaymentTotalsQuery } from "@/redux/features/propertyPayment/propertyPaymentApi";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Download } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

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

    const [fromDate, setFromDate] = useState<Date>();
    const [toDate, setToDate] = useState<Date>();

    const [downloadPaymentsPDF, { isLoading: isDownloading }] = useDownloadPaymentsPDFMutation();

    const handleDownload = async () => {
        if (!fromDate || !toDate) {
            alert("Please select both from and to dates");
            return;
        }

        try {
            await downloadPaymentsPDF({
                fromDate: format(fromDate, "yyyy-MM-dd"),
                toDate: format(toDate, "yyyy-MM-dd"),
            }).unwrap();
        } catch (error) {
            console.error("Download failed:", error);
            alert("Failed to download PDF. Please try again.");
        }
    };

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
                <h1 className="text-2xl font-bold mb-4 text-white">Property Payments</h1>
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
                                                    const el = e.currentTarget; // ✅ store reference
                                                    const originalText = el.textContent;
                                                    navigator.clipboard.writeText(tx.stripePaymentIntentId);
                                                    el.textContent = "Copied!";
                                                    setTimeout(() => {
                                                        if (el && document.body.contains(el)) {
                                                            el.textContent = originalText;
                                                        }
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

                {/* All 3 items in one line */}
                <div className="flex items-center gap-3 justify-end mt-4">
                    {/* From Date Popover */}
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline" className={cn(" justify-start text-left font-normal bg-[#434D64] border-[#C9A94D] text-white hover:text-[#C9A94D] hover:bg-[#434D64]", !fromDate && "text-muted-foreground")}>
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
                            <Button variant="outline" className={cn(" justify-start text-left font-normal bg-[#434D64] border-[#C9A94D] text-white hover:text-[#C9A94D] hover:bg-[#434D64]", !toDate && "text-muted-foreground")}>
                                <CalendarIcon className="mr-2 h-4 w-4 text-[#C9A94D]" />
                                {toDate ? format(toDate, "PPP") : "To date"}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 bg-[#2D3546] border-[#C9A94D]">
                            <Calendar mode="single" selected={toDate} onSelect={setToDate} initialFocus className="bg-[#2D3546] text-white" />
                        </PopoverContent>
                    </Popover>

                    {/* Download Button */}
                    <Button onClick={handleDownload} disabled={!fromDate || !toDate || isDownloading} className="bg-[#C9A94D] text-white hover:bg-[#b8973e] disabled:opacity-50 disabled:cursor-not-allowed">
                        {isDownloading ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Downloading...
                            </>
                        ) : (
                            <>
                                <Download className="w-4 h-4 mr-2" />
                                Download
                            </>
                        )}
                    </Button>
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

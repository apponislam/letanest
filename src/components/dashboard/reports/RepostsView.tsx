"use client";
import React, { useState } from "react";
import Image from "next/image";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { EllipsisVertical } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import PageHeader from "@/components/PageHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGetAllReportsQuery, useUpdateReportStatusMutation, useGetReportStatsQuery, IReport } from "@/redux/features/reports/reportApi";
import { toast } from "sonner";

const ReportsView = () => {
    const [activeTab, setActiveTab] = useState<"pending" | "resolved">("pending");
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(10);
    const [openRow, setOpenRow] = useState<string | null>(null);

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

    // Use the Redux query hooks
    const {
        data: reportsData,
        isLoading,
        error,
        refetch,
    } = useGetAllReportsQuery({
        page: currentPage,
        limit: pageSize,
        status: activeTab,
    });

    const { data: statsData } = useGetReportStatsQuery();
    console.log(statsData);

    const [updateReportStatus] = useUpdateReportStatusMutation();

    const reports = reportsData?.data || [];
    const meta = reportsData?.meta;
    const totalPages = meta ? Math.ceil(meta.total / pageSize) : 0;

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        });
    };

    const getInitials = (name: string) => {
        return (
            name
                ?.split(" ")
                .map((part) => part[0])
                .join("")
                .toUpperCase()
                .slice(0, 2) || "U"
        );
    };

    const getProfileImageUrl = (profileImg?: string) => {
        if (!profileImg) return null;
        if (profileImg.startsWith("http")) return profileImg;
        return `${backendUrl}${profileImg}`;
    };

    const handleStatusUpdate = async (reportId: string, newStatus: "pending" | "resolved") => {
        try {
            await updateReportStatus({ reportId, status: newStatus }).unwrap();
            toast.success(`Report ${newStatus === "resolved" ? "resolved" : "reopened"} successfully`);
            refetch();
        } catch (error) {
            toast.error("Failed to update report status");
        }
    };

    const handleTabChange = (value: string) => {
        setActiveTab(value as "pending" | "resolved");
        setCurrentPage(1);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    if (error) {
        return (
            <div className="container mx-auto">
                <PageHeader title="Reports Management" />
                <div className="text-center py-8 text-red-500">Error loading reports. Please try again.</div>
            </div>
        );
    }

    return (
        <div className="container mx-auto">
            <PageHeader title="Reports Management" />

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {/* Total Reports Card */}
                <div className="bg-[#2D3546] border border-[#C9A94D] rounded-[15px] p-6 text-center">
                    <div className="text-3xl font-bold text-white mb-2">{statsData?.data?.total || 0}</div>
                    <div className="text-[#C9A94D] font-semibold">Total Reports</div>
                </div>

                {/* Pending Reports Card */}
                <div className="bg-[#2D3546] border border-[#C9A94D] rounded-[15px] p-6 text-center">
                    <div className="text-3xl font-bold text-yellow-500 mb-2">{statsData?.data?.pending || 0}</div>
                    <div className="text-[#C9A94D] font-semibold">Pending</div>
                </div>

                {/* Resolved Reports Card */}
                <div className="bg-[#2D3546] border border-[#C9A94D] rounded-[15px] p-6 text-center">
                    <div className="text-3xl font-bold text-green-500 mb-2">{statsData?.data?.resolved || 0}</div>
                    <div className="text-[#C9A94D] font-semibold">Resolved</div>
                </div>
            </div>

            <div className="w-full">
                <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
                    {/* Tab Triggers */}
                    <TabsList className="flex h-auto overflow-hidden bg-transparent gap-3 mb-5 md:mb-6 w-full flex-col md:flex-row">
                        <TabsTrigger value="pending" className="p-3 h-auto rounded-[10px] w-full md:w-1/2 text-white data-[state=active]:bg-[#135E9A] data-[state=active]:border-[#C9A94D] data-[state=active]:text-white bg-[#434D64] border border-[#C9A94D]">
                            Pending Reports
                        </TabsTrigger>
                        <TabsTrigger value="resolved" className="p-3 h-auto rounded-[10px] w-full md:w-1/2 text-white data-[state=active]:bg-[#135E9A] data-[state=active]:border-[#C9A94D] data-[state=active]:text-white bg-[#434D64] border border-[#C9A94D]">
                            Resolved Reports
                        </TabsTrigger>
                    </TabsList>

                    {/* Tabs Content */}
                    <TabsContent value="pending">
                        <ReportContent reports={reports} isLoading={isLoading} activeTab={activeTab} openRow={openRow} setOpenRow={setOpenRow} formatDate={formatDate} getInitials={getInitials} getProfileImageUrl={getProfileImageUrl} handleStatusUpdate={handleStatusUpdate} />
                    </TabsContent>

                    <TabsContent value="resolved">
                        <ReportContent reports={reports} isLoading={isLoading} activeTab={activeTab} openRow={openRow} setOpenRow={setOpenRow} formatDate={formatDate} getInitials={getInitials} getProfileImageUrl={getProfileImageUrl} handleStatusUpdate={handleStatusUpdate} />
                    </TabsContent>
                </Tabs>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex justify-center items-center space-x-2 mt-6">
                        <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="px-4 py-2 bg-[#434D64] text-white rounded-[10px] disabled:opacity-50 disabled:cursor-not-allowed border border-[#C9A94D]">
                            Previous
                        </button>

                        <div className="flex space-x-2">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                <button key={page} onClick={() => handlePageChange(page)} className={`px-4 py-2 rounded-[10px] border border-[#C9A94D] ${currentPage === page ? "bg-[#135E9A] text-white" : "bg-[#434D64] text-white"}`}>
                                    {page}
                                </button>
                            ))}
                        </div>

                        <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="px-4 py-2 bg-[#434D64] text-white rounded-[10px] disabled:opacity-50 disabled:cursor-not-allowed border border-[#C9A94D]">
                            Next
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

// Report Content Component
const ReportContent = ({
    reports,
    isLoading,
    activeTab,
    openRow,
    setOpenRow,
    formatDate,
    getInitials,
    getProfileImageUrl,
    handleStatusUpdate,
}: {
    reports: IReport[];
    isLoading: boolean;
    activeTab: string;
    openRow: string | null;
    setOpenRow: (id: string | null) => void;
    formatDate: (date: string) => string;
    getInitials: (name: string) => string;
    getProfileImageUrl: (profileImg?: string) => string | null;
    handleStatusUpdate: (reportId: string, status: "pending" | "resolved") => void;
}) => {
    return (
        <div className="bg-[#2D3546] border border-[#C9A94D] p-4 md:p-6 text-[#C9A94D] rounded-[20px] space-y-4">
            {/* Header */}
            <div className="flex justify-between items-center">
                <span className="text-[#C9A94D] text-xl md:text-[28px]">
                    {activeTab === "pending" ? "Pending" : "Resolved"} Reports ({reports.length})
                </span>
            </div>

            {/* Report Rows */}
            <div className="space-y-4">
                {isLoading ? (
                    <div className="text-center py-8 text-[#C9A94D]">Loading reports...</div>
                ) : reports.length === 0 ? (
                    <div className="text-center py-8 text-[#C9A94D]">No {activeTab} reports found</div>
                ) : (
                    reports.map((report) => {
                        const guestProfileUrl = getProfileImageUrl(report.guestId?.profileImg);
                        const hostProfileUrl = getProfileImageUrl(report.hostId?.profileImg);

                        return (
                            <div key={report._id} className="p-4 rounded-[12px] border border-[#C9A94D] bg-[#1a2234]">
                                {/* Top Section */}
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                                    {/* User Info */}
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                                        {/* Guest */}
                                        <div className="flex items-center gap-3">
                                            <div className="relative">
                                                {guestProfileUrl ? (
                                                    <Image src={guestProfileUrl} alt={report.guestId?.name || "Guest"} width={48} height={48} className="w-12 h-12 rounded-full border-2 border-[#C9A94D] object-cover" />
                                                ) : (
                                                    <div className="w-12 h-12 rounded-full bg-[#135E9A] border-2 border-[#C9A94D] flex items-center justify-center text-white font-bold">{getInitials(report.guestId?.name)}</div>
                                                )}
                                                <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center border border-white">G</div>
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="font-bold text-white truncate">{report.guestId?.name || "N/A"}</p>
                                                <p className="text-sm text-gray-300 truncate">{report.guestId?.email || "N/A"}</p>
                                            </div>
                                        </div>

                                        <div className="hidden sm:block text-[#C9A94D] mx-2">→</div>
                                        <div className="sm:hidden text-[#C9A94D] text-center py-1">↓</div>

                                        {/* Host */}
                                        <div className="flex items-center gap-3">
                                            <div className="relative">
                                                {hostProfileUrl ? (
                                                    <Image src={hostProfileUrl} alt={report.hostId?.name || "Host"} width={48} height={48} className="w-12 h-12 rounded-full border-2 border-[#C9A94D] object-cover" />
                                                ) : (
                                                    <div className="w-12 h-12 rounded-full bg-[#C9A94D] border-2 border-[#C9A94D] flex items-center justify-center text-white font-bold">{getInitials(report.hostId?.name)}</div>
                                                )}
                                                <div className="absolute -bottom-1 -right-1 bg-yellow-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center border border-white">H</div>
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="font-bold text-white truncate">{report.hostId?.name || "N/A"}</p>
                                                <p className="text-sm text-gray-300 truncate">{report.hostId?.email || "N/A"}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Status and Date */}
                                    <div className="flex items-center gap-4">
                                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${report.status === "pending" ? "bg-yellow-500 text-white" : "bg-green-500 text-white"}`}>{report.status}</span>
                                        <span className="text-gray-300">{formatDate(report.createdAt)}</span>
                                    </div>
                                </div>

                                {/* Reason and Actions */}
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                    <div className="flex-1">
                                        <p className="font-bold text-lg text-[#C9A94D] mb-1">Reason</p>
                                        <p className="text-white line-clamp-2">{report.reason}</p>
                                        {report.message && <p className="text-gray-300 text-sm mt-1 line-clamp-2">{report.message}</p>}
                                    </div>

                                    <div className="flex items-center gap-3">
                                        {/* View Details Button */}
                                        <Dialog open={openRow === report._id} onOpenChange={(isOpen) => setOpenRow(isOpen ? report._id : null)}>
                                            <DialogTrigger asChild>
                                                <button className="bg-[#C9A94D] text-white rounded-[10px] font-bold text-sm py-2 px-4 hover:bg-[#b89742] transition-colors">View Details</button>
                                            </DialogTrigger>

                                            <DialogContent className="bg-[#14213D] border border-[#C9A94D] rounded-[15px] p-6 w-[95vw] max-w-2xl">
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

                                                <DialogHeader className="pb-4 border-b border-[#C9A94D]/30">
                                                    <DialogTitle className="text-[#C9A94D] text-xl font-bold flex items-center gap-3">
                                                        <div className={`w-2 h-2 rounded-full ${report.status === "pending" ? "bg-yellow-500" : "bg-green-500"}`}></div>
                                                        Report Details
                                                    </DialogTitle>
                                                </DialogHeader>

                                                <div className="space-y-6 py-4">
                                                    {/* People Involved - Simple Row Layout */}
                                                    <div className="space-y-3">
                                                        <h3 className="text-[#C9A94D] font-semibold text-sm uppercase tracking-wide">People Involved</h3>
                                                        <div className="flex flex-col xs:flex-row items-center gap-3">
                                                            {/* Guest */}
                                                            <div className="flex items-center gap-2 flex-1 min-w-0 w-full xs:w-auto">
                                                                <div className="relative flex-shrink-0">
                                                                    {guestProfileUrl ? (
                                                                        <Image src={guestProfileUrl} alt={report.guestId?.name || "Guest"} width={40} height={40} className="w-10 h-10 rounded-full border border-[#135E9A] object-cover" />
                                                                    ) : (
                                                                        <div className="w-10 h-10 rounded-full bg-[#135E9A] border border-[#135E9A] flex items-center justify-center text-white font-bold text-xs">{getInitials(report.guestId?.name)}</div>
                                                                    )}
                                                                    <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white text-[8px] rounded-full w-3 h-3 flex items-center justify-center border border-[#14213D]">G</div>
                                                                </div>
                                                                <div className="min-w-0 flex-1">
                                                                    <p className="text-white font-medium text-sm truncate">{report.guestId?.name || "N/A"}</p>
                                                                    <p className="text-gray-400 text-xs truncate">{report.guestId?.email || "N/A"}</p>
                                                                </div>
                                                            </div>

                                                            <div className="hidden xs:block text-[#C9A94D] text-sm flex-shrink-0 px-1">→</div>
                                                            <div className="xs:hidden text-[#C9A94D] text-sm py-1">↓</div>

                                                            {/* Host */}
                                                            <div className="flex items-center gap-2 flex-1 min-w-0 w-full xs:w-auto">
                                                                <div className="relative flex-shrink-0">
                                                                    {hostProfileUrl ? (
                                                                        <Image src={hostProfileUrl} alt={report.hostId?.name || "Host"} width={40} height={40} className="w-10 h-10 rounded-full border border-[#C9A94D] object-cover" />
                                                                    ) : (
                                                                        <div className="w-10 h-10 rounded-full bg-[#C9A94D] border border-[#C9A94D] flex items-center justify-center text-white font-bold text-xs">{getInitials(report.hostId?.name)}</div>
                                                                    )}
                                                                    <div className="absolute -bottom-1 -right-1 bg-yellow-500 text-white text-[8px] rounded-full w-3 h-3 flex items-center justify-center border border-[#14213D]">H</div>
                                                                </div>
                                                                <div className="min-w-0 flex-1">
                                                                    <p className="text-white font-medium text-sm truncate">{report.hostId?.name || "N/A"}</p>
                                                                    <p className="text-gray-400 text-xs truncate">{report.hostId?.email || "N/A"}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Report Content */}
                                                    <div className="space-y-4">
                                                        {/* Status and Date */}
                                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                                            <div className="flex items-center gap-3">
                                                                <span className="text-[#C9A94D] font-semibold text-sm">Status:</span>
                                                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${report.status === "pending" ? "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30" : "bg-green-500/20 text-green-300 border border-green-500/30"}`}>{report.status.charAt(0).toUpperCase() + report.status.slice(1)}</span>
                                                            </div>
                                                            <div className="text-gray-400 text-sm">Reported on {formatDate(report.createdAt)}</div>
                                                        </div>

                                                        {/* Reason */}
                                                        <div>
                                                            <h4 className="text-[#C9A94D] font-semibold text-sm mb-2">Report Reason</h4>
                                                            <p className="text-white text-sm leading-relaxed bg-[#1a2234] p-3 rounded-lg border border-[#2D3546] w-full">{report.reason}</p>
                                                        </div>

                                                        {/* Message */}
                                                        {report.message && (
                                                            <div>
                                                                <h4 className="text-[#C9A94D] font-semibold text-sm mb-2">Additional Details</h4>
                                                                <p className="text-white text-sm leading-relaxed bg-[#1a2234] p-3 rounded-lg border border-[#2D3546] whitespace-pre-wrap w-full">{report.message}</p>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Action Button */}
                                                    <div className="pt-4 border-t border-[#C9A94D]/30">
                                                        {report.status === "pending" ? (
                                                            <button onClick={() => handleStatusUpdate(report._id, "resolved")} className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 px-4 rounded-[10px] transition-colors">
                                                                Mark as Resolved
                                                            </button>
                                                        ) : (
                                                            <button onClick={() => handleStatusUpdate(report._id, "pending")} className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-2.5 px-4 rounded-[10px] transition-colors">
                                                                Reopen Report
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </DialogContent>
                                        </Dialog>

                                        {/* Dropdown Menu */}
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <button className="p-2 rounded-full bg-[#434D64] w-9 h-9 hover:bg-[#535D74] transition-colors">
                                                    <EllipsisVertical className="w-5 h-5 text-white" />
                                                </button>
                                            </DropdownMenuTrigger>

                                            <DropdownMenuContent className="bg-[#14213D] text-white rounded-[10px] w-48 flex flex-col gap-3 p-4 border border-[#C9A94D]">
                                                {report.status === "pending" ? (
                                                    <DropdownMenuItem className="bg-[#C9A94D] text-white hover:bg-[#b89742] focus:bg-[#b89742] justify-center focus:text-white rounded-[10px] cursor-pointer py-2" onClick={() => handleStatusUpdate(report._id, "resolved")}>
                                                        <span className="w-full text-center font-semibold">Mark as Resolved</span>
                                                    </DropdownMenuItem>
                                                ) : (
                                                    <DropdownMenuItem className="bg-[#135E9A] text-white hover:bg-[#0f4a7a] focus:bg-[#0f4a7a] justify-center focus:text-white rounded-[10px] cursor-pointer py-2" onClick={() => handleStatusUpdate(report._id, "pending")}>
                                                        <span className="w-full text-center font-semibold">Reopen Report</span>
                                                    </DropdownMenuItem>
                                                )}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default ReportsView;

"use client";
import React, { useState } from "react";
import { Search, Mail, Calendar, MessageSquare, Eye, Download, Send, Phone } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import PageHeader from "@/components/PageHeader";
import { useGetContactsQuery, useUpdateContactStatusMutation, useDownloadContactsExcelMutation, useReplyToContactMutation } from "@/redux/features/contact/contactApi";
import { toast } from "sonner";

const ContactsManagement = () => {
    const [activeTab, setActiveTab] = useState("pending");
    const [filters, setFilters] = useState({
        page: 1,
        limit: 10,
        search: "",
        status: "",
    });
    const [selectedContact, setSelectedContact] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [replyMessage, setReplyMessage] = useState("");

    // Download states
    const [downloadYear, setDownloadYear] = useState<string>("");
    const [downloadMonth, setDownloadMonth] = useState<string>("");

    const {
        data: contactsData,
        isLoading,
        refetch,
    } = useGetContactsQuery({
        ...filters,
        status: activeTab === "all" ? "" : activeTab,
    });

    const [updateStatus] = useUpdateContactStatusMutation();
    const [downloadContactsExcel, { isLoading: isDownloading }] = useDownloadContactsExcelMutation();
    const [replyToContact, { isLoading: isReplying }] = useReplyToContactMutation();

    const contacts = contactsData?.contacts || [];
    const meta = contactsData?.meta;

    // Generate years for dropdown (current year - 10 years to current year + 1)
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 12 }, (_, i) => currentYear - 10 + i);

    // Handle Excel download with proper error handling for blob responses
    const handleDownloadExcel = async () => {
        if (!downloadYear) {
            toast.error("Please select a year");
            return;
        }

        try {
            const downloadParams = {
                year: downloadYear,
                ...(downloadMonth && downloadMonth !== "all" && { month: downloadMonth }),
                status: activeTab, // Use current tab status
            };

            await downloadContactsExcel(downloadParams).unwrap();
            toast.success("Excel file downloaded successfully");
        } catch (error: any) {
            console.error("Download error:", error);

            // Handle blob error responses - extract the actual error message
            if (error?.data instanceof Blob) {
                try {
                    const errorText = await error.data.text();
                    console.log("Error blob content:", errorText);

                    let errorMessage = "Download failed";
                    try {
                        const errorJson = JSON.parse(errorText);
                        errorMessage = errorJson.message || errorJson.error || "Download failed";
                    } catch {
                        // If it's not JSON, use the text as is
                        errorMessage = errorText || "Download failed";
                    }

                    toast.error(errorMessage);
                } catch (blobError) {
                    console.error("Error reading blob:", blobError);
                    toast.error("Download failed - unable to read error message");
                }
            } else if (error?.status === 400) {
                toast.error("Invalid parameters - please check year and month values");
            } else if (error?.status === 404) {
                toast.error("No contacts found for the selected period");
            } else {
                toast.error(error?.message || "Failed to download Excel file");
            }
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "pending":
                return "bg-yellow-600";
            case "read":
                return "bg-blue-600";
            case "replied":
                return "bg-green-600";
            default:
                return "bg-gray-600";
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    // Pagination handlers
    const handleNextPage = () => {
        if (meta && filters.page < Math.ceil(meta.total / meta.limit)) {
            setFilters((prev) => ({ ...prev, page: prev.page + 1 }));
        }
    };

    const handlePrevPage = () => {
        if (filters.page > 1) {
            setFilters((prev) => ({ ...prev, page: prev.page - 1 }));
        }
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFilters((prev) => ({ ...prev, search: e.target.value, page: 1 }));
    };

    const clearFilters = () => {
        setFilters({ page: 1, limit: 10, search: "", status: "" });
    };

    const handleStatusUpdate = async (contactId: string, newStatus: string) => {
        try {
            await updateStatus({ contactId, status: newStatus }).unwrap();
            toast.success("Status updated successfully");
            refetch();
            setIsModalOpen(false);
        } catch (error) {
            toast.error("Failed to update status");
        }
    };

    const handleReplySubmit = async () => {
        if (!replyMessage.trim()) {
            toast.error("Please enter a reply message");
            return;
        }

        try {
            await replyToContact({
                contactId: selectedContact._id,
                replyMessage: replyMessage.trim(),
            }).unwrap();

            toast.success("Reply sent successfully");
            setReplyMessage("");
            setIsModalOpen(false);
            refetch();
        } catch (error) {
            toast.error("Failed to send reply");
        }
    };

    const handleTabChange = (value: string) => {
        setActiveTab(value);
        setFilters({ page: 1, limit: 10, search: "", status: "" });
    };

    const handleEmailClick = (email: string) => {
        window.open(`mailto:${email}`, "_blank");
    };

    const handleViewDetails = (contact: any) => {
        setSelectedContact(contact);
        setReplyMessage(""); // Clear previous reply message
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedContact(null);
        setReplyMessage("");
    };

    const handlePhoneClick = (phoneNumber: string) => {
        // Remove spaces and special characters for tel: link
        const cleanPhone = phoneNumber.replace(/[^\d+]/g, "");
        window.location.href = `tel:${cleanPhone}`;
    };

    return (
        <div className="container mx-auto">
            <PageHeader title={"Contacts Management"}></PageHeader>

            <div className="w-full">
                <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
                    {/* Tab Triggers */}
                    <TabsList className="flex h-auto overflow-hidden bg-transparent gap-3 mb-5 md:mb-6 w-full flex-col md:flex-row">
                        <TabsTrigger value="pending" className="p-3 h-auto rounded-[10px] w-full md:w-1/3 text-white data-[state=active]:bg-[#135E9A] data-[state=active]:border-[#C9A94D] data-[state=active]:text-white bg-[#434D64] border-r border-[#C9A94D]">
                            Pending
                        </TabsTrigger>
                        <TabsTrigger value="read" className="p-3 h-auto rounded-[10px] w-full md:w-1/3 text-white data-[state=active]:bg-[#135E9A] data-[state=active]:border-[#C9A94D] data-[state=active]:text-white bg-[#434D64] border-r border-[#C9A94D]">
                            Read
                        </TabsTrigger>
                        <TabsTrigger value="replied" className="p-3 h-auto rounded-[10px] w-full md:w-1/3 text-white data-[state=active]:bg-[#135E9A] data-[state=active]:border-[#C9A94D] data-[state=active]:text-white bg-[#434D64]">
                            Replied
                        </TabsTrigger>
                    </TabsList>

                    {/* All Tabs Content */}
                    <TabsContent value="pending">
                        <ContactTable
                            contacts={contacts}
                            isLoading={isLoading}
                            filters={filters}
                            meta={meta}
                            onSearch={handleSearch}
                            onClearFilters={clearFilters}
                            onPrevPage={handlePrevPage}
                            onNextPage={handleNextPage}
                            activeTab={activeTab}
                            onEmailClick={handleEmailClick}
                            onViewDetails={handleViewDetails}
                            // Download props
                            downloadYear={downloadYear}
                            downloadMonth={downloadMonth}
                            isDownloading={isDownloading}
                            onDownloadYearChange={setDownloadYear}
                            onDownloadMonthChange={setDownloadMonth}
                            onDownloadExcel={handleDownloadExcel}
                            years={years}
                        />
                    </TabsContent>

                    <TabsContent value="read">
                        <ContactTable
                            contacts={contacts}
                            isLoading={isLoading}
                            filters={filters}
                            meta={meta}
                            onSearch={handleSearch}
                            onClearFilters={clearFilters}
                            onPrevPage={handlePrevPage}
                            onNextPage={handleNextPage}
                            activeTab={activeTab}
                            onEmailClick={handleEmailClick}
                            onViewDetails={handleViewDetails}
                            // Download props
                            downloadYear={downloadYear}
                            downloadMonth={downloadMonth}
                            isDownloading={isDownloading}
                            onDownloadYearChange={setDownloadYear}
                            onDownloadMonthChange={setDownloadMonth}
                            onDownloadExcel={handleDownloadExcel}
                            years={years}
                        />
                    </TabsContent>

                    <TabsContent value="replied">
                        <ContactTable
                            contacts={contacts}
                            isLoading={isLoading}
                            filters={filters}
                            meta={meta}
                            onSearch={handleSearch}
                            onClearFilters={clearFilters}
                            onPrevPage={handlePrevPage}
                            onNextPage={handleNextPage}
                            activeTab={activeTab}
                            onEmailClick={handleEmailClick}
                            onViewDetails={handleViewDetails}
                            // Download props
                            downloadYear={downloadYear}
                            downloadMonth={downloadMonth}
                            isDownloading={isDownloading}
                            onDownloadYearChange={setDownloadYear}
                            onDownloadMonthChange={setDownloadMonth}
                            onDownloadExcel={handleDownloadExcel}
                            years={years}
                        />
                    </TabsContent>
                </Tabs>
            </div>

            {/* Contact Details Modal */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="bg-[#14213D] border border-[#C9A94D] rounded-[20px] p-6 max-w-md max-h-[85vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold text-[#C9A94D] text-center">Contact Details</DialogTitle>
                    </DialogHeader>

                    {selectedContact && (
                        <div className="space-y-4 mt-2">
                            {/* Header with Name and Status */}
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg font-semibold text-white">
                                    {selectedContact.firstName} {selectedContact.lastName}
                                </h3>
                                <span className={`px-2 py-1 rounded-full text-xs text-white font-medium ${getStatusColor(selectedContact.status)}`}>{selectedContact.status}</span>
                            </div>

                            {/* Contact Information */}
                            <div className="space-y-2">
                                {/* Email */}
                                <div className="flex items-center gap-2 p-2 bg-[#2D3546] rounded-lg">
                                    <Mail className="w-4 h-4 text-[#C9A94D] flex-shrink-0" />
                                    <div className="min-w-0 flex-1">
                                        <p className="text-xs text-gray-400">Email</p>
                                        <button onClick={() => handleEmailClick(selectedContact.email)} className="text-white hover:text-[#C9A94D] transition text-sm truncate">
                                            {selectedContact.email}
                                        </button>
                                    </div>
                                </div>

                                {/* Phone - ADDED THIS SECTION */}
                                {selectedContact.phone && (
                                    <div className="flex items-center gap-2 p-2 bg-[#2D3546] rounded-lg">
                                        <Phone className="w-4 h-4 text-[#C9A94D] flex-shrink-0" />
                                        <div className="min-w-0 flex-1">
                                            <p className="text-xs text-gray-400">Phone</p>
                                            <button onClick={() => handlePhoneClick(selectedContact.phone)} className="text-white hover:text-[#C9A94D] transition text-sm truncate">
                                                {selectedContact.phone}
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Received Date */}
                                <div className="flex items-center gap-2 p-2 bg-[#2D3546] rounded-lg">
                                    <Calendar className="w-4 h-4 text-[#C9A94D] flex-shrink-0" />
                                    <div>
                                        <p className="text-xs text-gray-400">Received</p>
                                        <p className="text-white text-sm">{formatDate(selectedContact.createdAt)}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Full Message */}
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <MessageSquare className="w-4 h-4 text-[#C9A94D]" />
                                    <h4 className="text-md font-semibold text-[#C9A94D]">Message</h4>
                                </div>
                                <div className="p-3 bg-[#2D3546] rounded-lg border border-[#434D64] max-h-32 overflow-y-auto">
                                    <p className="text-white text-sm whitespace-pre-wrap leading-relaxed">{selectedContact.message}</p>
                                </div>
                            </div>

                            {selectedContact.status === "replied" && selectedContact.replyMessage && (
                                <div className="space-y-2 pt-3 border-t border-[#434D64]">
                                    <div className="flex items-center gap-2">
                                        <MessageSquare className="w-4 h-4 text-[#C9A94D]" />
                                        <h4 className="text-md font-semibold text-[#C9A94D]">Your Reply</h4>
                                        {selectedContact.repliedAt && <span className="text-xs text-gray-400 ml-auto">{formatDate(selectedContact.repliedAt)}</span>}
                                    </div>
                                    <div className="p-3 bg-[#2D3546] rounded-lg border border-[#434D64]">
                                        <p className="text-white text-sm whitespace-pre-wrap leading-relaxed">{selectedContact.replyMessage}</p>
                                    </div>
                                </div>
                            )}

                            {/* Reply Form - Only show for pending and read status */}
                            {(selectedContact.status === "pending" || selectedContact.status === "read") && (
                                <div className="space-y-2 pt-3 border-t border-[#434D64]">
                                    <div className="flex items-center gap-2">
                                        <Send className="w-4 h-4 text-[#C9A94D]" />
                                        <h4 className="text-md font-semibold text-[#C9A94D]">Send Reply</h4>
                                    </div>

                                    <textarea value={replyMessage} onChange={(e) => setReplyMessage(e.target.value)} placeholder="Type your reply message here..." className="w-full h-24 p-2 bg-[#2D3546] border border-[#434D64] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#C9A94D] resize-none text-sm" />

                                    <div className="flex gap-2">
                                        <button onClick={handleReplySubmit} disabled={isReplying || !replyMessage.trim()} className="flex-1 flex items-center justify-center gap-2 bg-[#C9A94D] text-white py-2 px-3 rounded-lg hover:bg-[#b8973e] disabled:opacity-50 disabled:cursor-not-allowed transition text-sm">
                                            <Send className="w-3 h-3" />
                                            {isReplying ? "Sending..." : "Send Reply"}
                                        </button>

                                        <button onClick={() => setReplyMessage("")} className="px-3 py-2 bg-[#434D64] text-white rounded-lg hover:bg-[#535a6b] transition text-sm">
                                            Clear
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="space-y-2 pt-3 border-t border-[#434D64]">
                                {/* Status Actions - Different based on current status */}
                                <div className="flex flex-wrap gap-2 justify-center">
                                    {/* For Pending contacts */}
                                    {selectedContact.status === "pending" && (
                                        <button onClick={() => handleStatusUpdate(selectedContact._id, "read")} className="flex items-center justify-center gap-2 bg-[#135E9A] text-white py-2 px-3 rounded-lg hover:bg-[#0f4a7a] transition text-sm">
                                            Mark as Read
                                        </button>
                                    )}

                                    {/* For Read contacts */}
                                    {selectedContact.status === "read" && (
                                        <button onClick={() => handleStatusUpdate(selectedContact._id, "pending")} className="flex items-center justify-center gap-2 bg-[#D00000] text-white py-2 px-3 rounded-lg hover:bg-[#b30000] transition text-sm">
                                            Mark as Pending
                                        </button>
                                    )}

                                    {/* For Replied contacts - No status actions, just view */}
                                    {/* {selectedContact.status === "replied" && <span className="text-xs text-gray-400 py-1 px-3 text-center">This contact has been replied to</span>} */}

                                    {/* Close button for all statuses */}
                                    <button onClick={handleCloseModal} className="flex items-center justify-center gap-2 bg-[#434D64] text-white py-2 px-3 rounded-lg hover:bg-[#535a6b] transition text-sm">
                                        Close
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};

// Table component
const ContactTable = ({
    contacts,
    isLoading,
    filters,
    meta,
    onSearch,
    onClearFilters,
    onPrevPage,
    onNextPage,
    activeTab,
    onEmailClick,
    onViewDetails,
    // Download props
    downloadYear,
    downloadMonth,
    isDownloading,
    onDownloadYearChange,
    onDownloadMonthChange,
    onDownloadExcel,
    years,
}: any) => {
    const getStatusColor = (status: string) => {
        switch (status) {
            case "pending":
                return "bg-yellow-600";
            case "read":
                return "bg-blue-600";
            case "replied":
                return "bg-green-600";
            default:
                return "bg-gray-600";
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString();
    };

    const onPhoneClick = (phoneNumber: string) => {
        const cleanPhone = phoneNumber.replace(/[^\d+]/g, "");

        window.location.href = `tel:${cleanPhone}`;
    };

    return (
        <div className="bg-[#2D3546] border border-[#C9A94D] p-4 md:p-6 text-[#C9A94D] rounded-[20px] space-y-4">
            <div className="flex justify-between items-center gap-3 flex-col md:flex-row">
                <span className="font-semibold text-[28px] capitalize">{activeTab} Contacts</span>
                <div className="text-right w-full md:w-auto">
                    <span className="text-sm text-gray-400">
                        Showing {contacts.length} of {meta?.total} contacts
                    </span>
                </div>
            </div>

            {/* Search */}
            <div className="bg-[#2D3546] border border-[#C9A94D] p-4 rounded-[12px] mb-6">
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="relative flex-1 w-full">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input type="text" placeholder="Search contacts..." value={filters.search} onChange={onSearch} className="w-full pl-10 pr-4 py-2 bg-[#434D64] border border-[#C9A94D] rounded-[8px] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C9A94D]" />
                    </div>

                    {filters.search && (
                        <button onClick={onClearFilters} className="px-4 py-2 bg-red-600 text-white rounded-[8px] hover:bg-red-700 transition">
                            Clear
                        </button>
                    )}
                </div>
            </div>

            {isLoading ? (
                <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C9A94D] mx-auto"></div>
                    <p className="mt-4">Loading contacts...</p>
                </div>
            ) : contacts.length === 0 ? (
                <div className="text-center py-8">
                    <p className="text-lg">No {activeTab} contacts found</p>
                    {filters.search && (
                        <button onClick={onClearFilters} className="mt-2 px-4 py-2 bg-[#C9A94D] text-white rounded-[8px] hover:bg-[#b8973e] transition">
                            Clear search
                        </button>
                    )}
                </div>
            ) : (
                <>
                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="border-b border-[#C9A94D]">
                                    <th className="text-left py-3 px-4 text-white font-semibold">Name</th>
                                    <th className="text-left py-3 px-4 text-white font-semibold">Email</th>
                                    <th className="text-left py-3 px-4 text-white font-semibold">Phone</th>
                                    <th className="text-left py-3 px-4 text-white font-semibold">Message</th>
                                    <th className="text-left py-3 px-4 text-white font-semibold">Status</th>
                                    <th className="text-left py-3 px-4 text-white font-semibold">Date</th>
                                    <th className="text-left py-3 px-4 text-white font-semibold">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {contacts.map((contact: any) => (
                                    <tr key={contact._id} className="border-b border-[#434D64] hover:bg-[#3a4459] transition">
                                        <td className="py-3 px-4 text-white">
                                            {contact.firstName} {contact.lastName}
                                        </td>
                                        <td className="py-3 px-4">
                                            <button onClick={() => onEmailClick(contact.email)} className="text-[#C9A94D] hover:text-[#b8973e] transition flex items-center gap-2">
                                                <Mail className="w-4 h-4" />
                                                {contact.email}
                                            </button>
                                        </td>
                                        <td className="py-3 px-4">
                                            {contact.phone ? (
                                                <button onClick={() => onPhoneClick(contact.phone)} className="text-[#C9A94D] hover:text-[#b8973e] transition flex items-center gap-2">
                                                    <Phone className="w-4 h-4" />
                                                    <span className="text-sm">{contact.phone}</span>
                                                </button>
                                            ) : (
                                                <span className="text-gray-400 text-sm">N/A</span>
                                            )}
                                        </td>

                                        <td className="py-3 px-4 text-white max-w-xs">
                                            <div className="line-clamp-2 text-sm">{contact.message}</div>
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className={`px-3 py-1 rounded-full text-xs text-white font-medium ${getStatusColor(contact.status)}`}>{contact.status}</span>
                                        </td>
                                        <td className="py-3 px-4 text-gray-300 text-sm">{formatDate(contact.createdAt)}</td>
                                        <td className="py-3 px-4">
                                            <button onClick={() => onViewDetails(contact)} className="p-2 rounded-full bg-[#3a4459] hover:bg-[#4a5568] transition">
                                                <Eye className="w-4 h-4 text-white" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {meta && meta.total > meta.limit && (
                        <div className="flex justify-between items-center mt-6 pt-4 border-t border-[#C9A94D] flex-col md:flex-row gap-4">
                            <button onClick={onPrevPage} disabled={filters.page === 1} className="flex items-center gap-2 px-4 py-2 bg-[#434D64] text-white rounded-[8px] hover:bg-[#535a6b] disabled:opacity-50 disabled:cursor-not-allowed transition">
                                Previous
                            </button>

                            <div className="text-white text-sm">
                                Page {filters.page} of {Math.ceil(meta.total / meta.limit)}
                                <span className="text-gray-400 ml-2">({meta.total} total contacts)</span>
                            </div>

                            <button onClick={onNextPage} disabled={filters.page >= Math.ceil(meta.total / meta.limit)} className="flex items-center gap-2 px-4 py-2 bg-[#434D64] text-white rounded-[8px] hover:bg-[#535a6b] disabled:opacity-50 disabled:cursor-not-allowed transition">
                                Next
                            </button>
                        </div>
                    )}

                    {/* Download Section */}
                    <div className="flex flex-col md:flex-row gap-4 items-end justify-end mt-6">
                        {/* Month Select */}
                        <Select value={downloadMonth} onValueChange={onDownloadMonthChange}>
                            <SelectTrigger className="rounded-[12px] text-white bg-[#C9A94D] border border-[#C9A94D] py-2 px-3 text-sm focus:outline-none focus:ring-0 w-full md:w-auto">
                                <SelectValue placeholder="Month" />
                            </SelectTrigger>
                            <SelectContent className="bg-[#C9A94D] text-white">
                                <SelectItem value="all">All Months</SelectItem>
                                <SelectItem value="1">January</SelectItem>
                                <SelectItem value="2">February</SelectItem>
                                <SelectItem value="3">March</SelectItem>
                                <SelectItem value="4">April</SelectItem>
                                <SelectItem value="5">May</SelectItem>
                                <SelectItem value="6">June</SelectItem>
                                <SelectItem value="7">July</SelectItem>
                                <SelectItem value="8">August</SelectItem>
                                <SelectItem value="9">September</SelectItem>
                                <SelectItem value="10">October</SelectItem>
                                <SelectItem value="11">November</SelectItem>
                                <SelectItem value="12">December</SelectItem>
                            </SelectContent>
                        </Select>

                        {/* Year Select */}
                        <Select value={downloadYear} onValueChange={onDownloadYearChange}>
                            <SelectTrigger className="rounded-[12px] text-white bg-[#C9A94D] border border-[#C9A94D] py-2 px-3 text-sm focus:outline-none focus:ring-0 w-full md:w-auto">
                                <SelectValue placeholder="Year" />
                            </SelectTrigger>
                            <SelectContent className="bg-[#C9A94D] text-white">
                                {years.map((year: number) => (
                                    <SelectItem key={year} value={year.toString()}>
                                        {year}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Button onClick={onDownloadExcel} disabled={isDownloading || !downloadYear} className="bg-[#C9A94D] text-white hover:bg-[#B89A42] rounded-[12px] py-2 px-6 flex items-center gap-2 whitespace-nowrap w-full md:w-auto">
                            <Download className="w-4 h-4" />
                            {isDownloading ? "Downloading..." : "Download"}
                        </Button>
                    </div>
                </>
            )}
        </div>
    );
};

export default ContactsManagement;

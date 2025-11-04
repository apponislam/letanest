// "use client";
// import React, { useState } from "react";
// import { Search } from "lucide-react";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
// import { EllipsisVertical } from "lucide-react";
// import PageHeader from "@/components/PageHeader";
// import { useGetContactsQuery, useUpdateContactStatusMutation } from "@/redux/features/contact/contactApi";
// import { toast } from "sonner";

// const ContactsManagement = () => {
//     const [activeTab, setActiveTab] = useState("pending");
//     const [filters, setFilters] = useState({
//         page: 1,
//         limit: 10,
//         search: "",
//         status: "",
//     });

//     const {
//         data: contactsData,
//         isLoading,
//         refetch,
//     } = useGetContactsQuery({
//         ...filters,
//         status: activeTab === "all" ? "" : activeTab,
//     });

//     const [updateStatus] = useUpdateContactStatusMutation();

//     const contacts = contactsData?.contacts || [];
//     const meta = contactsData?.meta;

//     const getStatusColor = (status: string) => {
//         switch (status) {
//             case "pending":
//                 return "bg-yellow-600";
//             case "read":
//                 return "bg-blue-600";
//             case "replied":
//                 return "bg-green-600";
//             default:
//                 return "bg-gray-600";
//         }
//     };

//     const formatDate = (dateString: string) => {
//         return new Date(dateString).toLocaleDateString();
//     };

//     // Pagination handlers
//     const handleNextPage = () => {
//         if (meta && filters.page < Math.ceil(meta.total / meta.limit)) {
//             setFilters((prev) => ({ ...prev, page: prev.page + 1 }));
//         }
//     };

//     const handlePrevPage = () => {
//         if (filters.page > 1) {
//             setFilters((prev) => ({ ...prev, page: prev.page - 1 }));
//         }
//     };

//     const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
//         setFilters((prev) => ({ ...prev, search: e.target.value, page: 1 }));
//     };

//     const clearFilters = () => {
//         setFilters({ page: 1, limit: 10, search: "", status: "" });
//     };

//     const handleStatusUpdate = async (contactId: string, newStatus: string) => {
//         try {
//             await updateStatus({ contactId, status: newStatus }).unwrap();
//             toast.success("Status updated successfully");
//             refetch();
//         } catch (error) {
//             toast.error("Failed to update status");
//         }
//     };

//     const handleTabChange = (value: string) => {
//         setActiveTab(value);
//         setFilters({ page: 1, limit: 10, search: "", status: "" });
//     };

//     return (
//         <div className="container mx-auto">
//             <PageHeader title={"Contacts Management"}></PageHeader>

//             <div className="w-full">
//                 <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
//                     {/* Tab Triggers */}
//                     <TabsList className="flex h-auto overflow-hidden bg-transparent gap-3 mb-5 md:mb-6 w-full flex-col md:flex-row">
//                         <TabsTrigger value="pending" className="p-3 h-auto rounded-[10px] w-full md:w-1/3 text-white data-[state=active]:bg-[#135E9A] data-[state=active]:border-[#C9A94D] data-[state=active]:text-white bg-[#434D64] border-r border-[#C9A94D]">
//                             Pending
//                         </TabsTrigger>
//                         <TabsTrigger value="read" className="p-3 h-auto rounded-[10px] w-full md:w-1/3 text-white data-[state=active]:bg-[#135E9A] data-[state=active]:border-[#C9A94D] data-[state=active]:text-white bg-[#434D64] border-r border-[#C9A94D]">
//                             Read
//                         </TabsTrigger>
//                         <TabsTrigger value="replied" className="p-3 h-auto rounded-[10px] w-full md:w-1/3 text-white data-[state=active]:bg-[#135E9A] data-[state=active]:border-[#C9A94D] data-[state=active]:text-white bg-[#434D64]">
//                             Replied
//                         </TabsTrigger>
//                     </TabsList>

//                     {/* All Tabs Content */}
//                     <TabsContent value="pending">
//                         <ContactTabContent contacts={contacts} isLoading={isLoading} filters={filters} meta={meta} onSearch={handleSearch} onClearFilters={clearFilters} onStatusUpdate={handleStatusUpdate} onPrevPage={handlePrevPage} onNextPage={handleNextPage} activeTab={activeTab} />
//                     </TabsContent>

//                     <TabsContent value="read">
//                         <ContactTabContent contacts={contacts} isLoading={isLoading} filters={filters} meta={meta} onSearch={handleSearch} onClearFilters={clearFilters} onStatusUpdate={handleStatusUpdate} onPrevPage={handlePrevPage} onNextPage={handleNextPage} activeTab={activeTab} />
//                     </TabsContent>

//                     <TabsContent value="replied">
//                         <ContactTabContent contacts={contacts} isLoading={isLoading} filters={filters} meta={meta} onSearch={handleSearch} onClearFilters={clearFilters} onStatusUpdate={handleStatusUpdate} onPrevPage={handlePrevPage} onNextPage={handleNextPage} activeTab={activeTab} />
//                     </TabsContent>
//                 </Tabs>
//             </div>
//         </div>
//     );
// };

// // Reusable tab content component
// const ContactTabContent = ({ contacts, isLoading, filters, meta, onSearch, onClearFilters, onStatusUpdate, onPrevPage, onNextPage, activeTab }: any) => {
//     const getStatusColor = (status: string) => {
//         switch (status) {
//             case "pending":
//                 return "bg-yellow-600";
//             case "read":
//                 return "bg-blue-600";
//             case "replied":
//                 return "bg-green-600";
//             default:
//                 return "bg-gray-600";
//         }
//     };

//     const formatDate = (dateString: string) => {
//         return new Date(dateString).toLocaleDateString();
//     };

//     return (
//         <div className="bg-[#2D3546] border border-[#C9A94D] p-4 md:p-6 text-[#C9A94D] rounded-[20px] space-y-4">
//             <div className="flex justify-between items-center gap-3 flex-col md:flex-row">
//                 <span className="font-semibold text-[28px] capitalize">{activeTab} Contacts</span>
//                 <div className="text-right w-full md:w-auto">
//                     <span className="text-sm text-gray-400">
//                         Showing {contacts.length} of {meta?.total} contacts
//                     </span>
//                 </div>
//             </div>

//             {/* Search */}
//             <div className="bg-[#2D3546] border border-[#C9A94D] p-4 rounded-[12px] mb-6">
//                 <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
//                     <div className="relative flex-1 w-full">
//                         <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//                         <input type="text" placeholder="Search contacts..." value={filters.search} onChange={onSearch} className="w-full pl-10 pr-4 py-2 bg-[#434D64] border border-[#C9A94D] rounded-[8px] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C9A94D]" />
//                     </div>

//                     {filters.search && (
//                         <button onClick={onClearFilters} className="px-4 py-2 bg-red-600 text-white rounded-[8px] hover:bg-red-700 transition">
//                             Clear
//                         </button>
//                     )}
//                 </div>
//             </div>

//             {isLoading ? (
//                 <div className="text-center py-8">
//                     <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C9A94D] mx-auto"></div>
//                     <p className="mt-4">Loading contacts...</p>
//                 </div>
//             ) : contacts.length === 0 ? (
//                 <div className="text-center py-8">
//                     <p className="text-lg">No {activeTab} contacts found</p>
//                     {filters.search && (
//                         <button onClick={onClearFilters} className="mt-2 px-4 py-2 bg-[#C9A94D] text-white rounded-[8px] hover:bg-[#b8973e] transition">
//                             Clear search
//                         </button>
//                     )}
//                 </div>
//             ) : (
//                 <>
//                     <div className="space-y-3">
//                         {contacts.map((contact: any) => (
//                             <div key={contact._id} className="p-4 rounded-[12px] flex justify-between items-center border border-[#C9A94D] flex-col md:flex-row">
//                                 <div className="flex-1 w-full">
//                                     <div className="flex items-start justify-between flex-col md:flex-row w-full md:w-auto gap-4">
//                                         <div className="flex-1">
//                                             <div className="flex items-center gap-3 mb-2">
//                                                 <p className="font-semibold text-white text-lg">
//                                                     {contact.firstName} {contact.lastName}
//                                                 </p>
//                                                 <span className={`px-3 py-1 rounded-full text-xs text-white font-medium ${getStatusColor(contact.status)}`}>{contact.status}</span>
//                                             </div>
//                                             <p className="text-sm text-gray-300 mb-1">📧 {contact.email}</p>
//                                             <p className="text-white text-sm line-clamp-2">{contact.message}</p>
//                                             <p className="text-xs text-gray-400 mt-2">Received: {formatDate(contact.createdAt)}</p>
//                                         </div>
//                                     </div>
//                                 </div>
//                                 <DropdownMenu>
//                                     <DropdownMenuTrigger asChild>
//                                         <div className="w-full md:w-auto flex justify-end mt-3 md:mt-0">
//                                             <button className="p-2 rounded-full bg-[#3a4459] hover:bg-[#3a4459] transition md:ml-4 flex flex-end">
//                                                 <EllipsisVertical className="w-5 h-5 text-white" />
//                                             </button>
//                                         </div>
//                                     </DropdownMenuTrigger>

//                                     <DropdownMenuContent className="bg-[#14213D] text-white rounded-[10px] w-48 flex flex-col gap-3 p-4 border border-[#C9A94D]">
//                                         {contact.status !== "read" && (
//                                             <DropdownMenuItem className="bg-[#135E9A] text-white hover:bg-[#0f4a7a] focus:bg-[#0f4a7a] justify-center rounded-[20px] cursor-pointer focus:text-white" onSelect={() => onStatusUpdate(contact._id, "read")}>
//                                                 <span className="w-full text-center">Mark as Read</span>
//                                             </DropdownMenuItem>
//                                         )}
//                                         {contact.status !== "replied" && (
//                                             <DropdownMenuItem className="bg-[#C9A94D] text-white hover:bg-[#b8973e] focus:bg-[#b8973e] justify-center rounded-[20px] cursor-pointer focus:text-white" onSelect={() => onStatusUpdate(contact._id, "replied")}>
//                                                 <span className="w-full text-center">Mark as Replied</span>
//                                             </DropdownMenuItem>
//                                         )}
//                                         {contact.status !== "pending" && (
//                                             <DropdownMenuItem className="bg-[#D00000] text-white hover:bg-[#b30000] focus:bg-[#b30000] justify-center rounded-[20px] cursor-pointer focus:text-white" onSelect={() => onStatusUpdate(contact._id, "pending")}>
//                                                 <span className="w-full text-center">Mark as Pending</span>
//                                             </DropdownMenuItem>
//                                         )}
//                                     </DropdownMenuContent>
//                                 </DropdownMenu>
//                             </div>
//                         ))}
//                     </div>

//                     {/* Pagination */}
//                     {meta && meta.total > meta.limit && (
//                         <div className="flex justify-between items-center mt-6 pt-4 border-t border-[#C9A94D] flex-col md:flex-row gap-4">
//                             <button onClick={onPrevPage} disabled={filters.page === 1} className="flex items-center gap-2 px-4 py-2 bg-[#434D64] text-white rounded-[8px] hover:bg-[#535a6b] disabled:opacity-50 disabled:cursor-not-allowed transition">
//                                 Previous
//                             </button>

//                             <div className="text-white text-sm">
//                                 Page {filters.page} of {Math.ceil(meta.total / meta.limit)}
//                                 <span className="text-gray-400 ml-2">({meta.total} total contacts)</span>
//                             </div>

//                             <button onClick={onNextPage} disabled={filters.page >= Math.ceil(meta.total / meta.limit)} className="flex items-center gap-2 px-4 py-2 bg-[#434D64] text-white rounded-[8px] hover:bg-[#535a6b] disabled:opacity-50 disabled:cursor-not-allowed transition">
//                                 Next
//                             </button>
//                         </div>
//                     )}
//                 </>
//             )}
//         </div>
//     );
// };

// export default ContactsManagement;

"use client";
import React, { useState } from "react";
import { Search, Mail, Calendar, MessageSquare, Eye } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import PageHeader from "@/components/PageHeader";
import { useGetContactsQuery, useUpdateContactStatusMutation } from "@/redux/features/contact/contactApi";
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

    const {
        data: contactsData,
        isLoading,
        refetch,
    } = useGetContactsQuery({
        ...filters,
        status: activeTab === "all" ? "" : activeTab,
    });

    const [updateStatus] = useUpdateContactStatusMutation();

    const contacts = contactsData?.contacts || [];
    const meta = contactsData?.meta;

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

    const handleTabChange = (value: string) => {
        setActiveTab(value);
        setFilters({ page: 1, limit: 10, search: "", status: "" });
    };

    const handleEmailClick = (email: string) => {
        window.open(`mailto:${email}`, "_blank");
    };

    const handleViewDetails = (contact: any) => {
        setSelectedContact(contact);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedContact(null);
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
                        <ContactTable contacts={contacts} isLoading={isLoading} filters={filters} meta={meta} onSearch={handleSearch} onClearFilters={clearFilters} onPrevPage={handlePrevPage} onNextPage={handleNextPage} activeTab={activeTab} onEmailClick={handleEmailClick} onViewDetails={handleViewDetails} />
                    </TabsContent>

                    <TabsContent value="read">
                        <ContactTable contacts={contacts} isLoading={isLoading} filters={filters} meta={meta} onSearch={handleSearch} onClearFilters={clearFilters} onPrevPage={handlePrevPage} onNextPage={handleNextPage} activeTab={activeTab} onEmailClick={handleEmailClick} onViewDetails={handleViewDetails} />
                    </TabsContent>

                    <TabsContent value="replied">
                        <ContactTable contacts={contacts} isLoading={isLoading} filters={filters} meta={meta} onSearch={handleSearch} onClearFilters={clearFilters} onPrevPage={handlePrevPage} onNextPage={handleNextPage} activeTab={activeTab} onEmailClick={handleEmailClick} onViewDetails={handleViewDetails} />
                    </TabsContent>
                </Tabs>
            </div>

            {/* Contact Details Modal */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="bg-[#14213D] border border-[#C9A94D] rounded-[20px] p-6 max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold text-[#C9A94D] text-center">Contact Details</DialogTitle>
                    </DialogHeader>

                    {selectedContact && (
                        <div className="space-y-6 mt-4">
                            {/* Header with Name and Status */}
                            <div className="flex justify-between items-center">
                                <h3 className="text-xl font-semibold text-white">
                                    {selectedContact.firstName} {selectedContact.lastName}
                                </h3>
                                <span className={`px-3 py-1 rounded-full text-xs text-white font-medium ${getStatusColor(selectedContact.status)}`}>{selectedContact.status}</span>
                            </div>

                            {/* Contact Information */}
                            <div className="grid grid-cols-1 gap-4">
                                <div className="flex items-center gap-3 p-3 bg-[#2D3546] rounded-lg">
                                    <Mail className="w-5 h-5 text-[#C9A94D]" />
                                    <div>
                                        <p className="text-sm text-gray-400">Email</p>
                                        <button onClick={() => handleEmailClick(selectedContact.email)} className="text-white hover:text-[#C9A94D] transition">
                                            {selectedContact.email}
                                        </button>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 p-3 bg-[#2D3546] rounded-lg">
                                    <Calendar className="w-5 h-5 text-[#C9A94D]" />
                                    <div>
                                        <p className="text-sm text-gray-400">Received</p>
                                        <p className="text-white">{formatDate(selectedContact.createdAt)}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Full Message */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <MessageSquare className="w-5 h-5 text-[#C9A94D]" />
                                    <h4 className="text-lg font-semibold text-[#C9A94D]">Message</h4>
                                </div>
                                <div className="p-4 bg-[#2D3546] rounded-lg border border-[#434D64]">
                                    <p className="text-white whitespace-pre-wrap leading-relaxed">{selectedContact.message}</p>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="space-y-3 pt-4 border-t border-[#434D64]">
                                {/* Main Actions - Always visible */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <button onClick={() => handleEmailClick(selectedContact.email)} className="flex items-center justify-center gap-2 bg-[#C9A94D] text-white py-3 px-4 rounded-lg hover:bg-[#b8973e] transition">
                                        <Mail className="w-4 h-4" />
                                        Reply via Email
                                    </button>

                                    <button onClick={handleCloseModal} className="flex items-center justify-center gap-2 bg-[#434D64] text-white py-3 px-4 rounded-lg hover:bg-[#535a6b] transition">
                                        Close
                                    </button>
                                </div>

                                {/* Status Actions - Only show relevant ones */}
                                <div className="flex flex-wrap gap-2 justify-center">
                                    {selectedContact.status !== "read" && (
                                        <button onClick={() => handleStatusUpdate(selectedContact._id, "read")} className="flex items-center justify-center gap-2 bg-[#135E9A] text-white py-2 px-4 rounded-lg hover:bg-[#0f4a7a] transition text-sm">
                                            Mark as Read
                                        </button>
                                    )}

                                    {selectedContact.status !== "replied" && (
                                        <button onClick={() => handleStatusUpdate(selectedContact._id, "replied")} className="flex items-center justify-center gap-2 bg-[#C9A94D] text-white py-2 px-4 rounded-lg hover:bg-[#b8973e] transition text-sm">
                                            Mark as Replied
                                        </button>
                                    )}

                                    {selectedContact.status !== "pending" && (
                                        <button onClick={() => handleStatusUpdate(selectedContact._id, "pending")} className="flex items-center justify-center gap-2 bg-[#D00000] text-white py-2 px-4 rounded-lg hover:bg-[#b30000] transition text-sm">
                                            Mark as Pending
                                        </button>
                                    )}
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
const ContactTable = ({ contacts, isLoading, filters, meta, onSearch, onClearFilters, onPrevPage, onNextPage, activeTab, onEmailClick, onViewDetails }: any) => {
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
                </>
            )}
        </div>
    );
};

export default ContactsManagement;

// "use client";
// import { useFilterConversationsByUpdatedAtQuery } from "@/redux/features/messages/messageApi";
// import React, { useState } from "react";
// import { ChevronLeft, ChevronRight, Eye, MessageSquare, Calendar, User, Phone, Mail } from "lucide-react";
// import { useRouter } from "next/navigation";

// const UserConversations = () => {
//     const router = useRouter();
//     const [currentPage, setCurrentPage] = useState(1);
//     const [itemsPerPage, setItemsPerPage] = useState(20);
//     const [selectedFilter, setSelectedFilter] = useState("all");

//     const { data, isLoading, error, refetch } = useFilterConversationsByUpdatedAtQuery({
//         filter: selectedFilter,
//         page: currentPage,
//         limit: itemsPerPage,
//     });

//     const conversations = data?.data || [];
//     const totalConversations = data?.meta?.total || 0;
//     const totalPages = Math.ceil(totalConversations / itemsPerPage);

//     const handlePageChange = (page: number) => {
//         setCurrentPage(page);
//     };

//     const handleFilterChange = (filter: string) => {
//         setSelectedFilter(filter);
//         setCurrentPage(1); // Reset to first page when filter changes
//     };

//     const handleViewConversation = (conversationId: string) => {
//         router.push(`/dashboard/messages/admin/${conversationId}`);
//     };

//     if (isLoading) {
//         return (
//             <div className="min-h-screen bg-[#B6BAC3] flex items-center justify-center">
//                 <div className="text-center">
//                     <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C9A94D] mx-auto mb-4"></div>
//                     <p className="text-[#14213D] text-lg">Loading conversations...</p>
//                 </div>
//             </div>
//         );
//     }

//     if (error) {
//         return (
//             <div className="min-h-screen bg-[#B6BAC3] flex items-center justify-center">
//                 <div className="text-center">
//                     <MessageSquare className="h-16 w-16 text-red-500 mx-auto mb-4" />
//                     <p className="text-red-600 text-lg">Failed to load conversations</p>
//                     <button onClick={() => refetch()} className="mt-4 bg-[#C9A94D] text-white px-4 py-2 rounded">
//                         Retry
//                     </button>
//                 </div>
//             </div>
//         );
//     }

//     const formatDate = (dateString: string) => {
//         const date = new Date(dateString);
//         return date.toLocaleDateString("en-GB", {
//             day: "2-digit",
//             month: "short",
//             year: "numeric",
//             hour: "2-digit",
//             minute: "2-digit",
//         });
//     };

//     const getParticipantNames = (participants: any[]) => {
//         return participants.map((p) => p.name).join(" ↔ ");
//     };

//     const getParticipantRoles = (participants: any[]) => {
//         return participants.map((p) => p.role).join(" / ");
//     };

//     return (
//         <div className="container mx-auto ">
//             {/* Header */}
//             <div className="mb-8">
//                 <h1 className="text-3xl font-bold text-[#14213D] mb-2">Admin - All Conversations</h1>
//                 <p className="text-[#14213D]">View and manage all conversations in the system</p>
//             </div>

//             {/* Filter Buttons */}
//             <div className="flex flex-wrap gap-2 mb-6">
//                 {[
//                     { label: "All", value: "all" },
//                     { label: "Last 24 Hours", value: "24h" },
//                     { label: "Last 7 Days", value: "7d" },
//                     { label: "Last 30 Days", value: "30d" },
//                     { label: "Last 6 Months", value: "6m" },
//                     { label: "Last Year", value: "1y" },
//                 ].map((filter) => (
//                     <button key={filter.value} onClick={() => handleFilterChange(filter.value)} className={`px-4 py-2 rounded-lg font-medium transition-colors ${selectedFilter === filter.value ? "bg-[#14213D] text-white" : "bg-white text-[#14213D] border border-[#C9A94D] hover:bg-[#C9A94D]/10"}`}>
//                         {filter.label}
//                     </button>
//                 ))}
//             </div>

//             {/* Table */}
//             <div className="bg-white rounded-lg shadow-md overflow-hidden border border-[#C9A94D]">
//                 <div className="overflow-x-auto">
//                     <table className="min-w-full divide-y divide-gray-200">
//                         <thead className="bg-[#14213D]">
//                             <tr>
//                                 <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Conversation ID</th>
//                                 <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Participants</th>
//                                 <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Roles</th>
//                                 <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Created</th>
//                                 <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Last Updated</th>
//                                 <th className="px6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Actions</th>
//                             </tr>
//                         </thead>
//                         <tbody className="bg-white divide-y divide-gray-200">
//                             {conversations.length === 0 ? (
//                                 <tr>
//                                     <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
//                                         <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-3" />
//                                         <p className="text-lg">No conversations found</p>
//                                         <p className="text-sm">Try selecting a different filter</p>
//                                     </td>
//                                 </tr>
//                             ) : (
//                                 conversations.map((conversation: any, index: number) => (
//                                     <tr key={conversation._id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
//                                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                                             <div className="flex items-center">
//                                                 <MessageSquare className="w-4 h-4 text-[#C9A94D] mr-2" />
//                                                 <span className="font-mono text-xs">{conversation._id.substring(0, 12)}...</span>
//                                             </div>
//                                         </td>
//                                         <td className="px-6 py-4">
//                                             <div className="text-sm text-gray-900">
//                                                 <div className="font-medium">{getParticipantNames(conversation.participants)}</div>
//                                                 <div className="text-xs text-gray-500 mt-1">
//                                                     {conversation.participants.map((p: any) => (
//                                                         <div key={p._id} className="flex items-center gap-1">
//                                                             <Mail className="w-3 h-3" />
//                                                             <span>{p.email}</span>
//                                                             {p.phone && (
//                                                                 <>
//                                                                     <Phone className="w-3 h-3 ml-2" />
//                                                                     <span>{p.phone}</span>
//                                                                 </>
//                                                             )}
//                                                             {p.isVerifiedByAdmin && <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">Verified</span>}
//                                                         </div>
//                                                     ))}
//                                                 </div>
//                                             </div>
//                                         </td>
//                                         <td className="px-6 py-4 whitespace-nowrap">
//                                             <div className="text-sm text-gray-900">{getParticipantRoles(conversation.participants)}</div>
//                                         </td>
//                                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                                             <div className="flex items-center">
//                                                 <Calendar className="w-4 h-4 text-[#C9A94D] mr-2" />
//                                                 {formatDate(conversation.createdAt)}
//                                             </div>
//                                         </td>
//                                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                                             <div className="flex items-center">
//                                                 <Calendar className="w-4 h-4 text-[#C9A94D] mr-2" />
//                                                 {formatDate(conversation.updatedAt)}
//                                             </div>
//                                         </td>
//                                         <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                                             <button onClick={() => handleViewConversation(conversation._id)} className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-[#C9A94D] hover:bg-[#B89A45] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#C9A94D] transition-colors">
//                                                 <Eye className="w-4 h-4 mr-2" />
//                                                 View Conversation
//                                             </button>
//                                         </td>
//                                     </tr>
//                                 ))
//                             )}
//                         </tbody>
//                     </table>
//                 </div>

//                 {/* Pagination */}
//                 {totalPages > 0 && (
//                     <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
//                         <div className="flex justify-between items-center">
//                             {/* Results count */}
//                             <div className="text-gray-700 text-sm">
//                                 Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, totalConversations)} of {totalConversations} conversations
//                             </div>

//                             {/* Pagination controls */}
//                             <div className="flex items-center gap-2">
//                                 {/* Left Arrow */}
//                                 <button onClick={() => handlePageChange(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="p-2 text-[#C9A94D] hover:bg-[#C9A94D]/10 rounded-full disabled:opacity-50 disabled:cursor-not-allowed">
//                                     <ChevronLeft className="w-5 h-5" />
//                                 </button>

//                                 {/* Page numbers with ellipsis */}
//                                 {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((page) => {
//                                     if (page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
//                                         return (
//                                             <button key={page} onClick={() => handlePageChange(page)} className={`px-3 py-1 rounded-full font-medium text-sm ${currentPage === page ? "bg-[#C9A94D] text-white border border-[#C9A94D]" : "bg-transparent text-gray-700 border border-gray-300 hover:bg-[#C9A94D]/10"}`}>
//                                                 {page}
//                                             </button>
//                                         );
//                                     } else if (page === currentPage - 2 || page === currentPage + 2) {
//                                         return (
//                                             <span key={page} className="px-1 text-gray-500">
//                                                 ...
//                                             </span>
//                                         );
//                                     } else {
//                                         return null;
//                                     }
//                                 })}

//                                 {/* Right Arrow */}
//                                 <button onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className="p-2 text-[#C9A94D] hover:bg-[#C9A94D]/10 rounded-full disabled:opacity-50 disabled:cursor-not-allowed">
//                                     <ChevronRight className="w-5 h-5" />
//                                 </button>
//                             </div>

//                             {/* Items per page selector */}
//                             <div className="flex items-center gap-2">
//                                 <span className="text-sm text-gray-700">Show:</span>
//                                 <select
//                                     value={itemsPerPage}
//                                     onChange={(e) => {
//                                         setItemsPerPage(Number(e.target.value));
//                                         setCurrentPage(1);
//                                     }}
//                                     className="border border-gray-300 rounded px-2 py-1 text-sm"
//                                 >
//                                     <option value={10}>10</option>
//                                     <option value={20}>20</option>
//                                     <option value={50}>50</option>
//                                     <option value={100}>100</option>
//                                 </select>
//                             </div>
//                         </div>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default UserConversations;

"use client";
import { useFilterConversationsByUpdatedAtQuery } from "@/redux/features/messages/messageApi";
import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Eye, MessageSquare, Calendar, Phone, Mail, ChevronDown, Search } from "lucide-react";
import { useRouter } from "next/navigation";

const UserConversations = () => {
    const router = useRouter();
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(20);
    const [selectedFilter, setSelectedFilter] = useState("all");
    // const [searchQuery, setSearchQuery] = useState("");
    const [showFilterDropdown, setShowFilterDropdown] = useState(false);

    const { data, isLoading, error, refetch } = useFilterConversationsByUpdatedAtQuery({
        filter: selectedFilter,
        page: currentPage,
        limit: itemsPerPage,
    });

    const conversations = data?.data || [];
    const totalConversations = data?.meta?.total || 0;
    const totalPages = Math.ceil(totalConversations / itemsPerPage);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleFilterChange = (filter: string) => {
        setSelectedFilter(filter);
        setCurrentPage(1);
        setShowFilterDropdown(false);
    };

    const handleViewConversation = (conversationId: string) => {
        router.push(`/dashboard/messages/admin/${conversationId}`);
    };

    const filterOptions = [
        { label: "All", value: "all" },
        { label: "Last 24 Hours", value: "24h" },
        { label: "Last 7 Days", value: "7d" },
        { label: "Last 30 Days", value: "30d" },
        { label: "Last 6 Months", value: "6m" },
        { label: "Last Year", value: "1y" },
    ];

    if (isLoading) {
        return (
            <div className="w-full">
                <div className="container mx-auto">
                    <div className="text-[#C9A94D]">
                        <div className="mb-8">
                            <h1 className="font-bold text-[30px] mb-4">Conversations Dashboard</h1>
                            <p>Loading conversations...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full">
                <div className="container mx-auto">
                    <div className="text-[#C9A94D]">
                        <div className="mb-8">
                            <h1 className="font-bold text-[30px] mb-4">Conversations Dashboard</h1>
                            <p className="text-red-500">Failed to load conversations. Please try again.</p>
                            <button onClick={() => refetch()} className="mt-4 bg-[#C9A94D] text-white px-4 py-2 rounded-[12px] hover:bg-[#B89A42] transition-colors">
                                Retry
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const getParticipantNames = (participants: any[]) => {
        return participants.map((p) => p.name).join(" ↔ ");
    };

    const getParticipantRoles = (participants: any[]) => {
        return participants.map((p) => p.role).join(" / ");
    };

    return (
        <div className="w-full mt-10">
            <div className="container mx-auto">
                <div className="text-[#C9A94D]">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="font-bold text-[30px] mb-4">Message section</h1>
                        <p>View and manage all conversations in the system</p>
                    </div>

                    {/* Controls Section */}
                    <div className="mb-6 flex flex-col md:flex-row gap-4 items-start md:items-center">
                        {/* Filter Dropdown */}
                        <div className="relative">
                            <button onClick={() => setShowFilterDropdown(!showFilterDropdown)} className="flex items-center gap-2 rounded-[12px] text-white bg-[#C9A94D] border border-[#C9A94D] py-2 px-4 text-sm hover:bg-[#B89A42] transition-colors">
                                <span>Filter: {filterOptions.find((f) => f.value === selectedFilter)?.label}</span>
                                <ChevronDown className={`h-4 w-4 transition-transform ${showFilterDropdown ? "rotate-180" : ""}`} />
                            </button>

                            {showFilterDropdown && (
                                <div className="absolute top-full mt-1 w-48 bg-[#C9A94D] border border-[#C9A94D] rounded-lg shadow-lg z-10">
                                    {filterOptions.map((filter) => (
                                        <button key={filter.value} onClick={() => handleFilterChange(filter.value)} className={`w-full text-left px-4 py-2.5 hover:bg-[#B89A42] transition-colors text-white ${selectedFilter === filter.value ? "bg-[#B89A42]" : ""}`}>
                                            {filter.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Search Bar */}
                        {/* <div className="relative w-full md:w-64">
                            <input type="text" placeholder="Search conversations..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full rounded-[12px] text-white placeholder:text-white/80 bg-[#C9A94D] border border-[#C9A94D] py-2 pl-3 pr-10 text-sm focus:outline-none focus:ring-0" />
                            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white" />
                        </div> */}
                    </div>

                    {/* Table Container */}
                    <div className="bg-[#2D3546] rounded-2xl p-5">
                        {/* Table */}
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-white">
                                <thead>
                                    <tr className="border-b border-[#C9A94D]">
                                        <th className="py-3 px-4 text-left font-normal text-sm">Conversation ID</th>
                                        <th className="py-3 px-4 text-left font-normal text-sm">Participants</th>
                                        <th className="py-3 px-4 text-left font-normal text-sm">Roles</th>
                                        <th className="py-3 px-4 text-left font-normal text-sm">Created</th>
                                        <th className="py-3 px-4 text-left font-normal text-sm">Last Updated</th>
                                        <th className="py-3 px-4 text-left font-normal text-sm">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {conversations.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="py-8 px-4 text-center">
                                                <div className="flex flex-col items-center justify-center">
                                                    <MessageSquare className="h-12 w-12 text-[#C9A94D]/50 mb-3" />
                                                    <p className="text-white/80 text-lg mb-1">No conversations found</p>
                                                    <p className="text-white/60 text-sm">Try selecting a different filter</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        conversations.map((conversation: any, index: number) => (
                                            <tr key={conversation._id} className={`border-b border-white/10 ${index % 2 === 0 ? "" : "bg-white/5"} hover:bg-white/10 transition-colors`}>
                                                <td className="py-3 px-4">
                                                    <div className="flex items-center">
                                                        <MessageSquare className="w-4 h-4 text-[#C9A94D] mr-2" />
                                                        <span className="font-mono text-sm">{conversation._id.substring(0, 12)}...</span>
                                                    </div>
                                                </td>
                                                <td className="py-3 px-4">
                                                    <div className="space-y-1">
                                                        <div className="font-medium">{getParticipantNames(conversation.participants)}</div>
                                                        <div className="space-y-1">
                                                            {conversation.participants.map((p: any) => (
                                                                <div key={p._id} className="text-xs text-white/70 flex items-center gap-2">
                                                                    <Mail className="w-3 h-3" />
                                                                    <span>{p.email}</span>
                                                                    {p.phone && (
                                                                        <>
                                                                            <Phone className="w-3 h-3" />
                                                                            <span>{p.phone}</span>
                                                                        </>
                                                                    )}
                                                                    {/* {p.isVerifiedByAdmin && <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-500/20 text-green-300">Verified</span>} */}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-3 px-4">
                                                    <div className="text-sm">{getParticipantRoles(conversation.participants)}</div>
                                                </td>
                                                <td className="py-3 px-4">
                                                    <div className="flex items-center text-sm text-white/80">
                                                        <Calendar className="w-4 h-4 text-[#C9A94D] mr-2" />
                                                        {formatDate(conversation.createdAt)}
                                                    </div>
                                                </td>
                                                <td className="py-3 px-4">
                                                    <div className="flex items-center text-sm text-white/80">
                                                        <Calendar className="w-4 h-4 text-[#C9A94D] mr-2" />
                                                        {formatDate(conversation.updatedAt)}
                                                    </div>
                                                </td>
                                                <td className="py-3 px-4">
                                                    <button onClick={() => handleViewConversation(conversation._id)} className="inline-flex items-center px-3 py-1.5 bg-[#C9A94D] text-white text-sm rounded-lg hover:bg-[#B89A42] focus:outline-none transition-colors">
                                                        <Eye className="w-3 h-3 mr-1.5" />
                                                        View
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {totalPages > 0 && (
                            <div className="flex flex-col md:flex-row justify-between items-center mt-6 gap-4">
                                {/* Results count */}
                                <div className="text-white/80 text-sm">
                                    Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, totalConversations)} of {totalConversations} conversations
                                </div>

                                {/* Pagination controls */}
                                <div className="flex items-center gap-2">
                                    {/* Left Arrow */}
                                    <button onClick={() => handlePageChange(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="p-2 text-[#C9A94D] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                                        <ChevronLeft className="w-6 h-6" />
                                    </button>

                                    {/* Page numbers with ellipsis */}
                                    {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((page) => {
                                        if (page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
                                            return (
                                                <button key={page} onClick={() => handlePageChange(page)} className={`px-3 py-1 h-10 w-10 rounded-full text-sm font-medium transition-colors ${currentPage === page ? "bg-[#C9A94D] text-white border border-[#C9A94D]" : "text-white border border-[#C9A94D] hover:bg-[#C9A94D]/20"}`}>
                                                    {page}
                                                </button>
                                            );
                                        } else if (page === currentPage - 2 || page === currentPage + 2) {
                                            return (
                                                <span key={page} className="px-1 text-white/60">
                                                    ...
                                                </span>
                                            );
                                        }
                                        return null;
                                    })}

                                    {/* Right Arrow */}
                                    <button onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className="p-2 text-[#C9A94D] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                                        <ChevronRight className="w-6 h-6" />
                                    </button>
                                </div>

                                {/* Items per page selector */}
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-white/80">Show:</span>
                                    <select
                                        value={itemsPerPage}
                                        onChange={(e) => {
                                            setItemsPerPage(Number(e.target.value));
                                            setCurrentPage(1);
                                        }}
                                        className="rounded-[12px] text-white bg-[#C9A94D] border border-[#C9A94D] py-1 px-3 text-sm focus:outline-none focus:ring-0"
                                    >
                                        <option value={10}>10</option>
                                        <option value={20}>20</option>
                                        <option value={50}>50</option>
                                        <option value={100}>100</option>
                                    </select>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserConversations;

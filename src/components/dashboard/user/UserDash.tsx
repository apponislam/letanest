// "use client";
// import React, { useState } from "react";
// import { ChevronLeft, ChevronRight, Search } from "lucide-react";
// import PageHeader from "@/components/PageHeader";
// import UserAction from "./ViewUser";
// import { useGetAllUsersQuery } from "@/redux/features/users/usersApi";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// const UserDash = () => {
//     const [search, setSearch] = useState("");
//     const [currentPage, setCurrentPage] = useState(1);
//     const [roleFilter, setRoleFilter] = useState<string>("");
//     const itemsPerPage = 10;

//     // Use RTK Query to fetch users
//     const {
//         data: usersData,
//         isLoading,
//         error,
//     } = useGetAllUsersQuery({
//         page: currentPage,
//         limit: itemsPerPage,
//         search: search,
//         role: roleFilter,
//     });

//     const users = usersData?.data || [];
//     const totalUsers = usersData?.meta?.total || 0;
//     const totalPages = Math.ceil(totalUsers / itemsPerPage);

//     const handlePageChange = (page: number) => {
//         setCurrentPage(page);
//     };

//     const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         setSearch(e.target.value);
//         setCurrentPage(1);
//     };

//     const handleRoleFilterChange = (value: string) => {
//         setRoleFilter(value === "all" ? "" : value);
//         setCurrentPage(1);
//     };

//     // Calculate serial number for each user
//     const getSerialNumber = (index: number) => {
//         return (currentPage - 1) * itemsPerPage + index + 1;
//     };

//     // Format date
//     const formatDate = (dateString?: string) => {
//         if (!dateString) return "N/A";
//         return new Date(dateString).toLocaleDateString();
//     };

//     if (error) {
//         return (
//             <div className="w-full">
//                 <div className="container mx-auto">
//                     <PageHeader title={"User Dashboard"} />
//                     <div className="text-red-500 text-center p-8">Error loading users. Please try again later.</div>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className="w-full">
//             <div className="container mx-auto">
//                 <PageHeader title={"User Dashboard"} />
//                 <div className="text-[#C9A94D]">
//                     <div className="mb-8 flex justify-between flex-col md:flex-row gap-4">
//                         <div>
//                             <h1 className="font-bold text-[30px] mb-4">Admin Dashboard</h1>
//                             <p>Welcome back, Admin! Here's what's happening with your users.</p>
//                         </div>
//                     </div>

//                     <div className="gap-5 bg-[#2D3546] rounded-2xl p-5">
//                         <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
//                             <div className="flex flex-col md:flex-row gap-4">
//                                 <Select value={roleFilter || "all"} onValueChange={handleRoleFilterChange}>
//                                     <SelectTrigger className="rounded-[12px] text-white bg-[#C9A94D] border border-[#C9A94D] py-2 px-3 text-sm focus:outline-none focus:ring-0">
//                                         <SelectValue placeholder="All Roles" />
//                                     </SelectTrigger>
//                                     <SelectContent className="bg-[#C9A94D] text-white">
//                                         <SelectItem value="all">All Roles</SelectItem>
//                                         <SelectItem value="GUEST">Guest</SelectItem>
//                                         <SelectItem value="HOST">Host</SelectItem>
//                                         <SelectItem value="ADMIN">Admin</SelectItem>
//                                     </SelectContent>
//                                 </Select>
//                             </div>

//                             <div className="relative w-36 transition-all duration-300 focus-within:w-80">
//                                 <input type="text" placeholder="Search..." value={search} onChange={handleSearchChange} className="w-full rounded-[12px] text-white placeholder:text-white bg-[#C9A94D] border border-[#C9A94D] py-2 pl-3 pr-10 text-sm focus:outline-none focus:ring-0" />
//                                 <Search className="absolute right-2 top-1/2 -translate-y-1/2 h-5 w-5 text-white" />
//                             </div>
//                         </div>

//                         {/* User Table */}
//                         <div className="w-full">
//                             <div className="overflow-x-auto w-full rounded-[4px] border border-[#B6BAC3]">
//                                 <table className="min-w-full text-white w-max">
//                                     <thead className="bg-[#14213D] text-white">
//                                         <tr>
//                                             <th className="py-3 px-6 text-left font-normal">#</th>
//                                             <th className="py-3 px-6 text-left font-normal">Name</th>
//                                             <th className="py-3 px-6 text-left font-normal">Email</th>
//                                             <th className="py-3 px-6 text-left font-normal">Role</th>
//                                             <th className="py-3 px-6 text-left font-normal">Phone</th>
//                                             <th className="py-3 px-6 text-left font-normal">Created At</th>
//                                             <th className="py-3 px-6 text-left font-normal">Action</th>
//                                         </tr>
//                                     </thead>
//                                     <tbody className="divide-y divide-gray-300">
//                                         {isLoading ? (
//                                             <tr>
//                                                 <td colSpan={7} className="py-4 px-6 text-center text-gray-300">
//                                                     Loading users...
//                                                 </td>
//                                             </tr>
//                                         ) : users.length > 0 ? (
//                                             users.map((user, index) => (
//                                                 <tr key={user._id} className="hover:bg-[#C9A94D]/20">
//                                                     <td className="py-3 px-6 font-normal">{getSerialNumber(index)}</td>
//                                                     <td className="py-3 px-6 font-normal">{user.name}</td>
//                                                     <td className="py-3 px-6 font-normal">{user.email}</td>
//                                                     <td className="py-3 px-6 font-normal">
//                                                         <span className={`px-2 py-1 rounded-full text-xs ${user.role === "ADMIN" ? "bg-red-500" : user.role === "HOST" ? "bg-blue-500" : "bg-green-500"}`}>{user.role}</span>
//                                                     </td>
//                                                     <td className="py-3 px-6 font-normal">{user.phone || "N/A"}</td>
//                                                     <td className="py-3 px-6 font-normal">{formatDate(user.createdAt)}</td>
//                                                     <td className="py-3 px-6 font-normal text-center">
//                                                         <UserAction user={user} />
//                                                     </td>
//                                                 </tr>
//                                             ))
//                                         ) : (
//                                             <tr>
//                                                 <td colSpan={7} className="py-4 px-6 text-center text-gray-300">
//                                                     No users found
//                                                 </td>
//                                             </tr>
//                                         )}
//                                     </tbody>
//                                 </table>
//                             </div>
//                         </div>

//                         {/* Pagination - Fixed data access */}
//                         {totalPages > 0 && (
//                             <div className="flex justify-between items-center mt-6 gap-2">
//                                 {/* Results count */}
//                                 <div className="text-white text-sm">
//                                     Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, totalUsers)} of {totalUsers} users
//                                 </div>

//                                 {/* Pagination controls */}
//                                 <div className="flex items-center gap-2">
//                                     {/* Left Arrow */}
//                                     <button onClick={() => handlePageChange(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="p-2 text-[#C9A94D] disabled:opacity-50 disabled:cursor-not-allowed">
//                                         <ChevronLeft className="w-8 h-8" />
//                                     </button>

//                                     {/* Page numbers with ellipsis */}
//                                     {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((page) => {
//                                         if (page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
//                                             return (
//                                                 <button key={page} onClick={() => handlePageChange(page)} className={`px-4 py-2 rounded-full font-medium ${currentPage === page ? "bg-[#C9A94D] text-white border border-[#C9A94D]" : "bg-transparent text-white border border-[#C9A94D] hover:bg-[#C9A94D]/20"}`}>
//                                                     {page}
//                                                 </button>
//                                             );
//                                         } else if (page === currentPage - 2 || page === currentPage + 2) {
//                                             return (
//                                                 <span key={page} className="px-2 text-white">
//                                                     ...
//                                                 </span>
//                                             );
//                                         } else {
//                                             return null;
//                                         }
//                                     })}

//                                     {/* Right Arrow */}
//                                     <button onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className="p-2 text-[#C9A94D] disabled:opacity-50 disabled:cursor-not-allowed">
//                                         <ChevronRight className="w-8 h-8" />
//                                     </button>
//                                 </div>
//                             </div>
//                         )}
//                         <div className="bg-white">
//                             <h1>Here Donwnload Button and fields</h1>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default UserDash;

"use client";
import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Search, Download } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import UserAction from "./ViewUser";
import { useGetAllUsersQuery, useDownloadUsersExcelMutation } from "@/redux/features/users/usersApi";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const UserDash = () => {
    const router = useRouter();
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [roleFilter, setRoleFilter] = useState<string>("");
    const [downloadMonth, setDownloadMonth] = useState<string>("all");
    const [downloadYear, setDownloadYear] = useState<string>(new Date().getFullYear().toString());
    const itemsPerPage = 10;

    // Use RTK Query to fetch users
    const {
        data: usersData,
        isLoading,
        error,
    } = useGetAllUsersQuery({
        page: currentPage,
        limit: itemsPerPage,
        search: search,
        role: roleFilter,
    });

    // Download Excel mutation
    const [downloadUsersExcel, { isLoading: isDownloading }] = useDownloadUsersExcelMutation();

    const users = usersData?.data || [];
    const totalUsers = usersData?.meta?.total || 0;
    const totalPages = Math.ceil(totalUsers / itemsPerPage);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        setCurrentPage(1);
    };

    const handleRoleFilterChange = (value: string) => {
        setRoleFilter(value === "all" ? "" : value);
        setCurrentPage(1);
    };

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
            };

            await downloadUsersExcel(downloadParams).unwrap();
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
                toast.error("No users found for the selected period");
            } else {
                toast.error(error?.message || "Failed to download Excel file");
            }
        }
    };

    // Calculate serial number for each user
    const getSerialNumber = (index: number) => {
        return (currentPage - 1) * itemsPerPage + index + 1;
    };

    // Format date
    const formatDate = (dateString?: string) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString();
    };

    // Generate years for dropdown (last 10 years)
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 11 }, (_, i) => currentYear - i);

    const handleViewConversation = (userId?: string) => {
        if (userId) {
            router.push(`/dashboard/user/${userId}`);
        } else {
            toast.error("No conversation available");
        }
    };

    if (error) {
        return (
            <div className="w-full">
                <div className="container mx-auto">
                    <PageHeader title={"User Dashboard"} />
                    <div className="text-red-500 text-center p-8">Error loading users. Please try again later.</div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full">
            <div className="container mx-auto">
                <PageHeader title={"User Dashboard"} />
                <div className="text-[#C9A94D]">
                    <div className="mb-8 flex justify-between flex-col md:flex-row gap-4">
                        <div>
                            <h1 className="font-bold text-[30px] mb-4">Admin Dashboard</h1>
                            <p>Welcome back, Admin! Here's what's happening with your users.</p>
                        </div>
                    </div>

                    <div className="gap-5 bg-[#2D3546] rounded-2xl p-5">
                        <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
                            <div className="flex flex-col md:flex-row gap-4">
                                <Select value={roleFilter || "all"} onValueChange={handleRoleFilterChange}>
                                    <SelectTrigger className="rounded-[12px] text-white bg-[#C9A94D] border border-[#C9A94D] py-2 px-3 text-sm focus:outline-none focus:ring-0">
                                        <SelectValue placeholder="All Roles" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-[#C9A94D] text-white">
                                        <SelectItem value="all">All Roles</SelectItem>
                                        <SelectItem value="GUEST">Guest</SelectItem>
                                        <SelectItem value="HOST">Host</SelectItem>
                                        <SelectItem value="ADMIN">Admin</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="relative w-36 transition-all duration-300 focus-within:w-80">
                                <input type="text" placeholder="Search..." value={search} onChange={handleSearchChange} className="w-full rounded-[12px] text-white placeholder:text-white bg-[#C9A94D] border border-[#C9A94D] py-2 pl-3 pr-10 text-sm focus:outline-none focus:ring-0" />
                                <Search className="absolute right-2 top-1/2 -translate-y-1/2 h-5 w-5 text-white" />
                            </div>
                        </div>

                        {/* User Table */}
                        <div className="w-full">
                            <div className="overflow-x-auto w-full rounded-[4px] border border-[#B6BAC3]">
                                <table className="min-w-full text-white w-max">
                                    <thead className="bg-[#14213D] text-white">
                                        <tr>
                                            <th className="py-3 px-6 text-left font-normal">#</th>
                                            <th className="py-3 px-6 text-left font-normal">Name</th>
                                            <th className="py-3 px-6 text-left font-normal">Email</th>
                                            <th className="py-3 px-6 text-left font-normal">Role</th>
                                            <th className="py-3 px-6 text-left font-normal">Phone</th>
                                            <th className="py-3 px-6 text-left font-normal">Created At</th>
                                            <th className="py-3 px-6 text-left font-normal">Messages</th>
                                            <th className="py-3 px-6 text-left font-normal">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-300">
                                        {isLoading ? (
                                            <tr>
                                                <td colSpan={7} className="py-4 px-6 text-center text-gray-300">
                                                    Loading users...
                                                </td>
                                            </tr>
                                        ) : users.length > 0 ? (
                                            users.map((user, index) => (
                                                <tr key={user._id} className="hover:bg-[#C9A94D]/20">
                                                    <td className="py-3 px-6 font-normal">{getSerialNumber(index)}</td>
                                                    <td className="py-3 px-6 font-normal">{user.name}</td>
                                                    <td className="py-3 px-6 font-normal">{user.email}</td>
                                                    <td className="py-3 px-6 font-normal">
                                                        <span className={`px-2 py-1 rounded-full text-xs ${user.role === "ADMIN" ? "bg-red-500" : user.role === "HOST" ? "bg-blue-500" : "bg-green-500"}`}>{user.role}</span>
                                                    </td>
                                                    <td className="py-3 px-6 font-normal">{user.phone || "N/A"}</td>
                                                    <td className="py-3 px-6 font-normal">{formatDate(user.createdAt)}</td>
                                                    <td className="cursor-pointer" onClick={() => handleViewConversation(user?._id)}>
                                                        View Conversations
                                                    </td>
                                                    <td className="py-3 px-6 font-normal text-center cursor-pointer">
                                                        <UserAction user={user} />
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={7} className="py-4 px-6 text-center text-gray-300">
                                                    No users found
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Pagination */}
                        {totalPages > 0 && (
                            <div className="flex justify-between items-center mt-6 gap-2">
                                {/* Results count */}
                                <div className="text-white text-sm">
                                    Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, totalUsers)} of {totalUsers} users
                                </div>

                                {/* Pagination controls */}
                                <div className="flex items-center gap-2">
                                    {/* Left Arrow */}
                                    <button onClick={() => handlePageChange(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="p-2 text-[#C9A94D] disabled:opacity-50 disabled:cursor-not-allowed">
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
                                    <button onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className="p-2 text-[#C9A94D] disabled:opacity-50 disabled:cursor-not-allowed">
                                        <ChevronRight className="w-8 h-8" />
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Download Section */}
                        <div className="flex flex-col md:flex-row gap-4 items-end justify-end mt-6">
                            {/* Month Select */}
                            <Select value={downloadMonth} onValueChange={setDownloadMonth}>
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
                            <Select value={downloadYear} onValueChange={setDownloadYear}>
                                <SelectTrigger className="rounded-[12px] text-white bg-[#C9A94D] border border-[#C9A94D] py-2 px-3 text-sm focus:outline-none focus:ring-0 w-full md:w-auto">
                                    <SelectValue placeholder="Year" />
                                </SelectTrigger>
                                <SelectContent className="bg-[#C9A94D] text-white">
                                    {years.map((year) => (
                                        <SelectItem key={year} value={year.toString()}>
                                            {year}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Button onClick={handleDownloadExcel} disabled={isDownloading || !downloadYear} className="bg-[#C9A94D] text-white hover:bg-[#B89A42] rounded-[12px] py-2 px-6 flex items-center gap-2 whitespace-nowrap w-full md:w-auto">
                                <Download className="w-4 h-4" />
                                {isDownloading ? "Downloading..." : "Download"}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserDash;

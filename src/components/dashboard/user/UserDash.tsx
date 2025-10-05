// "use client";
// import React, { useEffect, useState } from "react";
// import { ChevronLeft, ChevronRight, Search, TrendingUp } from "lucide-react";
// import Image from "next/image";
// import { User } from "@/types/user";
// import UserAction from "./ViewUser";
// import PageHeader from "@/components/PageHeader";

// const UserDash = () => {
//     const [users, setUsers] = useState<User[]>([]);
//     const [search, setSearch] = useState("");
//     const [currentPage, setCurrentPage] = useState(1);
//     const itemsPerPage = 10; // adjust per page

//     useEffect(() => {
//         fetch("/data/users.json")
//             .then((res) => res.json())
//             .then((data) => setUsers(data.data))
//             .catch((err) => console.error(err));
//     }, []);

//     const filteredUsers = users.filter((user) => user.userId.toLowerCase().includes(search.toLowerCase()) || user.name.toLowerCase().includes(search.toLowerCase()) || user.email.toLowerCase().includes(search.toLowerCase()) || user.propertyType.toLowerCase().includes(search.toLowerCase()) || user.phone.toLowerCase().includes(search.toLowerCase()));

//     const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
//     const displayedUsers = filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

//     const handlePageChange = (page: number) => {
//         setCurrentPage(page);
//     };

//     return (
//         <div className="w-full">
//             <div className="container mx-auto">
//                 <PageHeader title={"User Dashboard"}></PageHeader>
//                 <div className="text-[#C9A94D]">
//                     <div className="mb-8 flex justify-between flex-col md:flex-row gap-4">
//                         <div>
//                             <h1 className="font-bold text-[30px] mb-4">Admin Dashboard</h1>
//                             <p>Welcome back, John ! Here’s what’s happening with your account.</p>
//                         </div>
//                     </div>

//                     {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
//                         <div className=" border border-[#C9A94D] bg-[#2D3546] rounded-2xl p-5">
//                             <div className="flex items-center justify-between gap-5 flex-col md:flex-row mb-7">
//                                 <div>
//                                     <p className="mb-4">Total User</p>
//                                     <h1 className="text-[26px] font-bold text-center md:text-left">40,689</h1>
//                                 </div>
//                                 <Image src="/dashboard/admin/users.png" alt="Total Booking" width={42} height={42}></Image>
//                             </div>
//                             <div className="flex items-center gap-2">
//                                 <TrendingUp className="h-5 w-5 text-[#00B69B]" />
//                                 <p className="text-white">
//                                     <span className="text-[#00B69B]">8.5%</span> Up from yesterday
//                                 </p>
//                             </div>
//                         </div>
//                         <div className=" border border-[#C9A94D] bg-[#2D3546] rounded-2xl p-5">
//                             <div className="flex items-center justify-between gap-5 flex-col md:flex-row mb-7">
//                                 <div>
//                                     <p className="mb-4">Revenue</p>
//                                     <h1 className="text-[26px] font-bold text-center md:text-left">40,689</h1>
//                                 </div>
//                                 <Image src="/dashboard/admin/revenue.png" alt="Total Booking" width={42} height={42}></Image>
//                             </div>
//                             <div className="flex items-center gap-2">
//                                 <TrendingUp className="h-5 w-5 text-[#00B69B]" />
//                                 <p className="text-white">
//                                     <span className="text-[#00B69B]">8.5%</span> Up from yesterday
//                                 </p>
//                             </div>
//                         </div>
//                         <div className=" border border-[#C9A94D] bg-[#2D3546] rounded-2xl p-5">
//                             <div className="flex items-center justify-between gap-5 flex-col md:flex-row mb-7">
//                                 <div>
//                                     <p className="mb-4">Total Properties</p>
//                                     <h1 className="text-[26px] font-bold text-center md:text-left">40,689</h1>
//                                 </div>
//                                 <Image src="/dashboard/admin/calender.png" alt="Total Booking" width={42} height={42}></Image>
//                             </div>
//                             <div className="flex items-center gap-2">
//                                 <TrendingUp className="h-5 w-5 text-[#00B69B]" />
//                                 <p className="text-white">
//                                     <span className="text-[#00B69B]">8.5%</span> Up from yesterday
//                                 </p>
//                             </div>
//                         </div>
//                     </div> */}

//                     <div className=" gap-5  bg-[#2D3546] rounded-2xl p-5">
//                         <div className="flex justify-end mb-4">
//                             <div className="relative w-36 transition-all duration-300 focus-within:w-80">
//                                 <input type="text" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full rounded-[12px] text-white placeholder:text-white bg-[#C9A94D] border border-[#C9A94D] py-2 pl-3 pr-10 text-sm focus:outline-none focus:ring-0" />
//                                 <Search className="absolute right-2 top-1/2 -translate-y-1/2 h-5 w-5 text-white" />
//                             </div>
//                         </div>

//                         {/* User Table */}
//                         <div className="w-full">
//                             <div className="overflow-x-auto w-full rounded-[4px] border border-[#B6BAC3]">
//                                 <table className="min-w-full text-white w-max">
//                                     <thead className="bg-[#14213D] text-white">
//                                         <tr>
//                                             <th className="py-3 px-6 text-left font-normal">User Id</th>
//                                             <th className="py-3 px-6 text-left font-normal">Name</th>
//                                             <th className="py-3 px-6 text-left font-normal">Email</th>
//                                             <th className="py-3 px-6 text-left font-normal">Property Type</th>
//                                             <th className="py-3 px-6 text-left font-normal">Phone</th>
//                                             <th className="py-3 px-6 text-left font-normal">Action</th>
//                                         </tr>
//                                     </thead>
//                                     <tbody className="divide-y divide-gray-300">
//                                         {displayedUsers.map((user) => (
//                                             <tr key={user.id} className="hover:bg-[#C9A94D]/20">
//                                                 <td className="py-3 px-6 font-normal">{user.userId}</td>
//                                                 <td className="py-3 px-6 font-normal">{user.name}</td>
//                                                 <td className="py-3 px-6 font-normal">{user.email}</td>
//                                                 <td className="py-3 px-6 font-normal">{user.propertyType}</td>
//                                                 <td className="py-3 px-6 font-normal">{user.phone}</td>
//                                                 <td className="py-3 px-6 font-normal text-center">
//                                                     {/* Eye button that triggers popover */}
//                                                     <UserAction user={user} />
//                                                 </td>
//                                             </tr>
//                                         ))}
//                                         {displayedUsers.length === 0 && (
//                                             <tr>
//                                                 <td colSpan={5} className="py-3 px-6 text-center text-gray-300">
//                                                     No users found
//                                                 </td>
//                                             </tr>
//                                         )}
//                                     </tbody>
//                                 </table>
//                             </div>
//                         </div>

//                         {/* Pagination */}
//                         <div className="flex justify-end items-center mt-6 gap-2">
//                             {/* Left Arrow */}
//                             <button onClick={() => handlePageChange(Math.max(1, currentPage - 1))} className="p-2 text-[#C9A94D]">
//                                 <ChevronLeft className="w-8 h-8" />
//                             </button>

//                             {/* Page numbers with ellipsis */}
//                             {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((page) => {
//                                 if (page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
//                                     return (
//                                         <button key={page} onClick={() => handlePageChange(page)} className={`px-4 py-2 rounded-full font-medium ${currentPage === page ? "bg-[#C9A94D] text-white border border-[#C9A94D]" : "bg-transparent text-white border border-[#C9A94D] hover:bg-[#C9A94D]/20"}`}>
//                                             {page}
//                                         </button>
//                                     );
//                                 } else if (page === currentPage - 2 || page === currentPage + 2) {
//                                     return (
//                                         <span key={page} className="px-2 text-white">
//                                             ...
//                                         </span>
//                                     );
//                                 } else {
//                                     return null;
//                                 }
//                             })}

//                             {/* Right Arrow */}
//                             <button onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))} className="p-2 text-[#C9A94D]">
//                                 <ChevronRight className="w-8 h-8" />
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default UserDash;

"use client";
import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import UserAction from "./ViewUser";
import { useGetAllUsersQuery } from "@/redux/features/users/usersApi";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const UserDash = () => {
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [roleFilter, setRoleFilter] = useState<string>("");
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

    console.log(usersData);
    const users = usersData?.data || [];
    const totalUsers = usersData?.total || 0;
    const totalPages = usersData ? Math.ceil(totalUsers / itemsPerPage) : 0;

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        setCurrentPage(1); // Reset to first page when searching
    };

    const handleRoleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setRoleFilter(e.target.value);
        setCurrentPage(1); // Reset to first page when filtering
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
                        {/* Search and Filter Section */}
                        {/* <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
                            <div className="flex flex-col md:flex-row gap-4">
                            
                                <select value={roleFilter} onChange={handleRoleFilterChange} className="rounded-[12px] text-white bg-[#C9A94D] border border-[#C9A94D] py-2 px-3 text-sm focus:outline-none focus:ring-0">
                                    <option value="">All Roles</option>
                                    <option value="GUEST">Guest</option>
                                    <option value="HOST">Host</option>
                                    <option value="ADMIN">Admin</option>
                                </select>
                            </div>

                            <div className="relative w-full md:w-80 transition-all duration-300">
                                <input type="text" placeholder="Search by name or email..." value={search} onChange={handleSearchChange} className="w-full rounded-[12px] text-white placeholder:text-white bg-[#C9A94D] border border-[#C9A94D] py-2 pl-3 pr-10 text-sm focus:outline-none focus:ring-0" />
                                <Search className="absolute right-2 top-1/2 -translate-y-1/2 h-5 w-5 text-white" />
                            </div>
                        </div> */}
                        <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
                            <div className="flex flex-col md:flex-row gap-4">
                                <Select value={roleFilter || "all"} onValueChange={(value) => handleRoleFilterChange({ target: { value: value === "all" ? "" : value } } as React.ChangeEvent<HTMLSelectElement>)}>
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

                            {/* <div className="relative w-full md:w-80 transition-all duration-300">
                                <input type="text" placeholder="Search by name or email..." value={search} onChange={handleSearchChange} className="w-full rounded-[12px] text-white placeholder:text-white bg-[#C9A94D] border border-[#C9A94D] py-2 pl-3 pr-10 text-sm focus:outline-none focus:ring-0" />
                                <Search className="absolute right-2 top-1/2 -translate-y-1/2 h-5 w-5 text-white" />
                            </div> */}
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
                                                    <td className="py-3 px-6 font-normal text-center">
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
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserDash;

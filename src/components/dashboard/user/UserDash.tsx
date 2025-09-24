"use client";
import React, { useEffect, useState } from "react";
import { Host } from "@/types/host";
import { ArrowLeft, ChevronLeft, ChevronRight, Search, TrendingUp } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { User } from "@/types/user";
import UserAction from "./ViewUser";

const UserDash = () => {
    const router = useRouter();

    const [users, setUsers] = useState<User[]>([]);
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10; // adjust per page

    useEffect(() => {
        fetch("/data/users.json")
            .then((res) => res.json())
            .then((data) => setUsers(data.data))
            .catch((err) => console.error(err));
    }, []);

    const filteredUsers = users.filter((user) => user.userId.toLowerCase().includes(search.toLowerCase()) || user.name.toLowerCase().includes(search.toLowerCase()) || user.email.toLowerCase().includes(search.toLowerCase()) || user.propertyType.toLowerCase().includes(search.toLowerCase()) || user.phone.toLowerCase().includes(search.toLowerCase()));

    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
    const displayedUsers = filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleClick = () => {
        router.back();
    };

    const [host, setHost] = useState<Host | null>(null);

    useEffect(() => {
        const fetchHost = async () => {
            try {
                const res = await fetch("/data/host.json");
                const data: Host[] = await res.json();
                setHost(data[0]);
            } catch (error) {
                console.error("Failed to fetch host:", error);
            }
        };

        fetchHost();
    }, []);

    if (!host) return <p>Loading...</p>;

    return (
        <div className="w-full">
            <div className="container mx-auto">
                <div className="p-5 border border-[#C9A94D] flex justify-between items-center mb-6 flex-col md:flex-row gap-4">
                    <div className="text-[#C9A94D] flex items-center gap-3 text-[18px] cursor-pointer hover:underline" onClick={handleClick}>
                        <ArrowLeft />
                        <p>Back To Previous</p>
                    </div>
                    <h1 className="text-2xl text-[#C9A94D]">Dashboard</h1>
                    <div className="flex items-center gap-2">
                        <Image src={host.image} alt={host.name} width={30} height={30} className="rounded-full border-[0.3px] border-[#C9A94D] object-cover" />
                        <div className="text-[#C9A94D] text-[18px]">{host.role}</div>
                    </div>
                </div>
                <div className="text-[#C9A94D]">
                    <div className="mb-8 flex justify-between flex-col md:flex-row gap-4">
                        <div>
                            <h1 className="font-bold text-[30px] mb-4">Admin Dashboard</h1>
                            <p>Welcome back, John ! Here’s what’s happening with your account.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                        <div className=" border border-[#C9A94D] bg-[#2D3546] rounded-2xl p-5">
                            <div className="flex items-center justify-between gap-5 flex-col md:flex-row mb-7">
                                <div>
                                    <p className="mb-4">Total User</p>
                                    <h1 className="text-[26px] font-bold text-center md:text-left">40,689</h1>
                                </div>
                                <Image src="/dashboard/admin/users.png" alt="Total Booking" width={42} height={42}></Image>
                            </div>
                            <div className="flex items-center gap-2">
                                <TrendingUp className="h-5 w-5 text-[#00B69B]" />
                                <p className="text-white">
                                    <span className="text-[#00B69B]">8.5%</span> Up from yesterday
                                </p>
                            </div>
                        </div>
                        <div className=" border border-[#C9A94D] bg-[#2D3546] rounded-2xl p-5">
                            <div className="flex items-center justify-between gap-5 flex-col md:flex-row mb-7">
                                <div>
                                    <p className="mb-4">Revenue</p>
                                    <h1 className="text-[26px] font-bold text-center md:text-left">40,689</h1>
                                </div>
                                <Image src="/dashboard/admin/revenue.png" alt="Total Booking" width={42} height={42}></Image>
                            </div>
                            <div className="flex items-center gap-2">
                                <TrendingUp className="h-5 w-5 text-[#00B69B]" />
                                <p className="text-white">
                                    <span className="text-[#00B69B]">8.5%</span> Up from yesterday
                                </p>
                            </div>
                        </div>
                        <div className=" border border-[#C9A94D] bg-[#2D3546] rounded-2xl p-5">
                            <div className="flex items-center justify-between gap-5 flex-col md:flex-row mb-7">
                                <div>
                                    <p className="mb-4">Total Properties</p>
                                    <h1 className="text-[26px] font-bold text-center md:text-left">40,689</h1>
                                </div>
                                <Image src="/dashboard/admin/calender.png" alt="Total Booking" width={42} height={42}></Image>
                            </div>
                            <div className="flex items-center gap-2">
                                <TrendingUp className="h-5 w-5 text-[#00B69B]" />
                                <p className="text-white">
                                    <span className="text-[#00B69B]">8.5%</span> Up from yesterday
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className=" gap-5  bg-[#2D3546] rounded-2xl p-5">
                        {/* <div className="flex justify-end">
                        <div className="relative w-64">
                            <input type="text" placeholder="Search..." className="w-full rounded-[12px] text-white placeholder:text-white bg-[#C9A94D] border border-[#C9A94D] py-2 pl-3 pr-10 text-sm focus:outline-none focus:ring-0 focus:ring-none" />
                            <Search className="absolute right-2 top-1/2 -translate-y-1/2 h-5 w-5 text-white" />
                        </div>
                    </div> */}
                        <div className="flex justify-end mb-4">
                            <div className="relative w-36 transition-all duration-300 focus-within:w-80">
                                <input type="text" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full rounded-[12px] text-white placeholder:text-white bg-[#C9A94D] border border-[#C9A94D] py-2 pl-3 pr-10 text-sm focus:outline-none focus:ring-0" />
                                <Search className="absolute right-2 top-1/2 -translate-y-1/2 h-5 w-5 text-white" />
                            </div>
                        </div>

                        {/* User Table */}
                        <div className="w-full">
                            <div className="overflow-x-auto w-full rounded-[4px] border border-[#B6BAC3]">
                                <table className="min-w-full text-white w-max">
                                    <thead className="bg-[#14213D] text-white">
                                        <tr>
                                            <th className="py-3 px-6 text-left font-normal">User Id</th>
                                            <th className="py-3 px-6 text-left font-normal">Name</th>
                                            <th className="py-3 px-6 text-left font-normal">Email</th>
                                            <th className="py-3 px-6 text-left font-normal">Property Type</th>
                                            <th className="py-3 px-6 text-left font-normal">Phone</th>
                                            <th className="py-3 px-6 text-left font-normal">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-300">
                                        {displayedUsers.map((user) => (
                                            <tr key={user.id} className="hover:bg-[#C9A94D]/20">
                                                <td className="py-3 px-6 font-normal">{user.userId}</td>
                                                <td className="py-3 px-6 font-normal">{user.name}</td>
                                                <td className="py-3 px-6 font-normal">{user.email}</td>
                                                <td className="py-3 px-6 font-normal">{user.propertyType}</td>
                                                <td className="py-3 px-6 font-normal">{user.phone}</td>
                                                <td className="py-3 px-6 font-normal text-center">
                                                    {/* Eye button that triggers popover */}
                                                    <UserAction user={user} />
                                                </td>
                                            </tr>
                                        ))}
                                        {displayedUsers.length === 0 && (
                                            <tr>
                                                <td colSpan={5} className="py-3 px-6 text-center text-gray-300">
                                                    No users found
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Pagination */}
                        <div className="flex justify-end items-center mt-6 gap-2">
                            {/* Left Arrow */}
                            <button onClick={() => handlePageChange(Math.max(1, currentPage - 1))} className="p-2 text-[#C9A94D]">
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
                            <button onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))} className="p-2 text-[#C9A94D]">
                                <ChevronRight className="w-8 h-8" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserDash;

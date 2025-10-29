"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useGetPaymentsByPropertyQuery } from "@/redux/features/propertyPayment/propertyPaymentApi";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const Avatar = ({ name, size = 32, className = "" }: { name: string; size?: number; className?: string }) => {
    const getInitials = (fullName: string) => {
        return fullName
            .split(" ")
            .map((part) => part.charAt(0))
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    const getBackgroundColor = (fullName: string) => {
        const colors = ["bg-[#C9A94D]", "bg-[#14213D]", "bg-[#9399A6]", "bg-[#434D64]", "bg-[#B89A45]", "bg-[#080E1A]"];
        const index = fullName.length % colors.length;
        return colors[index];
    };

    return (
        <div className={`rounded-full border-2 border-white flex items-center justify-center text-white font-semibold ${getBackgroundColor(name)} ${className}`} style={{ width: size, height: size }}>
            {getInitials(name)}
        </div>
    );
};

export default function ActiveListingBooked() {
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const params = useParams();
    const { id } = params;
    const limit = 10;

    const { data, isLoading, error } = useGetPaymentsByPropertyQuery({
        propertyId: id as string,
        params: {
            page,
            limit,
            search: searchTerm || undefined,
        },
    });

    const payments = data?.data || [];
    const meta = data?.meta;
    const totalPages = meta?.total ? Math.ceil(meta.total / limit) : 0;

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        setPage(1);
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

    if (isLoading) {
        return (
            <div className="container mx-auto md:p-6">
                <div className="text-center py-8 text-[#C9A94D]">Loading completed bookings...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto md:p-6">
                <div className="text-center py-8 text-red-500">Error loading bookings</div>
            </div>
        );
    }

    return (
        <div className="container mx-auto md:p-6">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold text-[#C9A94D]">Completed Bookings</h1>
                <div className="text-white">
                    Property ID: <span className="text-[#C9A94D] font-bold">{id}</span>
                </div>
            </div>

            <div className="bg-[#2D3546] border border-[#C9A94D] rounded-[20px] p-6">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold text-[#C9A94D]">Completed Booking History</h2>
                    <div className="text-white">
                        Total: <span className="text-[#C9A94D] font-bold">{meta?.total || 0}</span>
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
                        Showing {payments.length} of {meta?.total || 0} completed bookings
                    </div>
                    <div className="text-white text-sm">
                        Page {page} of {totalPages}
                    </div>
                </div>

                {/* Search Bar */}
                <div className="mb-4">
                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#C9A94D]" />
                        <Input type="text" placeholder="Search by guest name..." value={searchTerm} onChange={handleSearch} className="pl-10 pr-10 bg-transparent border-[#C9A94D] text-white placeholder:text-gray-300 focus:ring-[#C9A94D] focus:border-[#C9A94D]" />
                        {searchTerm && (
                            <button onClick={clearSearch} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white">
                                ×
                            </button>
                        )}
                    </div>
                </div>

                {payments.length === 0 ? (
                    <div className="text-center py-8 text-[#C9A94D]">{searchTerm ? "No completed bookings found matching your search" : "No completed bookings found for this property"}</div>
                ) : (
                    <>
                        <div className="space-y-4">
                            {payments.map((payment: any) => (
                                <div key={payment._id} className="p-4 rounded-[12px] border border-[#C9A94D] bg-[#1a2235]">
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center border-b border-[#434D64] mb-3 pb-3">
                                        <div className="flex items-center gap-3">
                                            <div className="relative">{payment.userId?.profileImg ? <img src={payment.userId.profileImg} alt={payment.userId?.name} className="rounded-full border-2 border-white object-cover h-12 w-12" /> : <Avatar name={payment.userId?.name || "Unknown User"} size={48} />}</div>
                                            <div>
                                                <p className="font-bold text-white">Guest</p>
                                                <p className="text-[#C9A94D]">{payment.userId?.name || "N/A"}</p>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="font-bold text-white">Host Amount</p>
                                            <p className="text-green-500 font-semibold">+${payment.hostAmount}</p>
                                        </div>
                                        <div>
                                            <p className="font-bold text-white">Booking Date</p>
                                            <p className="text-[#C9A94D]">{formatDate(payment.createdAt)}</p>
                                        </div>
                                        <div>
                                            <p className="font-bold text-white">Status</p>
                                            <span className="px-2 py-1 rounded-full text-xs text-white bg-green-500">COMPLETED</span>
                                        </div>
                                    </div>

                                    {/* Check-in/Check-out Dates */}
                                    <div className="flex items-center gap-4 justify-between flex-col md:flex-row">
                                        <div>
                                            {payment.messageId?.checkInDate && payment.messageId?.checkOutDate && (
                                                <div className="mt-2 text-sm">
                                                    <span className="text-gray-400">Stay Dates: </span>
                                                    <span className="text-white">
                                                        {formatDate(payment.messageId.checkInDate)} - {formatDate(payment.messageId.checkOutDate)}
                                                    </span>
                                                </div>
                                            )}
                                            {payment.messageId?.guestNo && (
                                                <div className="mt-1 text-sm">
                                                    <span className="text-gray-400">Guests: </span>
                                                    <span className="text-white">{payment.messageId.guestNo}</span>
                                                </div>
                                            )}
                                            {/* Payment ID */}
                                            <div className="mt-2 text-xs">
                                                <span className="text-gray-400">Payment ID: </span>
                                                <span className="text-gray-300">{payment.stripePaymentIntentId}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
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
}

"use client";
import React, { useState } from "react";
import Image from "next/image";
import PageHeader from "@/components/PageHeader";
import { useAppSelector } from "@/redux/hooks";
import { currentUser } from "@/redux/features/auth/authSlice";
import { useGetMyPaymentsQuery } from "@/redux/features/propertyPayment/propertyPaymentApi";
import Link from "next/link";

const Guest = () => {
    const mainuser = useAppSelector(currentUser);
    const [page, setPage] = useState(1);
    const limit = 3;
    const { data: mypayments, isLoading: paymentsLoading } = useGetMyPaymentsQuery({ page, limit });

    const handleNextPage = () => {
        if (mypayments?.meta) {
            const totalPages = Math.ceil(mypayments.meta.total / limit);
            if (page < totalPages) {
                setPage((prev) => prev + 1);
            }
        }
    };

    const handlePrevPage = () => {
        if (page > 1) {
            setPage((prev) => prev - 1);
        }
    };

    return (
        <div>
            <PageHeader title={"Guest Dashboard"}></PageHeader>
            <div className="text-[#C9A94D]">
                <div className="mb-8">
                    <h1 className="font-bold text-[30px] mb-4">Guest Dashboard</h1>
                    <p>Welcome back, {mainuser?.name} ! Here’s what’s happening with your account.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-14 mb-8">
                    <div className="flex items-center gap-5 flex-col md:flex-row border border-[#C9A94D] bg-[#2D3546] rounded-2xl p-5">
                        <Image src="/dashboard/sidebar/calendar.png" alt="Total Booking" width={35} height={35}></Image>
                        <div>
                            <p>Total Booking</p>
                            <h1 className="text-xl font-bold text-center md:text-left">{mypayments?.meta?.total ?? 0}</h1>
                        </div>
                    </div>
                    <div className="flex items-center gap-5 flex-col md:flex-row border border-[#C9A94D] bg-[#2D3546] rounded-2xl p-5">
                        <Image src="/dashboard/sidebar/message.png" alt="Total Booking" width={35} height={35}></Image>
                        <div>
                            <p>Messages</p>
                            <h1 className="text-xl font-bold text-center md:text-left">2</h1>
                        </div>
                    </div>
                    {/* <div className="flex items-center gap-5 flex-col md:flex-row border border-[#C9A94D] bg-[#2D3546] rounded-2xl p-5">
                        <Image src="/dashboard/sidebar/star.png" alt="Total Booking" width={35} height={35}></Image>
                        <div>
                            <p>Your Rating</p>
                            <h1 className="text-xl font-bold text-center md:text-left">4.8</h1>
                        </div>
                    </div> */}
                </div>
                {/* <div className="gap-5 border border-[#C9A94D] bg-[#2D3546] rounded-2xl p-5">
                    <h1 className="text-[24px] mb-6">Your Bookings</h1>
                    <div className="flex items-center justify-between flex-col md:flex-row gap-4 p-2 border border-[#C9A94D] rounded-[10px] mb-6">
                        <div className="flex items-center gap-5 flex-col md:flex-row">
                            <Image src="/dashboard/booking.png" alt="Booking Img" height={80} width={100}></Image>
                            <div>
                                <h1 className="font-bold text-xl">Modern Downtown Appartment</h1>
                                <p>2024-01-01 - 2024-01-10</p>
                                <p>2 Guest . £450</p>
                            </div>
                        </div>
                        <div>
                            <button className="font-bold bg-[#C9A94D] text-white px-2 rounded-[10px] w-full">Confirmed</button>
                        </div>
                    </div>
                    <div className="flex items-center justify-between flex-col md:flex-row gap-4 p-2 border border-[#C9A94D] rounded-[10px] mb-6">
                        <div className="flex items-center gap-5 flex-col md:flex-row">
                            <Image src="/dashboard/booking.png" alt="Booking Img" height={80} width={100}></Image>
                            <div>
                                <h1 className="font-bold text-xl">Modern Downtown Appartment</h1>
                                <p>2024-01-01 - 2024-01-10</p>
                                <p>2 Guest . £450</p>
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <button className="font-bold bg-[#C9A94D] text-white px-2 rounded-[10px] w-full">Previously Bookeed</button>
                            <button className="font-bold bg-white text-black px-2 rounded-[10px] w-full">Book Again</button>
                        </div>
                    </div>
                </div> */}
                <div className="gap-5 border border-[#C9A94D] bg-[#2D3546] rounded-2xl p-5">
                    <h1 className="text-[24px] mb-6">Your Bookings</h1>

                    {paymentsLoading ? (
                        <div className="text-center py-8">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C9A94D] mx-auto"></div>
                            <p className="mt-4 text-[#C9A94D]">Loading bookings...</p>
                        </div>
                    ) : mypayments?.success === false ? (
                        <div className="text-center py-8">
                            <div className="text-red-500 text-lg mb-2">Failed to load bookings</div>
                            <p className="text-[#C9A94D]">{mypayments?.message || "Please try again later"}</p>
                        </div>
                    ) : !mypayments?.data || mypayments.data.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-[#C9A94D] text-lg">No bookings found</p>
                        </div>
                    ) : (
                        <>
                            {mypayments.data.map((payment: any) => {
                                const isExpired = new Date(payment.messageId?.checkOutDate) < new Date();

                                return (
                                    <div key={payment._id} className="flex items-center justify-between flex-col md:flex-row gap-4 p-2 border border-[#C9A94D] rounded-[10px] mb-6">
                                        <div className="flex items-center gap-5 flex-col md:flex-row">
                                            <Image src={payment.propertyId?.coverPhoto ? `${process.env.NEXT_PUBLIC_BASE_API}${payment.propertyId.coverPhoto}` : "/dashboard/booking.png"} alt="Booking Img" height={80} width={100} />
                                            <div>
                                                <h1 className="font-bold text-xl text-white">{payment.propertyId?.title}</h1>
                                                <p className="text-gray-300">
                                                    {payment.messageId?.checkInDate ? new Date(payment.messageId.checkInDate).toLocaleDateString() : "N/A"} - {payment.messageId?.checkOutDate ? new Date(payment.messageId.checkOutDate).toLocaleDateString() : "N/A"}
                                                </p>
                                                <p className="text-[#C9A94D]">£{payment.totalAmount}</p>
                                            </div>
                                        </div>
                                        <div className={isExpired ? "flex flex-col gap-2" : ""}>
                                            <button className="font-bold bg-[#C9A94D] text-white px-2 rounded-[10px] w-full">{isExpired ? "Previously Booked" : "Confirmed"}</button>
                                            {isExpired && (
                                                <Link href={`/listings/${payment.propertyId?._id}`}>
                                                    <button className="font-bold bg-white text-black px-2 rounded-[10px] w-full">Book Again</button>
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}

                            {/* Pagination Controls */}
                            {mypayments?.meta && mypayments.meta.total > 0 && (
                                <div className="flex flex-col md:flex-row justify-between items-center mt-6 pt-4 border-t border-[#C9A94D] gap-4">
                                    <div className="text-[#C9A94D] text-sm">
                                        Showing {(page - 1) * limit + 1} to {Math.min(page * limit, mypayments.meta.total)} of {mypayments.meta.total} properties
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={handlePrevPage} disabled={page === 1} className="px-3 py-1 border border-[#C9A94D] text-[#C9A94D] rounded hover:bg-[#C9A94D] hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                                            Previous
                                        </button>
                                        <span className="px-3 py-1 text-[#C9A94D]">
                                            Page {page} of {Math.ceil(mypayments.meta.total / limit)}
                                        </span>
                                        <button onClick={handleNextPage} disabled={page >= Math.ceil(mypayments.meta.total / limit)} className="px-3 py-1 border border-[#C9A94D] text-[#C9A94D] rounded hover:bg-[#C9A94D] hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                                            Next
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Guest;

"use client";
import React, { useState } from "react";
import { Host } from "@/types/host";
import Image from "next/image";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import { useSearchMyPublishedPropertiesQuery } from "@/redux/features/property/propertyApi";
import { useGetHostPaymentsQuery } from "@/redux/features/propertyPayment/propertyPaymentApi";
import { useAppSelector } from "@/redux/hooks";
import { currentUser } from "@/redux/features/auth/authSlice";
import { useCreateConversationMutation, useGetTotalUnreadCountQuery, useSendMessageAutoMutation, useSendMessageMutation } from "@/redux/features/messages/messageApi";
import { useGetHostRatingStatsQuery } from "@/redux/features/rating/ratingApi";
import { useGetRandomAdminQuery } from "@/redux/features/users/usersApi";
import { useRouter } from "next/navigation";

const HostDash = () => {
    const hostuser = useAppSelector(currentUser);
    const router = useRouter();

    const [searchTerm, setSearchTerm] = useState("");
    const [page, setPage] = useState(1);
    const limit = 2;

    const { data: myactiveProperties, isLoading } = useSearchMyPublishedPropertiesQuery({
        page,
        limit,
        search: searchTerm,
    });

    const { data: unreadResponse, refetch } = useGetTotalUnreadCountQuery();
    const totalUnreadCount = unreadResponse?.data?.totalUnreadCount || 0;

    const [paymentsPage, setPaymentsPage] = useState(1);
    const paymentsLimit = 2;

    const { data: mypayments, isLoading: paymentsLoading } = useGetHostPaymentsQuery({
        page: paymentsPage,
        limit: paymentsLimit,
    });

    const { data: ratingStats } = useGetHostRatingStatsQuery(hostuser?._id || "");
    // console.log(ratingStats);
    const { data: randomAdminData, refetch: refetchRandomAdmin } = useGetRandomAdminQuery();
    console.log(randomAdminData);
    const [createConversation] = useCreateConversationMutation();
    const [sendMessage, { isLoading: isSending }] = useSendMessageMutation();
    const [sendMessageAuto] = useSendMessageAutoMutation();

    const handleSupport = async () => {
        console.log(randomAdminData);

        const conversationResult = await createConversation({
            participants: [randomAdminData?.data?._id!],
        }).unwrap();
        if (conversationResult.success && conversationResult.data?._id) {
            const conversationId = conversationResult.data._id;

            // Step 2: Send the booking message
            console.log("📤 Sending booking message...");
            await sendMessage({
                conversationId: conversationId,
                sender: hostuser?._id,
                type: "text",
                text: `I need support`,
                skip: true,
            }).unwrap();
            // setSelectedConversation(conversationId);

            await sendMessageAuto({
                conversationId: conversationId,
                sender: randomAdminData?.data?._id!,
                type: "text",
                text: `our team will respond to you within 48 hours`,
                skip: true,
            }).unwrap();
            router.push("/messages");
        } else {
            console.error("❌ Conversation creation failed:", conversationResult.message);
        }
    };

    const handlePaymentsNextPage = () => {
        if (mypayments?.meta) {
            const totalPages = Math.ceil(mypayments.meta.total / paymentsLimit);
            if (paymentsPage < totalPages) {
                setPaymentsPage((prev) => prev + 1);
            }
        }
    };

    const handlePaymentsPrevPage = () => {
        if (paymentsPage > 1) {
            setPaymentsPage((prev) => prev - 1);
        }
    };

    const [host, setHost] = useState<Host | null>(null);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        setPage(1); // Reset to first page when searching
    };

    const handleNextPage = () => {
        if (myactiveProperties?.meta) {
            const totalPages = Math.ceil(myactiveProperties.meta.total / limit);
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
            <PageHeader title={"Host Dashboard"}></PageHeader>
            <div className="text-[#C9A94D]">
                <div className="mb-8 flex justify-between flex-col md:flex-row gap-4">
                    <div>
                        <h1 className="font-bold text-[30px] mb-4">Host Dashboard</h1>
                        <p>Welcome back, {hostuser?.name} ! Here's what's happening with your account.</p>
                    </div>
                    {/* <div className="flex items-center justify-center flex-col gap-2">
                        <Image src={host.image} alt={host.name} width={30} height={30} className="rounded-full border-[0.3px] border-[#C9A94D] object-cover" />
                        <p>contact Letanest</p>
                        <button className="bg-[#C9A94D] rounded-[10px] px-4 py-1 text-white flex items-center gap-2">
                            <Image src="/dashboard/host/message-activity.png" alt="Message Icon" width={24} height={24} className="rounded-full border-[0.3px] border-[#C9A94D] object-cover" />
                            Message
                        </button>
                    </div> */}
                    <div className="flex items-center justify-center flex-col gap-2">
                        <Image src={randomAdminData?.data?.profileImg ? `${process.env.NEXT_PUBLIC_BASE_API}${randomAdminData.data.profileImg}` : "/home/avatar.jpg"} alt={randomAdminData?.data?.name || "Admin"} width={30} height={30} className="rounded-full border-[0.3px] border-[#C9A94D] object-cover" />
                        <p>Contact {randomAdminData?.data?.name || "Admin"}</p>
                        <button onClick={handleSupport} disabled={isSending} className="bg-[#C9A94D] rounded-[10px] px-4 py-1 text-white flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                            <Image src="/dashboard/host/message-activity.png" alt="Message Icon" width={24} height={24} className="rounded-full border-[0.3px] border-[#C9A94D] object-cover" />
                            {isSending ? "Creating..." : "Message"}
                        </button>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-14 mb-8">
                    {/* <div className="flex items-center gap-5 flex-col md:flex-row border border-[#C9A94D] bg-[#2D3546] rounded-2xl p-5">
                        <Image src="/dashboard/sidebar/message.png" alt="Total Booking" width={35} height={35}></Image>
                        <div>
                            <p className=" text-center md:text-left">Check Messages</p>
                            <h1 className="text-xl font-bold  text-center md:text-left">Unread 4+ massages</h1>
                        </div>
                    </div> */}
                    <Link href="/messages">
                        <div className="flex items-center gap-5 flex-col md:flex-row border border-[#C9A94D] bg-[#2D3546] rounded-2xl p-5">
                            <Image src="/dashboard/sidebar/message.png" alt="Total Booking" width={35} height={35}></Image>
                            <div>
                                <p className="text-center md:text-left">Check Messages</p>
                                <h1 className="text-xl font-bold text-center md:text-left">
                                    Unread {totalUnreadCount}+ {totalUnreadCount === 1 ? "message" : "messages"}
                                </h1>
                            </div>
                        </div>
                    </Link>
                    <Link href="/dashboard/listing/add" className="h-full">
                        <div className="flex items-center gap-5 flex-col md:flex-row border border-[#C9A94D] bg-[#2D3546] rounded-2xl p-5 h-full">
                            <Image src="/dashboard/host/plus.png" alt="Total Booking" width={35} height={35}></Image>
                            <p> Add Property</p>
                        </div>
                    </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-5 md:gap-14 mb-8">
                    <div className="flex items-center gap-5 flex-col md:flex-row border border-[#C9A94D] bg-[#2D3546] rounded-2xl p-5">
                        <Image src="/dashboard/sidebar/calendar.png" alt="Total Booking" width={35} height={35}></Image>
                        <div>
                            <p>Total Booking</p>
                            <h1 className="text-xl font-bold text-center md:text-left">{mypayments?.meta?.total ?? 0}</h1>
                        </div>
                    </div>
                    <div className="flex items-center gap-5 flex-col md:flex-row border border-[#C9A94D] bg-[#2D3546] rounded-2xl p-5">
                        <Image src="/dashboard/host/home-roof.png" alt="Total Booking" width={35} height={35}></Image>
                        <div>
                            <p>Properties</p>
                            <h1 className="text-xl font-bold text-center md:text-left">{myactiveProperties?.meta?.total ?? 0}</h1>
                        </div>
                    </div>
                    <div className="flex items-center gap-5 flex-col md:flex-row border border-[#C9A94D] bg-[#2D3546] rounded-2xl p-5">
                        <Image src="/dashboard/host/lineicons_pound.png" alt="Total Booking" width={35} height={35}></Image>
                        <div>
                            <p>Total Revenue</p>
                            <h1 className="text-xl font-bold text-center md:text-left">{mypayments?.meta?.totalAmount ?? 0}</h1>
                        </div>
                    </div>
                    <div className="flex items-center gap-5 flex-col md:flex-row border border-[#C9A94D] bg-[#2D3546] rounded-2xl p-5">
                        <Image src="/dashboard/host/star.png" alt="Total Booking" width={35} height={35}></Image>
                        <div>
                            <p>Rating</p>
                            <h1 className="text-xl font-bold text-center md:text-left">{ratingStats?.data.averageRating || 0}</h1>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-14 mb-8">
                    <div className="gap-5 border border-[#C9A94D] bg-[#2D3546] rounded-2xl p-5">
                        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                            <h1 className="text-2xl">Your Properties</h1>
                            <div className="relative w-full md:w-64">
                                <input type="text" placeholder="Search properties..." value={searchTerm} onChange={handleSearch} className="w-full px-4 py-2 bg-white/10 border border-[#C9A94D] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C9A94D]" />
                            </div>
                        </div>

                        {isLoading ? (
                            <div className="text-center py-8">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C9A94D] mx-auto"></div>
                                <p className="mt-4 text-[#C9A94D]">Loading properties...</p>
                            </div>
                        ) : myactiveProperties?.success === false ? (
                            <div className="text-center py-8">
                                <div className="text-red-500 text-lg mb-2">Failed to load properties</div>
                                <p className="text-[#C9A94D]">{myactiveProperties?.message || "Please try again later"}</p>
                            </div>
                        ) : !myactiveProperties?.data || myactiveProperties.data.length === 0 ? (
                            <div className="text-center py-8">
                                <p className="text-[#C9A94D] text-lg">No properties found</p>
                                {searchTerm && <p className="text-gray-400 mt-2">Try adjusting your search terms</p>}
                            </div>
                        ) : (
                            <>
                                {myactiveProperties?.data?.map((property: any) => (
                                    <div key={property._id} className="flex items-center justify-between flex-col md:flex-row gap-4 p-4 border border-[#C9A94D] rounded-[10px] mb-4 bg-white/5">
                                        <div className="flex items-center gap-4 flex-col md:flex-row w-full md:w-auto">
                                            <div className="relative h-20 w-20 flex-shrink-0">
                                                <Image src={property.coverPhoto ? `${process.env.NEXT_PUBLIC_BASE_API}${property.coverPhoto}` : "/dashboard/booking.png"} alt={property.title} fill className="object-cover rounded-lg" />
                                            </div>
                                            <div className="text-center md:text-left flex-1">
                                                <h1 className="font-bold text-xl text-white">{property.title}</h1>
                                                <p className="text-gray-300">{property.location}</p>
                                                <p className="text-gray-300">{property.propertyType}</p>
                                                <p className="text-[#C9A94D] font-semibold">£{property.price} per night</p>
                                            </div>
                                        </div>
                                        <div className="w-full md:w-auto">
                                            <Link href={`/dashboard/active-listings/${property._id}`}>
                                                <button className="font-bold bg-[#C9A94D] text-white px-2 rounded-[10px] w-full  md:w-auto hover:bg-[#B89A45] transition-colors cursor-pointer">Active</button>
                                            </Link>
                                        </div>
                                    </div>
                                ))}

                                {/* Pagination Controls */}
                                {myactiveProperties?.meta && myactiveProperties.meta.total > 0 && (
                                    <div className="flex flex-col md:flex-row justify-between items-center mt-6 pt-4 border-t border-[#C9A94D] gap-4">
                                        <div className="text-[#C9A94D] text-sm">
                                            Showing {(page - 1) * limit + 1} to {Math.min(page * limit, myactiveProperties.meta.total)} of {myactiveProperties.meta.total} properties
                                        </div>
                                        <div className="flex gap-2">
                                            <button onClick={handlePrevPage} disabled={page === 1} className="px-3 py-1 border border-[#C9A94D] text-[#C9A94D] rounded hover:bg-[#C9A94D] hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                                                Previous
                                            </button>
                                            <span className="px-3 py-1 text-[#C9A94D]">
                                                Page {page} of {Math.ceil(myactiveProperties.meta.total / limit)}
                                            </span>
                                            <button onClick={handleNextPage} disabled={page >= Math.ceil(myactiveProperties.meta.total / limit)} className="px-3 py-1 border border-[#C9A94D] text-[#C9A94D] rounded hover:bg-[#C9A94D] hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                                                Next
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>

                    <div className="gap-5 border border-[#C9A94D] bg-[#2D3546] rounded-2xl p-5">
                        <h1 className="text-2xl mb-6">Recent Booking</h1>

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
                                {mypayments.data.map((payment: any) => (
                                    <div key={payment._id} className="flex items-center justify-between flex-col md:flex-row gap-4 p-2 border border-[#C9A94D] rounded-[10px] mb-6">
                                        <div className="flex items-center gap-5 flex-col md:flex-row">
                                            {payment.userId?.profileImg ? (
                                                <Image src={`${process.env.NEXT_PUBLIC_BASE_API}${payment.userId.profileImg}`} alt={payment.userId?.name || "User"} width={88} height={88} className="rounded-full border-[0.3px] border-[#C9A94D] object-cover" />
                                            ) : (
                                                <div className="w-20 h-20 rounded-full bg-[#C9A94D] flex items-center justify-center border border-[#C9A94D]">
                                                    <span className="text-white font-bold text-xl">{payment.userId?.name?.charAt(0)?.toUpperCase() || "U"}</span>
                                                </div>
                                            )}
                                            <div>
                                                <h1 className="font-bold text-xl">{payment.userId?.name || "Unknown User"}</h1>
                                                <p>{payment.propertyId?.location || "City town"}</p>
                                                <p>£{payment.totalAmount}</p>
                                            </div>
                                        </div>
                                        <div>
                                            <button className="font-bold bg-[#C9A94D] text-white px-2 rounded-[10px] w-full">{payment.status === "completed" ? "Confirmed" : payment.status}</button>
                                        </div>
                                    </div>
                                ))}

                                {/* Pagination for Bookings */}
                                {mypayments?.meta && mypayments.meta.total > 0 && (
                                    <div className="flex flex-col md:flex-row justify-between items-center mt-6 pt-4 border-t border-[#C9A94D] gap-4">
                                        <div className="text-[#C9A94D] text-sm">
                                            Showing {(paymentsPage - 1) * paymentsLimit + 1} to {Math.min(paymentsPage * paymentsLimit, mypayments.meta.total)} of {mypayments.meta.total} bookings
                                        </div>
                                        <div className="flex gap-2">
                                            <button onClick={handlePaymentsPrevPage} disabled={paymentsPage === 1} className="px-3 py-1 border border-[#C9A94D] text-[#C9A94D] rounded hover:bg-[#C9A94D] hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                                                Previous
                                            </button>
                                            <span className="px-3 py-1 text-[#C9A94D]">
                                                Page {paymentsPage} of {Math.ceil(mypayments.meta.total / paymentsLimit)}
                                            </span>
                                            <button onClick={handlePaymentsNextPage} disabled={paymentsPage >= Math.ceil(mypayments.meta.total / paymentsLimit)} className="px-3 py-1 border border-[#C9A94D] text-[#C9A94D] rounded hover:bg-[#C9A94D] hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
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
        </div>
    );
};

export default HostDash;

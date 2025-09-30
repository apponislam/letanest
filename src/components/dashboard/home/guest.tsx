"use client";
import React from "react";
import Image from "next/image";
import PageHeader from "@/components/PageHeader";

const Guest = () => {
    return (
        <div>
            <PageHeader title={"Guest Dashboard"}></PageHeader>
            <div className="text-[#C9A94D]">
                <div className="mb-8">
                    <h1 className="font-bold text-[30px] mb-4">Guest Dashboard</h1>
                    <p>Welcome back, John ! Here’s what’s happening with your account.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-14 mb-8">
                    <div className="flex items-center gap-5 flex-col md:flex-row border border-[#C9A94D] bg-[#2D3546] rounded-2xl p-5">
                        <Image src="/dashboard/sidebar/calendar.png" alt="Total Booking" width={35} height={35}></Image>
                        <div>
                            <p>Total Booking</p>
                            <h1 className="text-xl font-bold text-center md:text-left">1</h1>
                        </div>
                    </div>
                    <div className="flex items-center gap-5 flex-col md:flex-row border border-[#C9A94D] bg-[#2D3546] rounded-2xl p-5">
                        <Image src="/dashboard/sidebar/message.png" alt="Total Booking" width={35} height={35}></Image>
                        <div>
                            <p>Messages</p>
                            <h1 className="text-xl font-bold text-center md:text-left">2</h1>
                        </div>
                    </div>
                    <div className="flex items-center gap-5 flex-col md:flex-row border border-[#C9A94D] bg-[#2D3546] rounded-2xl p-5">
                        <Image src="/dashboard/sidebar/star.png" alt="Total Booking" width={35} height={35}></Image>
                        <div>
                            <p>Your Rating</p>
                            <h1 className="text-xl font-bold text-center md:text-left">4.8</h1>
                        </div>
                    </div>
                </div>
                <div className="gap-5 border border-[#C9A94D] bg-[#2D3546] rounded-2xl p-5">
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
                            <button className="font-bold bg-[#C9A94D] text-white px-2 rounded-[10px] w-full">Previous Booking</button>
                            <button className="font-bold bg-white text-black px-2 rounded-[10px] w-full">Book Again</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Guest;

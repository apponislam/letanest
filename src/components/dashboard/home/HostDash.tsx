"use client";
import React, { useEffect, useState } from "react";
import { Host } from "@/types/host";
import Image from "next/image";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";

const HostDash = () => {
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
        <div>
            <PageHeader title={"Host Dashboard"}></PageHeader>
            <div className="text-[#C9A94D]">
                <div className="mb-8 flex justify-between flex-col md:flex-row gap-4">
                    <div>
                        <h1 className="font-bold text-[30px] mb-4">Host Dashboard</h1>
                        <p>Welcome back, John ! Here’s what’s happening with your account.</p>
                    </div>
                    <div className="flex items-center justify-center flex-col gap-2">
                        <Image src={host.image} alt={host.name} width={30} height={30} className="rounded-full border-[0.3px] border-[#C9A94D] object-cover" />
                        <p>contact Letanest</p>
                        <button className="bg-[#C9A94D] rounded-[10px] px-4 py-1 text-white flex items-center gap-2">
                            <Image src="/dashboard/host/message-activity.png" alt="Message Icon" width={24} height={24} className="rounded-full border-[0.3px] border-[#C9A94D] object-cover" />
                            Message
                        </button>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-14 mb-8">
                    <div className="flex items-center gap-5 flex-col md:flex-row border border-[#C9A94D] bg-[#2D3546] rounded-2xl p-5">
                        <Image src="/dashboard/sidebar/message.png" alt="Total Booking" width={35} height={35}></Image>
                        <div>
                            <p className=" text-center md:text-left">Check Messages</p>
                            <h1 className="text-xl font-bold  text-center md:text-left">Unread 4+ massages</h1>
                        </div>
                    </div>
                    <Link href="/" className="h-full">
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
                            <h1 className="text-xl font-bold text-center md:text-left">1</h1>
                        </div>
                    </div>
                    <div className="flex items-center gap-5 flex-col md:flex-row border border-[#C9A94D] bg-[#2D3546] rounded-2xl p-5">
                        <Image src="/dashboard/host/home-roof.png" alt="Total Booking" width={35} height={35}></Image>
                        <div>
                            <p>Properties</p>
                            <h1 className="text-xl font-bold text-center md:text-left">2</h1>
                        </div>
                    </div>
                    <div className="flex items-center gap-5 flex-col md:flex-row border border-[#C9A94D] bg-[#2D3546] rounded-2xl p-5">
                        <Image src="/dashboard/host/lineicons_pound.png" alt="Total Booking" width={35} height={35}></Image>
                        <div>
                            <p>Total Revenue</p>
                            <h1 className="text-xl font-bold text-center md:text-left">500</h1>
                        </div>
                    </div>
                    <div className="flex items-center gap-5 flex-col md:flex-row border border-[#C9A94D] bg-[#2D3546] rounded-2xl p-5">
                        <Image src="/dashboard/host/star.png" alt="Total Booking" width={35} height={35}></Image>
                        <div>
                            <p>Rating</p>
                            <h1 className="text-xl font-bold text-center md:text-left">4.8</h1>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-14 mb-8">
                    <div className=" gap-5 border border-[#C9A94D] bg-[#2D3546] rounded-2xl p-5">
                        <h1 className="text-2xl mb-6">Your Properties</h1>
                        <div className="flex items-center justify-between flex-col md:flex-row gap-4 p-2 border border-[#C9A94D] rounded-[10px] mb-6">
                            <div className="flex items-center gap-5 flex-col md:flex-row">
                                <Image src="/dashboard/booking.png" alt="Booking Img" height={80} width={100}></Image>
                                <div>
                                    <h1 className="font-bold text-xl">Town city</h1>
                                    <p>2024-01-01 - 2024-01-10</p>
                                    <p>2 Guest . $450</p>
                                </div>
                            </div>
                            <div>
                                <button className="font-bold bg-[#C9A94D] text-white px-2 rounded-[10px] w-full">Active</button>
                            </div>
                        </div>
                        <div className="flex items-center justify-between flex-col md:flex-row gap-4 p-2 border border-[#C9A94D] rounded-[10px] mb-6">
                            <div className="flex items-center gap-5 flex-col md:flex-row">
                                <Image src="/dashboard/booking.png" alt="Booking Img" height={80} width={100}></Image>
                                <div>
                                    <h1 className="font-bold text-xl">Town city</h1>
                                    <p>2024-01-01 - 2024-01-10</p>
                                    <p>2 Guest . $450</p>
                                </div>
                            </div>
                            <div>
                                <button className="font-bold bg-[#C9A94D] text-white px-2 rounded-[10px] w-full">Active</button>
                            </div>
                        </div>
                    </div>
                    <div className=" gap-5 border border-[#C9A94D] bg-[#2D3546] rounded-2xl p-5">
                        <h1 className="text-2xl mb-6">Your Properties</h1>
                        <div className="flex items-center justify-between flex-col md:flex-row gap-4 p-2 border border-[#C9A94D] rounded-[10px] mb-6">
                            <div className="flex items-center gap-5 flex-col md:flex-row">
                                <Image src={host.image} alt={host.name} width={88} height={88} className="rounded-full border-[0.3px] border-[#C9A94D] object-cover" />
                                <div>
                                    <h1 className="font-bold text-xl">Jhon Vance</h1>
                                    <p>City town</p>
                                    <p>$450</p>
                                </div>
                            </div>
                            <div>
                                <button className="font-bold bg-[#C9A94D] text-white px-2 rounded-[10px] w-full">confirmed</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HostDash;

"use client";
import React, { useEffect, useState } from "react";
import { Host } from "@/types/host";
import { ArrowLeft, TrendingUp } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChartAreaDefault } from "./RevenueChat";
import { ChartPieDonut } from "./ApartmentChart";

const AdminDash = () => {
    const router = useRouter();

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
        <div>
            <div className="p-5 border border-[#FFFFFF59] flex justify-between items-center mb-6 flex-col md:flex-row gap-4">
                <div className="text-[#C9A94D] flex items-center gap-3 text-[18px] cursor-pointer hover:underline" onClick={handleClick}>
                    <ArrowLeft />
                    <p>Back To Previous</p>
                </div>
                <h1 className="text-2xl text-[#C9A94D]">Terms & Conditions</h1>
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

                <div className="flex gap-5 mb-8 flex-col md:flex-row">
                    <div className="w-full md:w-2/3 gap-5 border border-[#C9A94D] bg-[#2D3546] rounded-2xl p-5">
                        <ChartAreaDefault></ChartAreaDefault>
                    </div>
                    <div className="w-full md:w-1/3 gap-5 border border-[#C9A94D] bg-[#2D3546] rounded-2xl p-5">
                        <ChartPieDonut></ChartPieDonut>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDash;

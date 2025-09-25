"use client";
import React, { useEffect, useState } from "react";
import { Host } from "@/types/host";
import { ArrowLeft, SquarePen, TrendingUp } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trash2 } from "lucide-react";
import Link from "next/link";

const guestPlans = [
    {
        title: "Open Door (Free)",
        description: "Booking Fee: 10% per booking (adjustable anytime)",
        price: "£0/month",
        benefits: ["Browse all homes freely", "Contact hosts after quick signup", "Standard booking with fees", "Leave reviews after stays", "Save favorites in your guest Dashboard"],
    },
    {
        title: "Golden Key (Monthly)",
        description: "Booking Fee: £0 (maximum 4 bookings, no surcharge)",
        price: "£4.99/month",
        benefits: ["No booking fees (unlimited stays)", "Priority host response (subscriber flagged as trusted)", "Priority guest support (fast-track help)", "Cashback/reward credits for future bookings", "Gold Guest Badge"],
    },
    {
        title: "Forever Key (Annual)",
        description: "Booking Fee: £0 unlimited bookings, no surcharge",
        price: "£49.99/month",
        benefits: ['All "Welcome Home" monthly perks', "Annual loyalty bonus (£25 travel credit)", "Exclusive discounts with local partners", "Recognition as a long-term member", "Gold House Badge", 'Access to "Nest Exclusive" properties'],
    },
];

const hostPlans = [
    {
        title: "Starter Host",
        description: "Free basic plan for new hosts",
        price: "£0/month",
        benefits: ["List up to 2 properties", "Standard booking fees", "Basic support"],
    },
    {
        title: "Pro Host",
        description: "For growing hosts with more listings",
        price: "£14.99/month",
        benefits: ["List up to 10 properties", "Reduced booking fees", "Priority support", "Host badge"],
    },
    {
        title: "Elite Host",
        description: "Premium plan for top hosts",
        price: "£49.99/month",
        benefits: ["Unlimited property listings", "No booking fees", "Dedicated account manager", "Elite Host badge"],
    },
];

const MemberShip = () => {
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

                <div className="text-[#C9A94D]">
                    <Tabs defaultValue="guest" className="w-full">
                        {/* Tab Triggers */}
                        <TabsList className="flex w-full h-auto overflow-hidden bg-transparent gap-3 mb-5 md:mb-10">
                            <TabsTrigger value="guest" className="p-3 h-auto rounded-[10px] w-full  md:w-1/2 text-white data-[state=active]:bg-[#135E9A] data-[state=active]:border-[#C9A94D] data-[state=active]:text-white bg-[#434D64] border-r border-[#C9A94D] ">
                                Guest Membership
                            </TabsTrigger>
                            <TabsTrigger value="host" className="p-3 h-auto rounded-[10px] w-full  md:w-1/2 text-white data-[state=active]:bg-[#135E9A] data-[state=active]:border-[#C9A94D] data-[state=active]:text-white bg-[#434D64]">
                                Host Membership
                            </TabsTrigger>
                        </TabsList>

                        {/* Guest Plans */}
                        <TabsContent value="guest">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {guestPlans.map((plan, idx) => (
                                    <div key={idx} className="bg-[#2D3546] border border-[#2D3546] hover:bg-transparent hover:border-[#af8d28] p-6 rounded-[16px] flex flex-col justify-between">
                                        {/* Plan Info */}
                                        <div>
                                            <h2 className="text-[18px] mb-2 text-center">{plan.title}</h2>
                                            <p className="mb-4 text-center">{plan.description}</p>
                                            <p className="text-[33px] font-bold mb-4 text-center">{plan.price}</p>

                                            <ul className="list-disc list-outside ml-4 mb-6 space-y-1 text-[14px]">
                                                {plan.benefits.map((benefit, i) => (
                                                    <li key={i}>{benefit}</li>
                                                ))}
                                            </ul>
                                        </div>

                                        {/* Bottom Edit/Delete buttons */}
                                        <div className="flex mt-4 flex-col gap-3">
                                            <button className="flex items-center justify-center gap-2 bg-[#C9A94D] text-white font-semibold py-3 px-6 rounded-[10px] hover:bg-[#b8973e] transition-colors shadow-sm">
                                                <SquarePen className="w-5 h-5" />
                                                Edit
                                            </button>
                                            <button className="flex items-center justify-center gap-2 bg-[#C9A94D] text-white font-semibold py-3 px-6 rounded-[10px] hover:bg-[#b8973e] transition-colors shadow-sm">
                                                <Trash2 className="w-5 h-5" />
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </TabsContent>

                        {/* Host Plans */}
                        <TabsContent value="host">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {hostPlans.map((plan, idx) => (
                                    <div key={idx} className="bg-[#2D3546] border border-[#2D3546] hover:bg-transparent hover:border-[#af8d28] p-6 rounded-[16px] flex flex-col justify-between">
                                        {/* Plan Info */}
                                        <div>
                                            <h2 className="text-[18px] mb-2 text-center">{plan.title}</h2>
                                            <p className="mb-4 text-center">{plan.description}</p>
                                            <p className="text-[33px] font-bold mb-4 text-center">{plan.price}</p>

                                            <ul className="list-disc list-outside ml-4 mb-6 space-y-1 text-[14px]">
                                                {plan.benefits.map((benefit, i) => (
                                                    <li key={i}>{benefit}</li>
                                                ))}
                                            </ul>
                                        </div>

                                        {/* Bottom Edit/Delete buttons */}
                                        <div className="flex mt-4 flex-col gap-3">
                                            <button className="flex items-center justify-center gap-2 bg-[#C9A94D] text-white font-semibold py-3 px-6 rounded-[10px] hover:bg-[#b8973e] transition-colors shadow-sm">
                                                <SquarePen className="w-5 h-5" />
                                                Edit
                                            </button>
                                            <button className="flex items-center justify-center gap-2 bg-[#C9A94D] text-white font-semibold py-3 px-6 rounded-[10px] hover:bg-[#b8973e] transition-colors shadow-sm">
                                                <Trash2 className="w-5 h-5" />
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </TabsContent>
                    </Tabs>
                    <div className="mt-5">
                        <Link href="/dashboard/memberships/add">
                            <button className="flex items-center gap-2 bg-[#C9A94D] text-white font-semibold py-3 px-20 rounded-[10px] hover:bg-[#b8973e] transition-colors shadow-sm">
                                <SquarePen className="w-5 h-5" />
                                Add
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MemberShip;

"use client";
import React, { useState } from "react";
import { TrendingDown, TrendingUp } from "lucide-react";
import Image from "next/image";
import { ChartAreaDefault } from "./RevenueChat";
import { ChartPieDonut } from "./ApartmentChart";
import PageHeader from "@/components/PageHeader";
import { useGetDashboardStatsQuery } from "@/redux/features/dashboard/dashboardApi";
import EmailNotificationToggle from "./EmailNotificationToggle";

const AdminDash = () => {
    const { data: statsData, isLoading, error } = useGetDashboardStatsQuery();

    if (isLoading) return <div className="text-white text-center py-8">Loading dashboard...</div>;
    if (error) return <div className="text-red-500 text-center py-8">Error loading dashboard</div>;

    const stats = statsData?.data;
    const usersTotal = stats?.users?.total || 0;
    const usersGrowth = stats?.users?.growth || 0;
    const propertiesTotal = stats?.properties?.total || 0;
    const propertiesGrowth = stats?.properties?.growth || 0;
    const revenueTotal = stats?.revenue?.total || 0;
    const revenueGrowth = stats?.revenue?.growth || 0;
    const isUsersGrowing = usersGrowth >= 0;
    const isPropertiesGrowing = propertiesGrowth >= 0;
    const isRevenueGrowing = revenueGrowth >= 0;

    return (
        <div>
            <PageHeader title={"Admin Dashboard"}></PageHeader>
            <div className="text-[#C9A94D]">
                <div className="mb-8 flex justify-between flex-col md:flex-row gap-4">
                    <div>
                        <h1 className="font-bold text-[30px] mb-2">Admin Dashboard</h1>
                        <p className="mb-2">Welcome back, John ! Here’s what’s happening with your account.</p>

                        <EmailNotificationToggle></EmailNotificationToggle>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    {/* Total Users */}
                    <div className="border border-[#C9A94D] bg-[#2D3546] rounded-2xl p-5">
                        <div className="flex items-center justify-between gap-5 flex-col md:flex-row mb-7">
                            <div>
                                <p className="mb-4 text-[#C9A94D]">Total User</p>
                                <h1 className="text-[26px] font-bold text-center md:text-left text-white">{usersTotal.toLocaleString()}</h1>
                            </div>
                            <Image src="/dashboard/admin/users.png" alt="Total Users" width={42} height={42} />
                        </div>
                        <div className="flex items-center gap-2">
                            {isUsersGrowing ? <TrendingUp className="h-5 w-5 text-[#00B69B]" /> : <TrendingDown className="h-5 w-5 text-[#FF0000]" />}
                            <p className="text-white">
                                <span className={isUsersGrowing ? "text-[#00B69B]" : "text-[#FF0000]"}>
                                    {isUsersGrowing ? "+" : ""}
                                    {usersGrowth}%
                                </span>{" "}
                                {isUsersGrowing ? "Up" : "Down"} from yesterday
                            </p>
                        </div>
                    </div>

                    {/* Revenue */}
                    <div className="border border-[#C9A94D] bg-[#2D3546] rounded-2xl p-5">
                        <div className="flex items-center justify-between gap-5 flex-col md:flex-row mb-7">
                            <div>
                                <p className="mb-4 text-[#C9A94D]">Revenue</p>
                                <h1 className="text-[26px] font-bold text-center md:text-left text-white">£{revenueTotal.toFixed(2)}</h1>
                            </div>
                            <Image src="/dashboard/admin/revenue.png" alt="Revenue" width={42} height={42} />
                        </div>
                        <div className="flex items-center gap-2">
                            {isRevenueGrowing ? <TrendingUp className="h-5 w-5 text-[#00B69B]" /> : <TrendingDown className="h-5 w-5 text-[#FF0000]" />}
                            <p className="text-white">
                                <span className={isRevenueGrowing ? "text-[#00B69B]" : "text-[#FF0000]"}>
                                    {isRevenueGrowing ? "+" : ""}
                                    {revenueGrowth}%
                                </span>{" "}
                                {isRevenueGrowing ? "Up" : "Down"} from yesterday
                            </p>
                        </div>
                    </div>

                    {/* Total Properties */}
                    <div className="border border-[#C9A94D] bg-[#2D3546] rounded-2xl p-5">
                        <div className="flex items-center justify-between gap-5 flex-col md:flex-row mb-7">
                            <div>
                                <p className="mb-4 text-[#C9A94D]">Total Properties</p>
                                <h1 className="text-[26px] font-bold text-center md:text-left text-white">{propertiesTotal.toLocaleString()}</h1>
                            </div>
                            <Image src="/dashboard/admin/calender.png" alt="Total Properties" width={42} height={42} />
                        </div>
                        <div className="flex items-center gap-2">
                            {isPropertiesGrowing ? <TrendingUp className="h-5 w-5 text-[#00B69B]" /> : <TrendingDown className="h-5 w-5 text-[#FF0000]" />}
                            <p className="text-white">
                                <span className={isPropertiesGrowing ? "text-[#00B69B]" : "text-[#FF0000]"}>
                                    {isPropertiesGrowing ? "+" : ""}
                                    {propertiesGrowth}%
                                </span>{" "}
                                {isPropertiesGrowing ? "Up" : "Down"} from yesterday
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

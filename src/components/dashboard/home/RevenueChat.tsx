"use client";

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { ArrowUp } from "lucide-react";
import { useGetRevenueChartDataQuery } from "@/redux/features/dashboard/dashboardApi";
import { useState } from "react";

export const description = "A styled area chart";

const chartConfig = {
    revenue: { label: "Revenue", color: "#596CFF" },
} satisfies ChartConfig;

export function ChartAreaDefault() {
    const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
    const { data: chartDataResponse, isLoading, error } = useGetRevenueChartDataQuery({ year: selectedYear });

    // Use dynamic API data
    const chartData = chartDataResponse?.data?.data || [
        { month: "January", revenue: 15 },
        { month: "February", revenue: 10 },
        { month: "March", revenue: 50 },
        { month: "April", revenue: 50 },
        { month: "May", revenue: 3 },
        { month: "June", revenue: 65 },
        { month: "July", revenue: 40 },
        { month: "August", revenue: 25 },
        { month: "September", revenue: 40 },
        { month: "October", revenue: 85 },
        { month: "November", revenue: 80 },
        { month: "December", revenue: 0 },
    ];

    // Generate year options (current year and previous years)
    const currentYear = new Date().getFullYear();
    const yearOptions = [currentYear, currentYear - 1, currentYear - 2];

    return (
        <Card className="bg-transparent p-0 border-none shadow-none text-white">
            <CardHeader className="p-0 flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Revenue</CardTitle>
                    <CardDescription className="text-white flex gap-2 items-center">
                        <ArrowUp className="w-5 h-5 text-[#48BB78]" /> <span className="text-[#48BB78]">(+5) more</span> <span className="text-[#8392AB]">in 2025</span>
                    </CardDescription>
                </div>

                {/* Year Dropdown */}
                <select value={selectedYear} onChange={(e) => setSelectedYear(Number(e.target.value))} className="bg-transparent border border-gray-600 rounded-md px-3 py-1 text-white focus:outline-none focus:ring-0">
                    {Array.from({ length: 11 }, (_, i) => {
                        const year = new Date().getFullYear() - 5 + i;
                        return (
                            <option key={year} value={year} className="bg-gray-800 text-white">
                                {year}
                            </option>
                        );
                    })}
                </select>
            </CardHeader>

            <CardContent className="p-0 !text-white mt-4">
                <ChartContainer config={chartConfig} className="w-full h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData} margin={{ left: 12, right: 12 }}>
                            <defs>
                                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#596CFF" stopOpacity={0} />
                                    <stop offset="10%" stopColor="#596CFF" stopOpacity={0.22} />
                                    <stop offset="95%" stopColor="#596CFF" stopOpacity={0.22} />
                                    <stop offset="100%" stopColor="#596CFF" stopOpacity={0} />
                                </linearGradient>
                            </defs>

                            <CartesianGrid vertical={false} strokeDasharray="3 3" />
                            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
                            <Area dataKey="revenue" type="natural" fill="url(#colorRevenue)" stroke="#596CFF" strokeWidth={4} />
                            <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(value) => value.slice(0, 3)} tick={{ fill: "#FFFFFF", fontSize: 12, fontWeight: 500 }} />
                        </AreaChart>
                    </ResponsiveContainer>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}

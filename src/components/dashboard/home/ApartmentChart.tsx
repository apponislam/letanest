"use client";

import { Pie, PieChart, Cell } from "recharts";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { useGetPropertyStatusStatsQuery } from "@/redux/features/dashboard/dashboardApi";
import { useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown, Calendar } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export const description = "A donut chart for property status";

// Define colors in frontend
const statusColors = {
    published: "#7ED957",
    pending: "#FF914D",
    rejected: "#FF3131",
    hidden: "#6CE5E8",
};

// Property type options
const propertyTypeOptions = ["Hotel", "Apartment", "Aparthotel", "Bed & Breakfast", "Hostel", "Guesthouse", "Entire Home", "Room Only", "Student Accommodation", "Unique Stays", "Caravan"] as const;

export function ChartPieDonut() {
    const [filters, setFilters] = useState({
        propertyType: "",
        startDate: null as Date | null,
        endDate: null as Date | null,
    });

    // Convert Date objects to ISO strings for the API
    const apiFilters = {
        propertyType: filters.propertyType || undefined,
        startDate: filters.startDate ? filters.startDate.toISOString().split("T")[0] : undefined,
        endDate: filters.endDate ? filters.endDate.toISOString().split("T")[0] : undefined,
    };

    const { data: statusData, isLoading, error } = useGetPropertyStatusStatsQuery(apiFilters);

    // Add colors to the data in frontend
    const chartData =
        statusData?.data?.data?.map((item: any) => ({
            ...item,
            color: statusColors[item.status as keyof typeof statusColors],
        })) || [];

    const chartConfig = chartData.reduce((config: any, item: any) => {
        config[item.status] = {
            label: item.status.charAt(0).toUpperCase() + item.status.slice(1),
            color: item.color,
        };
        return config;
    }, {});

    const handlePropertyTypeChange = (type: string) => {
        setFilters((prev) => ({
            ...prev,
            propertyType: prev.propertyType === type ? "" : type,
        }));
    };

    const handleDateChange = (dates: [Date | null, Date | null]) => {
        const [start, end] = dates;
        setFilters((prev) => ({
            ...prev,
            startDate: start,
            endDate: end,
        }));
    };

    const clearFilters = () => {
        setFilters({
            propertyType: "",
            startDate: null,
            endDate: null,
        });
    };

    const hasActiveFilters = filters.propertyType || filters.startDate || filters.endDate;

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error loading data</div>;
    }

    return (
        <Card className="relative flex flex-col bg-transparent p-0 border-none shadow-none text-white">
            <CardHeader className="items-center pb-0">
                <CardTitle>Property Status</CardTitle>
                {hasActiveFilters && (
                    <div className="text-sm text-yellow-400 mt-1 text-center">
                        {filters.propertyType && `Type: ${filters.propertyType}`}
                        {filters.startDate && ` | Period: ${filters.startDate?.toLocaleDateString()}${filters.endDate ? ` - ${filters.endDate?.toLocaleDateString()}` : ""}`}
                    </div>
                )}
            </CardHeader>

            <CardContent className="flex-1 pb-0 relative">
                <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[250px]">
                    <PieChart>
                        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                        <Pie data={chartData} dataKey="count" nameKey="status" innerRadius={80} outerRadius={100} paddingAngle={0} cornerRadius={0}>
                            {chartData.map((entry: any) => (
                                <Cell key={entry.status} fill={entry.color} />
                            ))}
                        </Pie>
                    </PieChart>
                </ChartContainer>

                {/* Dynamic labels based on data */}
                {chartData.map((entry: any, index: number) => (
                    <div key={entry.status} className={`absolute ${index === 0 ? "top-2 left-2" : index === 1 ? "top-2 right-2" : index === 2 ? "bottom-2 left-2" : "bottom-2 right-2"} font-medium text-[18px]`} style={{ color: entry.color }}>
                        <p>{`${entry.status.charAt(0).toUpperCase() + entry.status.slice(1)} `}</p>
                        <span>{`${entry.percentage}%`}</span>
                    </div>
                ))}
            </CardContent>

            <CardFooter className="flex-col gap-3 text-sm p-0 items-start mt-4">
                <div className="flex justify-between items-center w-full">
                    <p className="text-white text-sm">Filter By</p>
                    {hasActiveFilters && (
                        <button onClick={clearFilters} className="text-xs text-yellow-400 hover:text-yellow-300 underline">
                            Clear Filters
                        </button>
                    )}
                </div>

                <div className="flex items-center gap-3 flex-wrap">
                    {/* Property Type Dropdown */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button className="bg-[#C9A94D] hover:bg-[#b89742] text-white p-2 rounded-[8px] flex items-center gap-2">
                                Property Type
                                <ChevronDown className="w-4 h-4" />
                                {filters.propertyType && <span className="w-2 h-2 bg-white rounded-full"></span>}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="bg-white border border-[#C9A94D] z-50 max-h-60 overflow-y-auto">
                            <DropdownMenuItem className="cursor-pointer text-center border-b border-gray-200" onClick={() => handlePropertyTypeChange("")}>
                                Clear Selection
                            </DropdownMenuItem>
                            {propertyTypeOptions.map((type) => (
                                <DropdownMenuItem key={type} className={`cursor-pointer ${filters.propertyType === type ? "bg-[#C9A94D] text-white" : ""}`} onClick={() => handlePropertyTypeChange(type)}>
                                    {type}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Date Range Picker */}
                    <div className="relative">
                        <DatePicker
                            selected={filters.startDate}
                            onChange={handleDateChange}
                            startDate={filters.startDate}
                            endDate={filters.endDate}
                            selectsRange
                            placeholderText="Select Period"
                            className="bg-[#C9A94D] hover:bg-[#b89742] text-white p-2 rounded-[8px] cursor-pointer text-center w-40 flex items-center justify-center gap-2"
                            customInput={
                                <Button className="bg-[#C9A94D] hover:bg-[#b89742] text-white p-2 rounded-[8px] flex items-center gap-2 w-full">
                                    <Calendar className="w-4 h-4" />
                                    Period
                                    {(filters.startDate || filters.endDate) && <span className="w-2 h-2 bg-white rounded-full"></span>}
                                </Button>
                            }
                            calendarClassName="border border-[#C9A94D]"
                        />
                    </div>
                </div>

                {/* Active Filters Display */}
                {hasActiveFilters && (
                    <div className="flex flex-wrap gap-2 mt-2">
                        {filters.propertyType && <span className="bg-[#C9A94D] text-white px-2 py-1 rounded text-xs">Type: {filters.propertyType}</span>}
                        {filters.startDate && (
                            <span className="bg-[#C9A94D] text-white px-2 py-1 rounded text-xs">
                                {filters.startDate?.toLocaleDateString()}
                                {filters.endDate && ` - ${filters.endDate?.toLocaleDateString()}`}
                            </span>
                        )}
                    </div>
                )}
            </CardFooter>
        </Card>
    );
}

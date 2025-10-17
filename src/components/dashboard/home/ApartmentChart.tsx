// "use client";

// import { Pie, PieChart, Cell } from "recharts";
// import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
// import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

// export const description = "A donut chart";

// const chartData = [
//     { name: "Bed & Breakfast", value: 20, color: "#FF914D" },
//     { name: "Apartment", value: 20, color: "#6CE5E8" },
//     { name: "Room only", value: 20, color: "#FF3131" },
//     { name: "Guesthouse", value: 40, color: "#7ED957" },
// ];

// export function ChartPieDonut() {
//     const chartConfig: Record<string, { label: string; color: string }> = {
//         "Bed & Breakfast": { label: "Bed & Breakfast", color: "#FF914D" },
//         Apartment: { label: "Apartment", color: "#6CE5E8" },
//         "Room only": { label: "Room only", color: "#FF3131" },
//         Guesthouse: { label: "Guesthouse", color: "#7ED957" },
//     };

//     return (
//         <Card className="relative flex flex-col bg-transparent p-0 border-none shadow-none text-white">
//             <CardHeader className="items-center pb-0">
//                 <CardTitle>Pie Chart - Donut</CardTitle>
//             </CardHeader>

//             <CardContent className="flex-1 pb-0 relative">
//                 <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[250px]">
//                     <PieChart>
//                         <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
//                         <Pie
//                             data={chartData}
//                             dataKey="value"
//                             nameKey="name"
//                             innerRadius={80} // thickness = outerRadius - innerRadius = 100 - 80 = 20px
//                             outerRadius={100}
//                             paddingAngle={0} // gap between slices
//                             cornerRadius={0} // optional: rounded edges for slices
//                         >
//                             {chartData.map((entry) => (
//                                 <Cell key={entry.name} fill={entry.color} />
//                             ))}
//                         </Pie>
//                     </PieChart>
//                 </ChartContainer>

//                 {/* Labels in 4 corners */}
//                 <div className="absolute top-2 left-2 text-[#FF914D] font-medium text-[18px]">
//                     <p>{`${chartData[0].name} `}</p>
//                     <span>{`${chartData[0].value}%`}</span>
//                 </div>
//                 <div className="absolute top-2 right-2 text-[#6CE5E8] font-medium text-[18px]">
//                     <p>{`${chartData[1].name} `}</p>
//                     <span>{`${chartData[1].value}%`}</span>
//                 </div>
//                 <div className="absolute bottom-2 left-2 text-[#FF3131] font-medium text-[18px]">
//                     <p>{`${chartData[2].name} `}</p>
//                     <span>{`${chartData[2].value}%`}</span>
//                 </div>
//                 <div className="absolute bottom-2 right-2 text-[#7ED957] font-medium text-[18px]">
//                     <p>{`${chartData[3].name} `}</p>
//                     <span>{`${chartData[3].value}%`}</span>
//                 </div>
//             </CardContent>
//             <CardFooter className="flex-col gap-3 text-sm p-0 items-start">
//                 <div>
//                     <p className="text-white text-sm">Filter By</p>
//                 </div>
//                 <div className="flex items-center gap-3">
//                     <button className="bg-[#C9A94D] text-white p-2 rounded-[8px]">Properties Type</button>
//                     <button className="bg-[#C9A94D] text-white p-2 rounded-[8px]">Period</button>
//                 </div>
//             </CardFooter>
//         </Card>
//     );
// }

"use client";

import { Pie, PieChart, Cell } from "recharts";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { useGetPropertyStatusStatsQuery } from "@/redux/features/dashboard/dashboardApi";

export const description = "A donut chart for property status";

// Define colors in frontend
const statusColors = {
    published: "#7ED957", // Green
    pending: "#FF914D", // Orange
    rejected: "#FF3131", // Red
    hidden: "#6CE5E8", // Blue
};

export function ChartPieDonut() {
    const { data: statusData, isLoading, error } = useGetPropertyStatusStatsQuery();

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

            <CardFooter className="flex-col gap-3 text-sm p-0 items-start">
                <div>
                    <p className="text-white text-sm">Filter By</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="bg-[#C9A94D] text-white p-2 rounded-[8px]">Properties Type</button>
                    <button className="bg-[#C9A94D] text-white p-2 rounded-[8px]">Period</button>
                </div>
            </CardFooter>
        </Card>
    );
}

// "use client";

// import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

// export const description = "A styled area chart";

// const chartData = [
//     { month: "January", revenue: 18600 },
//     { month: "February", revenue: 30500 },
//     { month: "March", revenue: 23700 },
//     { month: "April", revenue: 7300 },
//     { month: "May", revenue: 20900 },
//     { month: "June", revenue: 21400 },
//     { month: "July", revenue: 27800 },
//     { month: "August", revenue: 32000 },
//     { month: "September", revenue: 29000 },
//     { month: "October", revenue: 31500 },
//     { month: "November", revenue: 36000 },
//     { month: "December", revenue: 41000 },
// ];

// const chartConfig = {
//     revenue: {
//         label: "Revenue",
//         color: "#596CFF",
//     },
// } satisfies ChartConfig;

// export function ChartAreaDefault() {
//     return (
//         <Card className="bg-transparent p-0 border-none shadow-none text-white">
//             <CardHeader className="p-0">
//                 <CardTitle>Revenue</CardTitle>
//                 <CardDescription className="text-white">
//                     <div>
//                         <span className="text-[#48BB78]">(+5) more</span> <span className="text-[#8392AB]">in 2025</span>
//                     </div>
//                 </CardDescription>
//             </CardHeader>
//             <CardContent className="p-0 !text-white">
//                 <ChartContainer config={chartConfig}>
//                     <AreaChart
//                         accessibilityLayer
//                         data={chartData}
//                         margin={{
//                             left: 12,
//                             right: 12,
//                         }}
//                     >
//                         {/* gradient definition */}
//                         <defs>
//                             <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
//                                 <stop offset="22%" stopColor="#596CFF" stopOpacity={0.22} />
//                                 <stop offset="100%" stopColor="#FFFFFF" stopOpacity={0} />
//                             </linearGradient>
//                         </defs>

//                         {/* horizontal grid only */}
//                         <CartesianGrid vertical={false} strokeDasharray="3 3" />

//                         <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(value) => value.slice(0, 3)} tick={{ fill: "#FFFFFF", fontSize: 12, fontWeight: 500, fillOpacity: 1 }} stroke="#FFFFFF" />

//                         <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />

//                         <Area
//                             dataKey="revenue" // <-- change here
//                             type="natural"
//                             fill="url(#colorRevenue)"
//                             stroke="#596CFF"
//                             strokeWidth={4}
//                         />
//                     </AreaChart>
//                 </ChartContainer>
//             </CardContent>
//         </Card>
//     );
// }

"use client";

import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { ArrowUp } from "lucide-react";

export const description = "A styled area chart";

const chartData = [
    { month: "January", revenue: 18600 },
    { month: "February", revenue: 30500 },
    { month: "March", revenue: 23700 },
    { month: "April", revenue: 7300 },
    { month: "May", revenue: 20900 },
    { month: "June", revenue: 21400 },
    { month: "July", revenue: 27800 },
    { month: "August", revenue: 32000 },
    { month: "September", revenue: 29000 },
    { month: "October", revenue: 31500 },
    { month: "November", revenue: 36000 },
    { month: "December", revenue: 41000 },
];

const chartConfig = {
    revenue: { label: "Revenue", color: "#596CFF" },
} satisfies ChartConfig;

export function ChartAreaDefault() {
    return (
        <Card className="bg-transparent p-0 border-none shadow-none text-white">
            <CardHeader className="p-0">
                <CardTitle>Revenue</CardTitle>
                <CardDescription className="text-white flex gap-2 items-center">
                    <ArrowUp className="w-5 h-5 text-[#48BB78]" /> <span className="text-[#48BB78]">(+5) more</span> <span className="text-[#8392AB]">in 2025</span>
                </CardDescription>
            </CardHeader>

            <CardContent className="p-0 !text-white">
                <ChartContainer config={chartConfig} className="w-full h-[350px]">
                    <AreaChart
                        data={chartData}
                        margin={{ left: 12, right: 12 }}
                        width={undefined} // let container control width
                        height={400} // fixed height
                    >
                        {/* gradient definition */}
                        <defs>
                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="22%" stopColor="#596CFF" stopOpacity={0.22} />
                                <stop offset="100%" stopColor="#FFFFFF" stopOpacity={0} />
                            </linearGradient>
                        </defs>

                        <CartesianGrid vertical={false} strokeDasharray="3 3" />

                        <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(value) => value.slice(0, 3)} tick={{ fill: "#FFFFFF", fontSize: 12, fontWeight: 500, fillOpacity: 1 }} stroke="#FFFFFF" />

                        <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />

                        <Area dataKey="revenue" type="natural" fill="url(#colorRevenue)" stroke="#596CFF" strokeWidth={4} />
                    </AreaChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}

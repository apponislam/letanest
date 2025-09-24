"use client";

import { Pie, PieChart, Cell } from "recharts";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { TrendingUp } from "lucide-react";

export const description = "A donut chart";

const chartData = [
    { name: "Bed & Breakfast", value: 20, color: "#FF914D" },
    { name: "Apartment", value: 20, color: "#6CE5E8" },
    { name: "Room only", value: 20, color: "#FF3131" },
    { name: "Guesthouse", value: 40, color: "#7ED957" },
];

export function ChartPieDonut() {
    const chartConfig: Record<string, { label: string; color: string }> = {
        "Bed & Breakfast": { label: "Bed & Breakfast", color: "#FF914D" },
        Apartment: { label: "Apartment", color: "#6CE5E8" },
        "Room only": { label: "Room only", color: "#FF3131" },
        Guesthouse: { label: "Guesthouse", color: "#7ED957" },
    };

    return (
        <Card className="relative flex flex-col bg-transparent p-0 border-none shadow-none text-white">
            <CardHeader className="items-center pb-0">
                <CardTitle>Pie Chart - Donut</CardTitle>
            </CardHeader>

            <CardContent className="flex-1 pb-0 relative">
                <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[250px]">
                    <PieChart>
                        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                        <Pie
                            data={chartData}
                            dataKey="value"
                            nameKey="name"
                            innerRadius={80} // thickness = outerRadius - innerRadius = 100 - 80 = 20px
                            outerRadius={100}
                            paddingAngle={0} // gap between slices
                            cornerRadius={0} // optional: rounded edges for slices
                        >
                            {chartData.map((entry) => (
                                <Cell key={entry.name} fill={entry.color} />
                            ))}
                        </Pie>
                    </PieChart>
                </ChartContainer>

                {/* Labels in 4 corners */}
                <div className="absolute top-2 left-2 text-[#FF914D] font-medium text-[18px]">{`${chartData[0].name} ${chartData[0].value}%`}</div>
                <div className="absolute top-2 right-2 text-[#6CE5E8] font-medium text-[18px]">{`${chartData[1].name} ${chartData[1].value}%`}</div>
                <div className="absolute bottom-2 left-2 text-[#FF3131] font-medium text-[18px]">{`${chartData[2].name} ${chartData[2].value}%`}</div>
                <div className="absolute bottom-2 right-2 text-[#7ED957] font-medium text-[18px]">{`${chartData[3].name} ${chartData[3].value}%`}</div>
            </CardContent>
            <CardFooter className="flex-col gap-2 text-sm">
                <div className="flex items-center gap-2 leading-none font-medium">
                    Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
                </div>
                <div className="text-muted-foreground leading-none">Showing total visitors for the last 6 months</div>
            </CardFooter>
        </Card>
    );
}

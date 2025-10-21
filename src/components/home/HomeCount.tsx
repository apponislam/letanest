// "use client";

// import Image from "next/image";
// import React, { useEffect, useState, useMemo } from "react";

// const HomeCount = () => {
//     const stats = useMemo(
//         () => [
//             { icon: "/home/Crown.png", target: 1000, label: "Listing" },
//             { icon: "/home/Vector.png", target: 2000, label: "Happy Customer" },
//             { icon: "/home/Crown.png", target: 10, label: "Years Experience" },
//         ],
//         []
//     );

//     const [counts, setCounts] = useState(stats.map(() => 0));

//     useEffect(() => {
//         const duration = 2000; // 2 seconds
//         const fps = 60;
//         const intervalTime = 1000 / fps;

//         const increments = stats.map((stat) => stat.target / (duration / intervalTime));

//         const interval = setInterval(() => {
//             setCounts((prev) =>
//                 prev.map((count, i) => {
//                     const next = count + increments[i];
//                     if (next >= stats[i].target) return stats[i].target;
//                     return next;
//                 })
//             );
//         }, intervalTime);

//         return () => clearInterval(interval);
//     }, [stats]); // now safe, stats is memoized

//     return (
//         <div className="container mx-auto mb-8 md:mb-20 xl:pt-40 2xl:pt-0">
//             <div className="flex mx-5 md:mx-0 md:items-center justify-between flex-col md:flex-row gap-5">
//                 {stats.map((stat, idx) => (
//                     <div key={idx} className="flex items-center gap-3">
//                         <div className="bg-[#C9A94D] rounded-[8px] h-[100px] w-[100px] flex justify-center items-center">
//                             <Image src={stat.icon} width={60} height={60} alt={stat.label} />
//                         </div>
//                         <div>
//                             <h2 className="text-[36px] text-white font-semibold">{Math.floor(counts[idx]) >= stat.target ? `${stat.target}+` : Math.floor(counts[idx])}</h2>
//                             <p className="text-white">{stat.label}</p>
//                         </div>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// };

// export default HomeCount;

"use client";

import { useGetSiteStatsQuery } from "@/redux/features/dashboard/dashboardApi";
import Image from "next/image";
import React, { useEffect, useState, useMemo } from "react";

// Assuming you have a hook like this defined elsewhere
// import { useGetSiteStatsQuery } from '@/path/to/your/api';

const HomeCount = () => {
    const { data: siteStats, isLoading } = useGetSiteStatsQuery();

    const stats = useMemo(() => {
        if (!siteStats?.data) {
            return [
                { icon: "/home/Crown.png", target: 1000, label: "Listing" },
                { icon: "/home/Vector.png", target: 2000, label: "Happy Customer" },
                { icon: "/home/Crown.png", target: 10, label: "Years Experience" },
            ];
        }

        return [
            {
                icon: "/home/Crown.png",
                target: siteStats.data.publishedPropertiesCount || 5,
                label: "Listing",
            },
            {
                icon: "/home/Vector.png",
                target: siteStats.data.propertiesWithGoodRatingsCount || 3,
                label: "Happy Customer",
            },
            {
                icon: "/home/Crown.png",
                target: siteStats.data.yearsSince2025 || 0,
                label: "Years Experience",
            },
        ];
    }, [siteStats]);

    const [counts, setCounts] = useState(stats.map(() => 0));

    useEffect(() => {
        // Reset counts when stats change (when data loads)
        setCounts(stats.map(() => 0));
    }, [stats]);

    useEffect(() => {
        if (isLoading) return;

        const duration = 2000; // 2 seconds
        const fps = 60;
        const intervalTime = 1000 / fps;

        const increments = stats.map((stat) => stat.target / (duration / intervalTime));

        const interval = setInterval(() => {
            setCounts((prev) =>
                prev.map((count, i) => {
                    const next = count + increments[i];
                    if (next >= stats[i].target) return stats[i].target;
                    return next;
                })
            );
        }, intervalTime);

        return () => clearInterval(interval);
    }, [stats, isLoading]);

    if (isLoading) {
        return (
            <div className="container mx-auto mb-8 md:mb-20 xl:pt-40 2xl:pt-0">
                <div className="flex mx-5 md:mx-0 md:items-center justify-between flex-col md:flex-row gap-5">
                    {stats.map((stat, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                            <div className="bg-[#C9A94D] rounded-[8px] h-[100px] w-[100px] flex justify-center items-center">
                                <Image src={stat.icon} width={60} height={60} alt={stat.label} />
                            </div>
                            <div>
                                <h2 className="text-[36px] text-white font-semibold">0</h2>
                                <p className="text-white">{stat.label}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto mb-8 md:mb-20 xl:pt-40 2xl:pt-0">
            <div className="flex mx-5 md:mx-0 md:items-center justify-between flex-col md:flex-row gap-5">
                {stats.map((stat, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                        <div className="bg-[#C9A94D] rounded-[8px] h-[100px] w-[100px] flex justify-center items-center">
                            <Image src={stat.icon} width={60} height={60} alt={stat.label} />
                        </div>
                        <div>
                            <h2 className="text-[36px] text-white font-semibold">{Math.floor(counts[idx]) >= stat.target ? `${stat.target}+` : Math.floor(counts[idx])}</h2>
                            <p className="text-white">{stat.label}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HomeCount;

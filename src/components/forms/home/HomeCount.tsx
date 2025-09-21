"use client";

import Image from "next/image";
import React, { useEffect, useState, useMemo } from "react";

const HomeCount = () => {
    const stats = useMemo(
        () => [
            { icon: "/home/Crown.png", target: 1000, label: "Listing" },
            { icon: "/home/Vector.png", target: 2000, label: "Happy Customer" },
            { icon: "/home/Crown.png", target: 10, label: "Years Experience" },
        ],
        []
    );

    const [counts, setCounts] = useState(stats.map(() => 0));

    useEffect(() => {
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
    }, [stats]); // now safe, stats is memoized

    return (
        <div className="container mx-auto mb-8 md:mb-20">
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

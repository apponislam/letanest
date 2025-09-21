"use client";

import React, { useEffect, useState } from "react";
import PropertyCard from "@/components/PropertyCard";
import { Property } from "@/types/proparty";
import { ArrowLeft, ArrowRight } from "lucide-react";

// Swiper
import { Swiper, SwiperSlide } from "swiper/react";
// import Navigation from "swiper/modules/navigation/navigation";

import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";

export default function FeaturedNests() {
    const [properties, setProperties] = useState<Property[]>([]);

    useEffect(() => {
        fetch("/data/proparties.json")
            .then((res) => res.json())
            .then((data) => setProperties(data.data))
            .catch((err) => console.error(err));
    }, []);

    // Chunk array into groups of 4
    const chunkArray = <T,>(arr: T[], size: number): T[][] => {
        const chunks: T[][] = [];
        for (let i = 0; i < arr.length; i += size) {
            chunks.push(arr.slice(i, i + size));
        }
        return chunks;
    };

    const propertyChunks = chunkArray(properties, 4);

    return (
        <div className="py-16">
            <div className="container mx-auto">
                <div className="mx-4 md:mx-0">
                    <h1 className="text-2xl md:text-[32px] font-bold text-[#C9A94D] mb-10">Featured Nests</h1>

                    <Swiper
                        modules={[Navigation]}
                        spaceBetween={24}
                        slidesPerView={1} // 1 chunk per slide
                        navigation={{
                            prevEl: ".swiper-prev",
                            nextEl: ".swiper-next",
                        }}
                        loop={false}
                    >
                        {propertyChunks.map((chunk, idx) => (
                            <SwiperSlide key={idx}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8" style={{ rowGap: "1rem" }}>
                                    {chunk.map((property, i) => (
                                        <PropertyCard key={i} property={property} />
                                    ))}
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    {/* Navigation Buttons */}
                    <div className="flex justify-end items-center mt-4 gap-4 ">
                        <button className="swiper-prev flex items-center justify-center bg-[#C9A94D] border border-[#C9A94D] rounded-full h-12 w-12 hover:bg-transparent hover:text-[#C9A94D]">
                            <ArrowLeft />
                        </button>
                        <button className="swiper-next flex items-center justify-center bg-[#C9A94D] border border-[#C9A94D] rounded-full h-12 w-12 hover:bg-transparent hover:text-[#C9A94D]">
                            <ArrowRight />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

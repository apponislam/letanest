"use client";

import React from "react";
import PropertyCard2 from "@/components/PropertyCard2";
import { useGetPublishedPropertiesForAdminQuery } from "@/redux/features/property/propertyApi";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

export default function FeaturedNests() {
    const { data, isLoading, error } = useGetPublishedPropertiesForAdminQuery({
        page: 1,
        limit: 12,
        type: "featured",
    });

    const properties = data?.data || [];

    // Chunk array into groups of 4 for carousel
    const chunkArray = <T,>(arr: T[], size: number): T[][] => {
        const chunks: T[][] = [];
        for (let i = 0; i < arr.length; i += size) {
            chunks.push(arr.slice(i, i + size));
        }
        return chunks;
    };

    const propertyChunks = chunkArray(properties, 4);

    if (isLoading) {
        return (
            <div className="py-16 pt-0!">
                <div className="container mx-auto">
                    <div className="mx-4 md:mx-0">
                        <h1 className="text-2xl md:text-[32px] font-bold text-[#C9A94D] mb-10">Featured Nests</h1>
                        <div className="flex justify-center items-center h-40">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C9A94D]"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="py-16 pt-0!">
                <div className="container mx-auto">
                    <div className="mx-4 md:mx-0">
                        <h1 className="text-2xl md:text-[32px] font-bold text-[#C9A94D] mb-10">Featured Nests</h1>
                        <div className="text-center text-red-500">Failed to load featured properties</div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="py-16 pt-0!">
            <div className="container mx-auto">
                <div className="mx-4 md:mx-0">
                    <h1 className="text-2xl md:text-[32px] font-bold text-[#C9A94D] mb-10">Featured Nests</h1>

                    {properties.length > 0 ? (
                        <>
                            <Swiper
                                modules={[Navigation]}
                                spaceBetween={24}
                                slidesPerView={1}
                                navigation={{
                                    prevEl: ".swiper-prev",
                                    nextEl: ".swiper-next",
                                }}
                                loop={false}
                            >
                                {propertyChunks.map((chunk, idx) => (
                                    <SwiperSlide key={idx}>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8" style={{ rowGap: "1rem" }}>
                                            {chunk.map((property) => (
                                                <PropertyCard2 key={property._id} property={property} status="Featured" />
                                            ))}
                                        </div>
                                    </SwiperSlide>
                                ))}
                            </Swiper>

                            {/* Navigation Buttons */}
                            <div className="flex justify-end items-center mt-4 gap-4">
                                <button className="swiper-prev flex items-center justify-center bg-[#C9A94D] border border-[#C9A94D] rounded-full h-12 w-12 hover:bg-transparent hover:text-[#C9A94D]">
                                    <ArrowLeft />
                                </button>
                                <button className="swiper-next flex items-center justify-center bg-[#C9A94D] border border-[#C9A94D] rounded-full h-12 w-12 hover:bg-transparent hover:text-[#C9A94D]">
                                    <ArrowRight />
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="text-center text-[#C9A94D] py-8">No featured properties available</div>
                    )}
                </div>
            </div>
        </div>
    );
}

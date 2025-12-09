"use client";

import React, { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Grid } from "swiper/modules";
import { ArrowLeft, ArrowRight } from "lucide-react";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/grid";
import { IUser } from "@/types/property";
import SingleStarRating from "@/utils/SingleStarRating";

interface Rating {
    _id: string;
    userId: IUser | string;
    overallExperience: number;
    description?: string;
}

interface RatingsSectionProps {
    propertyRatingsLoading: boolean;
    propertyRatingsArray: Rating[];
}

export default function RatingsSection({ propertyRatingsLoading, propertyRatingsArray }: RatingsSectionProps) {
    const swiperRef = useRef<any>(null);

    return (
        <div className="pb-6 md:pb-12 mb-6 md:mb-12 border-b border-[#C9A94D]">
            {/* Header with Navigation Buttons */}
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-[32px] text-white font-bold">Ratings</h1>

                {!propertyRatingsLoading && propertyRatingsArray.length > 0 && (
                    <div className="flex items-center gap-2">
                        <button className="swiper-prev-ratings flex items-center justify-center bg-[#C9A94D] border border-[#C9A94D] rounded-full h-10 w-10 hover:bg-transparent hover:text-[#C9A94D] transition-colors disabled:opacity-50 disabled:cursor-not-allowed" aria-label="Previous ratings">
                            <ArrowLeft size={20} />
                        </button>
                        <button className="swiper-next-ratings flex items-center justify-center bg-[#C9A94D] border border-[#C9A94D] rounded-full h-10 w-10 hover:bg-transparent hover:text-[#C9A94D] transition-colors disabled:opacity-50 disabled:cursor-not-allowed" aria-label="Next ratings">
                            <ArrowRight size={20} />
                        </button>
                    </div>
                )}
            </div>

            {propertyRatingsLoading ? (
                <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="flex items-start gap-4 animate-pulse">
                            <div className="h-12 w-12 rounded-full bg-gray-400" />
                            <div className="flex-1 space-y-1">
                                <div className="h-4 w-24 bg-gray-400 rounded" />
                                <div className="h-3 w-full bg-gray-400 rounded" />
                                <div className="h-3 w-3/4 bg-gray-400 rounded" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : propertyRatingsArray.length === 0 ? (
                <p className="text-gray-300">No ratings yet</p>
            ) : (
                <div className="space-y-6">
                    {/* Swiper Slider for Ratings */}
                    <Swiper
                        modules={[Navigation]}
                        spaceBetween={20}
                        slidesPerView={1}
                        navigation={{
                            prevEl: ".swiper-prev-ratings",
                            nextEl: ".swiper-next-ratings",
                            disabledClass: "opacity-50 cursor-not-allowed",
                        }}
                        breakpoints={{
                            0: {
                                slidesPerView: 1,
                                spaceBetween: 16,
                            },
                            768: {
                                slidesPerView: 3,
                                spaceBetween: 20,
                            },
                        }}
                        loop={false}
                        onSwiper={(swiper) => {
                            swiperRef.current = swiper;
                        }}
                        className="ratings-swiper"
                    >
                        {propertyRatingsArray.map((r) => {
                            // Type guard to check if userId is an object
                            const isUserObject = typeof r.userId === "object" && r.userId !== null;
                            const userName = isUserObject ? (r.userId as IUser).name : "Unknown User";
                            const userProfileImg = isUserObject ? (r.userId as IUser).profileImg : undefined;
                            const userInitial = isUserObject ? (r.userId as IUser).name?.[0] : "U";

                            return (
                                <SwiperSlide key={r._id}>
                                    <div className="gap-2 h-full p-4 rounded-lg border border-[#C9A94D] transition-colors">
                                        {/* Profile image or avatar */}
                                        <div className="flex items-start gap-4">
                                            {userProfileImg ? <img src={userProfileImg} alt={userName} className="h-12 w-12 rounded-full object-cover flex-shrink-0" /> : <div className="h-12 w-12 rounded-full bg-gray-500 flex items-center justify-center text-white font-bold flex-shrink-0">{userInitial}</div>}
                                            <div className="flex-1 min-w-0">
                                                <p className="text-white font-semibold truncate">{userName}</p>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <SingleStarRating rating={r.overallExperience} size={16} />
                                                    <p className="text-sm text-[#C9A94D] whitespace-nowrap">{r.overallExperience.toFixed(1)}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Rating info */}

                                        {r.description && <p className="text-gray-300 text-sm line-clamp-3 mt-2">{r.description}</p>}
                                    </div>
                                </SwiperSlide>
                            );
                        })}
                    </Swiper>
                </div>
            )}
        </div>
    );
}

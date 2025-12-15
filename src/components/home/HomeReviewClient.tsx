"use client";

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { ArrowLeft, ArrowRight } from "lucide-react";
import "swiper/css";
import "swiper/css/navigation";
import { useGetSiteRatingsQuery } from "@/redux/features/rating/ratingApi";

export default function HomeReviewClient() {
    const [reviews, setReviews] = useState<any[]>([]);
    const prevRef = useRef<HTMLButtonElement>(null);
    const nextRef = useRef<HTMLButtonElement>(null);

    const { data: siteratings } = useGetSiteRatingsQuery({ page: 1, limit: 100 });

    useEffect(() => {
        if (siteratings?.success && siteratings.data) {
            setReviews(siteratings.data);
        }
    }, [siteratings]);

    const getImageUrl = (imagePath?: string) => {
        if (!imagePath) return null;
        if (imagePath.startsWith("http")) return imagePath;
        return `${process.env.NEXT_PUBLIC_BASE_API || ""}${imagePath}`;
    };

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((word) => word[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    // Create display slides with duplicates for seamless loop
    const getDisplaySlides = () => {
        if (reviews.length === 0) return [];

        // If we have less than 3 reviews, duplicate to fill space
        if (reviews.length < 3) {
            const duplicated = [];
            while (duplicated.length < 3) {
                duplicated.push(...reviews);
            }
            return duplicated.slice(0, 3);
        }

        // For 3 or more reviews, add duplicates at both ends for seamless loop
        return [
            ...reviews.slice(-2), // Last 2 items at beginning
            ...reviews, // All original items
            ...reviews.slice(0, 2), // First 2 items at end
        ];
    };

    const displaySlides = getDisplaySlides();

    return (
        <div className="py-16">
            <div className="container mx-auto">
                <div className="mx-4 md:mx-0">
                    <div className="flex md:items-center justify-between flex-col md:flex-row mb-10">
                        <div className="mx-4 md:mx-0">
                            <h1 className="text-2xl md:text-[32px] font-bold text-[#C9A94D]">Trusted Reviews</h1>
                            <p className="text-[#D4BA71]">What our clients say about us</p>
                        </div>

                        <div className="flex justify-end items-center mt-4 gap-4">
                            <button ref={prevRef} className="flex items-center justify-center bg-[#C9A94D] border border-[#C9A94D] rounded-full h-12 w-12 hover:bg-transparent hover:text-[#C9A94D]">
                                <ArrowLeft />
                            </button>
                            <button ref={nextRef} className="flex items-center justify-center bg-[#C9A94D] border border-[#C9A94D] rounded-full h-12 w-12 hover:bg-transparent hover:text-[#C9A94D]">
                                <ArrowRight />
                            </button>
                        </div>
                    </div>

                    {displaySlides.length > 0 && (
                        <Swiper
                            modules={[Navigation]}
                            spaceBetween={24}
                            slidesPerView={"auto"}
                            centeredSlides={true}
                            loop={true}
                            initialSlide={2} // Start at position that shows 3 real slides
                            navigation={{
                                prevEl: prevRef.current,
                                nextEl: nextRef.current,
                            }}
                            onBeforeInit={(swiper) => {
                                // @ts-expect-error: Swiper types don't know about dynamic navigation refs
                                swiper.params.navigation.prevEl = prevRef.current;
                                // @ts-expect-error: Swiper types don't know about dynamic navigation refs
                                swiper.params.navigation.nextEl = nextRef.current;
                            }}
                            breakpoints={{
                                0: { slidesPerView: 1, spaceBetween: 16 },
                                640: { slidesPerView: 1.2, spaceBetween: 16 },
                                768: { slidesPerView: 2.2, spaceBetween: 20 },
                                1024: { slidesPerView: 3, spaceBetween: 24 },
                            }}
                        >
                            {displaySlides.map((review, index) => {
                                const imageUrl = getImageUrl(review.userId?.profileImg);
                                const userName = review.userId?.name || "User";
                                const initials = getInitials(userName);

                                return (
                                    <SwiperSlide key={`${review._id}-${index}`} style={{ width: "auto" }}>
                                        {({ isActive }) => (
                                            <div className={`transition-transform duration-300 p-6 my-4 bg-[#FAF6ED] rounded-2xl shadow-md ${isActive ? "scale-110 rounded-2xl border-b-8 border-[#135E9A]" : "scale-95"}`}>
                                                <p className="text-[#667085] text-[14px] mb-8">{review.description || "Great experience!"}</p>
                                                <div className="flex items-center gap-4">
                                                    {imageUrl ? (
                                                        <Image
                                                            src={imageUrl}
                                                            alt={userName}
                                                            width={60}
                                                            height={60}
                                                            className="rounded-full object-cover h-15 w-15"
                                                            onError={(e) => {
                                                                (e.target as HTMLImageElement).style.display = "none";
                                                                const parent = (e.target as HTMLImageElement).parentElement;
                                                                if (parent) {
                                                                    const avatarDiv = document.createElement("div");
                                                                    avatarDiv.className = "w-15 h-15 rounded-full bg-[#C9A94D] flex items-center justify-center text-white font-bold text-lg";
                                                                    avatarDiv.textContent = initials;
                                                                    parent.appendChild(avatarDiv);
                                                                }
                                                            }}
                                                        />
                                                    ) : (
                                                        <div className="w-15 h-15 rounded-full bg-[#C9A94D] flex items-center justify-center text-white font-bold text-lg">{initials}</div>
                                                    )}
                                                    <div>
                                                        <h3 className="font-bold text-[#344054] text-[18px]">{userName}</h3>
                                                        <p className="text-[#667085] text-[14px]">{review.country || "Unknown"}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </SwiperSlide>
                                );
                            })}
                        </Swiper>
                    )}
                </div>
            </div>
        </div>
    );
}

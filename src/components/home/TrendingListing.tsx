// "use client";

// import React, { useEffect, useState } from "react";
// import PropertyCard from "@/components/PropertyCard";
// import { Property } from "@/types/proparty";
// import { ArrowLeft, ArrowRight } from "lucide-react";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Navigation, Grid } from "swiper/modules";

// import "swiper/css";
// import "swiper/css/navigation";
// import "swiper/css/grid";

// export default function TrendingListing() {
//     const [properties, setProperties] = useState<Property[]>([]);

//     useEffect(() => {
//         fetch("/data/proparties.json")
//             .then((res) => res.json())
//             .then((data) => setProperties(data.data))
//             .catch((err) => console.error(err));
//     }, []);

//     return (
//         <div className="py-16">
//             <div className="container mx-auto">
//                 <div className="mx-4 md:mx-0">
//                     <div className=" mb-10">
//                         <h1 className="text-2xl md:text-[32px] font-bold text-[#C9A94D]">Trending Listings</h1>
//                         <p className="text-[#D4BA71]">A selection of listings verified for quality</p>
//                     </div>

//                     <Swiper
//                         modules={[Navigation, Grid]}
//                         spaceBetween={24}
//                         slidesPerView={2} // 2 cards visible per view
//                         grid={{ rows: 1, fill: "row" }} // single row
//                         navigation={{
//                             prevEl: ".swiper-prev",
//                             nextEl: ".swiper-next",
//                         }}
//                         breakpoints={{
//                             0: { slidesPerView: 1 }, // mobile 1 per view
//                             768: { slidesPerView: 2 }, // tablet+ 2 per view
//                         }}
//                         loop={false}
//                     >
//                         {properties.map((property) => (
//                             <SwiperSlide key={property.token}>
//                                 <PropertyCard property={property} />
//                             </SwiperSlide>
//                         ))}
//                     </Swiper>

//                     {/* Navigation Buttons */}
//                     <div className="flex justify-end items-center mt-4 gap-4">
//                         <button className="swiper-prev flex items-center justify-center bg-[#C9A94D] border border-[#C9A94D] rounded-full h-12 w-12 hover:bg-transparent hover:text-[#C9A94D]">
//                             <ArrowLeft />
//                         </button>
//                         <button className="swiper-next flex items-center justify-center bg-[#C9A94D] border border-[#C9A94D] rounded-full h-12 w-12 hover:bg-transparent hover:text-[#C9A94D]">
//                             <ArrowRight />
//                         </button>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }

"use client";

import React from "react";
import PropertyCard2 from "@/components/PropertyCard2";
import { useGetAllPropertiesQuery } from "@/redux/features/property/propertyApi";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Grid } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/grid";

export default function TrendingListing() {
    const { data, isLoading, error } = useGetAllPropertiesQuery({
        page: 1,
        limit: 10, // Limit for trending listings
        status: "published",
        // You can add trending-specific filters here if your API supports them
        // isTrending: true,
        // sort: "views" or "bookings" for trending
    });

    const properties = data?.data || [];

    if (isLoading) {
        return (
            <div className="py-16">
                <div className="container mx-auto">
                    <div className="mx-4 md:mx-0">
                        <div className="mb-10">
                            <h1 className="text-2xl md:text-[32px] font-bold text-[#C9A94D]">Trending Listings</h1>
                            <p className="text-[#D4BA71]">A selection of listings verified for quality</p>
                        </div>
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
            <div className="py-16">
                <div className="container mx-auto">
                    <div className="mx-4 md:mx-0">
                        <div className="mb-10">
                            <h1 className="text-2xl md:text-[32px] font-bold text-[#C9A94D]">Trending Listings</h1>
                            <p className="text-[#D4BA71]">A selection of listings verified for quality</p>
                        </div>
                        <div className="text-center text-red-500 py-8">Failed to load trending listings</div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="py-16">
            <div className="container mx-auto">
                <div className="mx-4 md:mx-0">
                    <div className="mb-10">
                        <h1 className="text-2xl md:text-[32px] font-bold text-[#C9A94D]">Trending Listings</h1>
                        <p className="text-[#D4BA71]">A selection of listings verified for quality</p>
                    </div>

                    {properties.length > 0 ? (
                        <>
                            <Swiper
                                modules={[Navigation, Grid]}
                                spaceBetween={24}
                                slidesPerView={2}
                                grid={{ rows: 1, fill: "row" }}
                                navigation={{
                                    prevEl: ".swiper-prev",
                                    nextEl: ".swiper-next",
                                }}
                                breakpoints={{
                                    0: { slidesPerView: 1 },
                                    768: { slidesPerView: 2 },
                                }}
                                loop={false}
                            >
                                {properties.map((property) => (
                                    <SwiperSlide key={property._id}>
                                        <PropertyCard2 property={property} />
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
                        <div className="text-center text-[#C9A94D] py-8">No trending listings available</div>
                    )}
                </div>
            </div>
        </div>
    );
}

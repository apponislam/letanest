// "use client";

// import React, { useEffect, useState } from "react";
// import Image from "next/image";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Navigation } from "swiper/modules";
// import { ArrowLeft, ArrowRight } from "lucide-react";

// import "swiper/css";
// import "swiper/css/navigation";

// type Review = {
//     id: string;
//     reviewer: string;
//     profile_image: string;
//     rating: number;
//     comment: string;
//     country: string;
// };

// export default function HomeReviewClient() {
//     const [reviews, setReviews] = useState<Review[]>([]);

//     useEffect(() => {
//         fetch("/data/reviews.json")
//             .then((res) => res.json())
//             .then((data) => setReviews(data.data))
//             .catch((err) => console.error(err));
//     }, []);

//     return (
//         <div className="py-16">
//             <div className="container mx-auto">
//                 <div className="mx-4 md:mx-0">
//                     <div className="flex md:items-center justify-between flex-col md:flex-row mb-10">
//                         <div className="mx-4 md:mx-0 ">
//                             <h1 className="text-2xl md:text-[32px] font-bold text-[#C9A94D]">Client Reviews</h1>
//                             <p className="text-[#D4BA71]">What our clients say about us</p>
//                         </div>

//                         <div className="flex justify-end items-center mt-4 gap-4">
//                             <button className="swiper-prev flex items-center justify-center bg-[#C9A94D] border border-[#C9A94D] rounded-full h-12 w-12 hover:bg-transparent hover:text-[#C9A94D]">
//                                 <ArrowLeft />
//                             </button>
//                             <button className="swiper-next flex items-center justify-center bg-[#C9A94D] border border-[#C9A94D] rounded-full h-12 w-12 hover:bg-transparent hover:text-[#C9A94D]">
//                                 <ArrowRight />
//                             </button>
//                         </div>
//                     </div>

//                     <Swiper
//                         modules={[Navigation]}
//                         spaceBetween={24}
//                         slidesPerView={3}
//                         centeredSlides={true}
//                         loop={true}
//                         navigation={{
//                             prevEl: ".swiper-prev",
//                             nextEl: ".swiper-next",
//                         }}
//                         breakpoints={{
//                             0: { slidesPerView: 1, centeredSlides: true },
//                             768: { slidesPerView: 3, centeredSlides: true },
//                         }}
//                     >
//                         {reviews.map((review) => (
//                             <SwiperSlide key={review.id}>
//                                 {({ isActive }) => (
//                                     <div className={`transition-transform duration-300 p-6 my-4 bg-[#FAF6ED] rounded-2xl shadow-md ${isActive ? "scale-110 rounded-2xl border-b-8 border-[#135E9A]" : "scale-95"}`}>
//                                         <p className="text-[#667085] text-[14px] mb-8">{review.comment}</p>
//                                         <div className="flex items-center gap-4 mb-4">
//                                             <Image src={review.profile_image} alt={review.reviewer} width={60} height={60} className="rounded-full object-cover" />
//                                             <div>
//                                                 <h3 className="font-bold text-[#344054] text-[18px]">{review.reviewer}</h3>
//                                                 <p className="text-[#667085] text-[14px]">{review.country}</p>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 )}
//                             </SwiperSlide>
//                         ))}
//                     </Swiper>
//                 </div>
//             </div>
//         </div>
//     );
// }

"use client";

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { ArrowLeft, ArrowRight } from "lucide-react";

import "swiper/css";
import "swiper/css/navigation";
import { Review } from "@/types/review";

export default function HomeReviewClient() {
    const [reviews, setReviews] = useState<Review[]>([]);
    const prevRef = useRef<HTMLButtonElement>(null);
    const nextRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        fetch("/data/homereview.json")
            .then((res) => res.json())
            .then((data) => setReviews(data.data))
            .catch((err) => console.error(err));
    }, []);

    return (
        <div className="py-16">
            <div className="container mx-auto">
                <div className="mx-4 md:mx-0">
                    <div className="flex md:items-center justify-between flex-col md:flex-row mb-10">
                        <div className="mx-4 md:mx-0">
                            <h1 className="text-2xl md:text-[32px] font-bold text-[#C9A94D]">Client Reviews</h1>
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

                    <Swiper
                        modules={[Navigation]}
                        spaceBetween={24}
                        slidesPerView={"auto"}
                        centeredSlides={true}
                        loop={true}
                        navigation={{
                            prevEl: prevRef.current,
                            nextEl: nextRef.current,
                        }}
                        onBeforeInit={(swiper) => {
                            // @ts-expect-error: Swiper types don’t know about dynamic navigation refs
                            swiper.params.navigation.prevEl = prevRef.current;
                            // @ts-expect-error: Swiper types don’t know about dynamic navigation refs
                            swiper.params.navigation.nextEl = nextRef.current;
                        }}
                        breakpoints={{
                            0: { slidesPerView: 1, spaceBetween: 16 },
                            640: { slidesPerView: 1.2, spaceBetween: 16 },
                            768: { slidesPerView: 2.2, spaceBetween: 20 },
                            1024: { slidesPerView: 3, spaceBetween: 24 },
                        }}
                    >
                        {reviews.map((review) => (
                            <SwiperSlide key={review.id} style={{ width: "auto" }}>
                                {({ isActive }) => (
                                    <div className={`transition-transform duration-300 p-6 my-4 bg-[#FAF6ED] rounded-2xl shadow-md ${isActive ? "scale-110 rounded-2xl border-b-8 border-[#135E9A]" : "scale-95"}`}>
                                        <p className="text-[#667085] text-[14px] mb-8">{review.comment}</p>
                                        <div className="flex items-center gap-4 mb-4">
                                            <Image src={review.profile_image} alt={review.reviewer} width={60} height={60} className="rounded-full object-cover" />
                                            <div>
                                                <h3 className="font-bold text-[#344054] text-[18px]">{review.reviewer}</h3>
                                                <p className="text-[#667085] text-[14px]">{review.country}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>
        </div>
    );
}

"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { Property } from "@/types/proparty";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import SingleStarRating from "@/utils/SingleStarRating";

export default function PropertyPage() {
    const [property, setProperty] = useState<Property | null>(null);
    const params = useParams();
    const { id } = params;

    useEffect(() => {
        fetch("/data/proparties.json")
            .then((res) => res.json())
            .then((data) => {
                console.log("_id from URL:", id);
                console.log(
                    "All IDs:",
                    data.data.map((p: Property) => p._id)
                );
                const found = data.data.find((p: Property) => p._id === id);
                setProperty(found || null);
            })
            .catch((err) => console.error(err));
    }, [id]);

    console.log(property);

    if (!property) return <p>Loading...</p>;

    return (
        <div className="container mx-auto py-10">
            <div className="mx-4 md:mx-0">
                <div className="mb-8">
                    <div className="relative w-full">
                        {/* Fixed title & token at top */}
                        <div className="absolute bottom-6 left-6 z-10   text-white">
                            <h2 className="text-xl md:text-[40px] font-bold md:mb-4">{property.title}</h2>
                            <p className="text-[16px] md:text-2xl font-bold">Token - {property.token}</p>
                        </div>

                        <Swiper
                            modules={[Navigation]}
                            spaceBetween={16}
                            slidesPerView={1}
                            navigation={{
                                prevEl: ".swiper-prev",
                                nextEl: ".swiper-next",
                            }}
                            loop={true}
                            allowTouchMove={false} // disables swipe
                        >
                            {property.images.map((img, idx) => (
                                <SwiperSlide key={idx}>
                                    <div className="relative w-full h-64 md:h-[600px] rounded-lg overflow-hidden">
                                        <Image src={img} alt={property.title} fill className="object-cover" />
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>

                    <div className="flex items-center justify-center gap-2 mt-2">
                        <button className="swiper-prev flex items-center justify-center bg-[#C9A94D] border border-[#C9A94D] rounded-full h-12 w-12 hover:bg-transparent hover:text-[#C9A94D]">
                            <ArrowLeft />
                        </button>

                        <button className="swiper-next flex items-center justify-center bg-[#C9A94D] border border-[#C9A94D] rounded-full h-12 w-12 hover:bg-transparent hover:text-[#C9A94D]">
                            <ArrowRight />
                        </button>
                    </div>
                </div>
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="md:w-6/8 p-5 ">
                        <div className="flex gap-4 items-start mb-6">
                            <div className="text-white">
                                <h2 className="text-xl md:text-[40px] font-bold md:mb-4">{property.title}</h2>
                                <p className="text-[16px] md:text-2xl font-bold">Token - {property.token}</p>
                            </div>
                            <div className="flex items-center gap-3 w-56">
                                <SingleStarRating rating={property.rating} />
                                <p className="text-2xl font-bold text-[#C9A94D]">{property.rating}</p>
                                <p className="text-xl text-[#C9A94D]">{`(${property.reviews} reviews)`}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 mb-7">
                            <div className="px-6 border-r border-white">
                                <Image className="mx-auto mb-3" src="/listing/guests.png" alt="Guests" height={24} width={24}></Image>
                                <p className="text-center text-white">{property.guests} Guests</p>
                            </div>
                            <div className="px-6 border-r border-white">
                                <Image className="mx-auto mb-3" src="/listing/beds.png" alt="Guests" height={24} width={24}></Image>
                                <p className="text-center text-white">{property.rooms} Bedrooms</p>
                            </div>
                            <div className="px-6">
                                <Image className="mx-auto mb-3" src="/listing/bathrooms.png" alt="Guests" height={24} width={24}></Image>
                                <p className="text-center text-white">{property.bathrooms} Bathroom</p>
                            </div>
                        </div>
                        <div className="pb-12 border-b border-white">
                            <h1 className="text-[32px] text-white mb-4 font-bold">Description</h1>
                            <p className="text-[#E8E9EC]">{property.description}</p>
                        </div>
                        <div className="pb-12 border-b border-white">
                            <h1 className="text-[32px] text-white mb-4 font-bold">What this place offers</h1>
                            <p className="text-[#E8E9EC]">{property.description}</p>
                        </div>
                        <h1 className="text-9xl">hii</h1>
                        <h1 className="text-9xl">hii</h1>
                        <h1 className="text-9xl">hii</h1>
                        <h1 className="text-9xl">hii</h1>
                        <h1 className="text-9xl">hii</h1>
                        <h1 className="text-9xl">hii</h1>
                        <h1 className="text-9xl">hii</h1>
                        <h1 className="text-9xl">hii</h1>
                        <h1 className="text-9xl">hii</h1>
                        <h1 className="text-9xl">hii</h1>
                        <h1 className="text-9xl">hii</h1>
                        <h1 className="text-9xl">hii</h1>
                        <h1 className="text-9xl">hii</h1>
                        <h1 className="text-9xl">hii</h1>
                        <h1 className="text-9xl">hii</h1>
                        <h1 className="text-9xl">hii</h1>
                        <h1 className="text-9xl">hii</h1>
                        <h1 className="text-9xl">hii</h1>
                        <h1 className="text-9xl">hii</h1>
                    </div>

                    {/* Right column - 1/3 sticky */}
                    <div className="md:w-2/8">
                        <div className="bg-yellow-400 p-5 md:sticky top-20 z-10">1/3 - sticks to top when scrolling</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

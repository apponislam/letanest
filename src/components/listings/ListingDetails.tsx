"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { Property } from "@/types/proparty";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { ArrowLeft, ArrowRight, MessagesSquare } from "lucide-react";
import SingleStarRating from "@/utils/SingleStarRating";
import { Button } from "../ui/button";

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

    const amenitiesIcons: Record<string, string> = {
        Wifi: "/listing/wifi.png",
        TV: "/listing/tv.png",
        Baseball: "/listing/baseball.png",
        "Washer & Dyer": "/listing/guidanceLaundry.png",
        Gym: "/listing/gym.png",
        "Privat Balcony": "/listing/PrivatBalcony.png",
        Swimming: "/listing/swimming.png",
        Parking: "/listing/parking.png",
    };

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
                        <div className="pb-6 md:pb-12 mb-6 md:mb-12 border-b border-[#C9A94D]">
                            <h1 className="text-[32px] text-white mb-4 font-bold">Description</h1>
                            <p className="text-[#E8E9EC]">{property.description}</p>
                        </div>
                        <div className="pb-6 md:pb-12 mb-6 md:mb-12 border-b border-[#C9A94D]">
                            <h1 className="text-[32px] text-white mb-4 font-bold">What this place offers</h1>
                            <div className="grid grid-cols-2 gap-2">
                                {property?.amenities.map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-3 p-4">
                                        <div className="relative w-8 h-8 shrink-0">
                                            <Image src={amenitiesIcons[item] || "/listing/PrivatBalcony.png"} alt={item} fill className="object-contain" />
                                        </div>
                                        <span className="text-[#B6BAC3] text-lg">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="pb-6 md:pb-12 mb-6 md:mb-12 border-b border-[#C9A94D]">
                            <h1 className="text-[32px] text-white mb-4 font-bold">Where you’ll sleep</h1>
                            <div className="space-y-12">
                                {property?.sleeping_arrangements.map((room, idx) => (
                                    <div key={idx} className="flex flex-col items-center">
                                        {/* Grid of 3 images */}
                                        <div className="grid grid-cols-3 gap-4 w-full">
                                            {room.images.map((img, i) => (
                                                <div key={i} className="relative w-full h-64 rounded-lg overflow-hidden">
                                                    <Image src={img} alt={`${room.bedroom} image ${i + 1}`} fill className="object-cover h-64" />
                                                </div>
                                            ))}
                                        </div>

                                        {/* Bedroom info */}
                                        <div className="mt-4 text-center">
                                            <h3 className="text-white text-[32px]">{room.bedroom}</h3>
                                            <p className="text-[#B6BAC3] text-lg">{room.beds}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="pb-6 md:pb-12 mb-6 md:mb-12 border-b border-[#C9A94D]">
                            <h1 className="text-[32px] text-white mb-4 font-bold">Meet The Host</h1>
                            <div className="flex items-center gap-12">
                                <div className="flex items-center gap-5">
                                    <Image src="/listing/avatar.jpg" alt="Avatar" height={100} width={100} className="object-contain rounded-full border border-white" />
                                    <div>
                                        <p className="text-2xl text-white">{property.host.name}</p>
                                        <p className="text-white">{property.host.createdAt ? new Date(property.host.createdAt).toLocaleDateString() : "N/A"}</p>
                                        <div className="flex items-center gap-3">
                                            <SingleStarRating rating={property.host.totalrating} size={20} />
                                            <p className="text-[14px] font-bold text-[#C9A94D]">{property.host.totalrating}</p>
                                            <p className="text-[13px] text-[#C9A94D]">Host Rating</p>
                                        </div>
                                    </div>
                                </div>
                                <Button className="flex items-center gap-2 text-white text-2xl bg-[#C9A94D] hover:bg-[#af8d28] rounded-xl h-auto py-5" size="lg">
                                    <div className="flex items-center justify-center h-6 w-6">
                                        <MessagesSquare className="h-full w-full" />
                                    </div>
                                    Chat with Host
                                </Button>
                            </div>
                        </div>
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

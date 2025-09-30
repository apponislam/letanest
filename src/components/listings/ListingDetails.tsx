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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "../ui/button";
import Link from "next/link";

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
                    <div className="md:w-6/8 p-2 md:p-5 ">
                        <div className="flex gap-4 items-start mb-6 flex-col md:flex-row">
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
                        <div className="flex items-center gap-4 mb-7 flex-col md:flex-row">
                            <div className="py-3 md:py-0 px-0 md:px-6 border-b md:border-b-0 md:border-r border-white w-full md:w-auto">
                                <Image className="mx-auto mb-3" src="/listing/guests.png" alt="Guests" height={24} width={24}></Image>
                                <p className="text-center text-white">{property.guests} Guests</p>
                            </div>
                            <div className="py-3 md:py-0 px-0 md:px-6 border-b md:border-b-0 md:border-r border-white w-full md:w-auto ">
                                <Image className="mx-auto mb-3" src="/listing/beds.png" alt="Guests" height={24} width={24}></Image>
                                <p className="text-center text-white">{property.rooms} Bedrooms</p>
                            </div>
                            <div className="py-3 md:py-0 px-0 md:px-6  w-full md:w-auto">
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
                                    <div key={idx} className="flex items-center gap-3 md:p-4">
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
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full">
                                            {room.images.map((img, i) => (
                                                <div key={i} className="relative w-full h-32 md:h-64 rounded-lg overflow-hidden">
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
                            <div className="flex md:items-center gap-6 md:gap-12 flex-col md:flex-row">
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
                                <div>
                                    <button className="flex items-center gap-2 font-light text-white text-xl md:text-2xl bg-[#C9A94D] hover:bg-[#af8d28] rounded-xl h-auto py-4 px-6">
                                        <MessagesSquare className="md:h-6 md:w-6  h-5 w-5" />
                                        Chat with Host
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="pb-6 md:pb-12 mb-6 md:mb-12 border-b border-[#C9A94D]">
                            <h1 className="text-[32px] text-white mb-4 font-bold">Location</h1>
                            <div className="p-5 bg-[#434D64]">
                                <div className="mb-6">
                                    <iframe width="100%" height="300" loading="lazy" style={{ border: 0 }} allowFullScreen referrerPolicy="no-referrer-when-downgrade" src={`https://www.google.com/maps?q=${property.location.coordinates.lat},${property.location.coordinates.lng}&hl=es;z=14&output=embed`} />
                                </div>
                                <div>
                                    <h1 className="text-[32px] text-white mb-4 font-bold">What’s nearby</h1>
                                    <div className="grid grid-cols-2 gap-4">
                                        {property.location.nearby.map((place, idx) => (
                                            <div key={idx} className="flex flex-col">
                                                <span className="text-[18px] text-white">
                                                    {place.place} - {place.distance}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="pb-6 md:pb-12 mb-6 md:mb-12">
                            <h1 className="text-[32px] text-white mb-4 font-bold">Things to know</h1>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                                <div>
                                    <div className="flex items-center gap-4 mb-2">
                                        <Image src="/listing/ban.png" alt="House Rules" height={24} width={24}></Image>
                                        <h1 className="text-2xl text-white font-bold">House Rules</h1>
                                    </div>
                                    <p className="text-[18px] text-[#B6BAC3]">The house rules section lists check-in and check-out times, smoking and pet policies, and cancellation terms with simple icons for quick understanding. The layout is clean, minimal, and easy to scan.</p>
                                </div>
                                <div>
                                    <div className="flex items-center gap-4 mb-2">
                                        <Image src="/listing/heart-pulse.png" alt="House Rules" height={24} width={24}></Image>
                                        <h1 className="text-2xl text-white font-bold">Health & Safety</h1>
                                    </div>
                                    <p className="text-[18px] text-[#B6BAC3]">The house rules section lists check-in and check-out times, smoking and pet policies, and cancellation terms with simple icons for quick understanding. The layout is clean, minimal, and easy to scan.</p>
                                </div>
                            </div>
                            <div>
                                <div className="flex items-center gap-4 mb-2">
                                    <Image src="/listing/menu-right-square-alt.png" alt="House Rules" height={24} width={24}></Image>
                                    <h1 className="text-2xl text-white font-bold">Cancellation Policy</h1>
                                </div>
                                <p className="text-[18px] text-[#B6BAC3]">The house rules section lists check-in and check-out times, smoking and pet policies, and cancellation terms with simple icons for quick understanding. The layout is clean, minimal, and easy to scan.</p>
                            </div>
                        </div>
                    </div>

                    {/* Right column - 1/3 sticky */}
                    <div className="md:w-2/8">
                        <div className="md:sticky top-24 z-10">
                            <div className="border border-[#C9A94D] rounded-[20px] bg-[#E8E9EC] py-4 px-8 mb-10">
                                <h1 className="text-[32px] mb-2 font-bold">£{property.price_per_night}</h1>
                                <div className="flex items-center gap-2 mb-6">
                                    <SingleStarRating rating={property.rating} size={20} />
                                    <p className="text-sm font-bold text-[#C9A94D]">{property.rating}</p>
                                    <p className="text-sm text-[#C9A94D]">{`(${property.reviews} reviews)`}</p>
                                </div>
                                {/* <button className="w-full bg-[#C9A94D] text-white py-3 rounded-[6px] hover:bg-[#af8d28] transition">Book Now</button> */}
                                <Dialog>
                                    <DialogTrigger asChild className="text-white">
                                        <Button className="w-full bg-[#C9A94D] text-white py-3 rounded-[6px] hover:bg-[#af8d28] transition">Book Now</Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-md rounded-none border border-[#D4BA71] bg-[#14213D]">
                                        <style jsx global>{`
                                            [data-slot="dialog-close"] {
                                                color: white !important; /* make the X icon white */
                                                opacity: 1 !important; /* fully visible */
                                            }
                                            [data-slot="dialog-close"]:hover {
                                                color: #c9a94d !important; /* gold on hover */
                                            }
                                            [data-slot="dialog-close"] svg {
                                                stroke: currentColor; /* make the X follow the color */
                                            }
                                        `}</style>
                                        <DialogHeader>
                                            <DialogTitle className="text-xl font-bold text-white mb-6 text-center">Almost there! Create a free account in seconds to secure your stay and start chatting with the host.</DialogTitle>
                                        </DialogHeader>
                                        <div className="space-y-4">
                                            <div className="mb-8 flex items-center justify-center">
                                                <Link href="/auth/register">
                                                    <button className="bg-[#C9A94D] text-white px-[54px] py-[10px] rounded-[8px] font-bold">Sign Up</button>
                                                </Link>
                                            </div>
                                            <p className="text-center text-white text-xl font-bold">Already Have an Account?</p>
                                            <div className="flex items-center justify-center">
                                                <Link href="/auth/login">
                                                    <button className="bg-[#626A7D] text-white px-[54px] py-[10px] rounded-[8px] font-bold">Sign In</button>
                                                </Link>
                                            </div>
                                        </div>
                                    </DialogContent>
                                </Dialog>

                                {/* Book Now Dialog */}
                                {/* <Dialog>
                                    <DialogTrigger asChild>
                                        <Button className="w-full bg-[#C9A94D] text-white py-3 rounded-[6px] hover:bg-[#af8d28] transition">Book Now</Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-md">
                                        <DialogHeader>
                                            <DialogTitle className="text-xl font-bold text-[#C9A94D]">Booking Request</DialogTitle>
                                        </DialogHeader>
                                        <div className="space-y-4">
                                            <p className="text-gray-700">Awaiting host confirmation before payment.</p>
                                            <Button className="w-full bg-[#C9A94D] text-white font-bold hover:bg-[#af8d28]">Continue to Checkout</Button>
                                        </div>
                                    </DialogContent>
                                </Dialog> */}

                                <p className="text-[13px]">Awaiting host confirmation before payment.</p>
                            </div>
                            <div className="border border-[#C9A94D] rounded-[20px] bg-[#E8E9EC] py-4 px-8 mb-10">
                                <h1 className="text-[32px] font-bold mb-8">Ask a Question?</h1>
                                <textarea className="border border-[#C9A94D] placeholder:text-[#14213D] text-[#14213D] p-3 w-full h-32 mb-8" placeholder="Contact the host - they’ll be happy to help."></textarea>
                                <button className="w-full bg-[#C9A94D] text-white py-3 rounded-[6px] hover:bg-[#af8d28] transition flex items-center gap-3 justify-center">
                                    <MessagesSquare className="h-6 w-6 " />
                                    Chat with Host
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

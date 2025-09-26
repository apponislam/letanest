import Image from "next/image";
import React from "react";
import { Button } from "../ui/button";
import Link from "next/link";

const BookingCards = () => {
    const cards = [
        {
            icon: "/home/calendar-check-alt.png",
            title: "Booking Made Easy",
            description: "Choose your dates, pick your nest, and relax—it’s that simple. No stress, no hassle, just your stay sorted in minutes.",
            button: "Start Booking",
            link: "/listings",
        },
        {
            icon: "/home/home-roof.png",
            title: "Hosting Made Simple",
            description: " Start hosting in just a few clicks, set your availability, and welcome guests. We take care of the tricky bits so hosting stays simple and fun.",
            button: "Start Hosting",
            link: "/dashboard",
        },
    ];

    return (
        <div className="container mx-auto">
            <div className="flex flex-col gap-6 mx-4 md:mx-0">
                {cards.map((card, idx) => (
                    <div key={idx} className={`rounded-2xl py-6 md:py-14 px-4 md:px-8 transition-all duration-300 ${idx === 0 ? "border border-[#C9A94D]" : "border border-transparent hover:border-[#C9A94D]"}`}>
                        <div className="flex items-center justify-center gap-5 mb-8 flex-col md:flex-row">
                            <Image src={card.icon} height={42} width={42} alt={card.title} />
                            <h1 className="text-[#C9A94D] text-2xl md:text-[32px] font-bold">{card.title}</h1>
                        </div>
                        <div className="flex items-center justify-between gap-4 md:gap-8 flex-col md:flex-row">
                            <p className=" text-[16px] md:text-2xl text-white">{card.description}</p>
                            <Link href={card.link}>
                                <Button className="md:px-[72px] md:py-[26px] rounded-xl md:rounded-[20px] bg-[#C9A94D] text-[16px] md:text-[24px] text-white h-auto hover:bg-[#af8d28]">{card.button}</Button>
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BookingCards;

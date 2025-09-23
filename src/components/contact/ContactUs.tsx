"use client";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import ContactUsForm from "../forms/contact/contact-us-form";
import { Host } from "@/types/host";

const ContactUs = () => {
    const router = useRouter();

    const handleClick = () => {
        router.back();
    };

    const [host, setHost] = useState<Host | null>(null);

    useEffect(() => {
        const fetchHost = async () => {
            try {
                const res = await fetch("/data/host.json");
                const data: Host[] = await res.json();
                setHost(data[0]);
            } catch (error) {
                console.error("Failed to fetch host:", error);
            }
        };

        fetchHost();
    }, []);

    if (!host) return <p>Loading...</p>;
    return (
        <>
            <div className="container mx-auto">
                <div className="mx-4 md:mx-0">
                    <div className="p-5 border border-[#FFFFFF59] flex justify-between items-center mb-8 flex-col md:flex-row gap-4">
                        <div className="text-[#C9A94D] flex items-center gap-3 text-[18px] cursor-pointer hover:underline" onClick={handleClick}>
                            <ArrowLeft />
                            <p>Back To Previous</p>
                        </div>
                        <h1 className="text-2xl text-[#C9A94D]">Terms & Conditions</h1>
                        <div className="flex items-center gap-2">
                            <Image src={host.image} alt={host.name} width={30} height={30} className="rounded-full border-[0.3px] border-[#C9A94D] object-cover" />
                            <div className="text-[#C9A94D] text-[18px]">{host.role}</div>
                        </div>
                    </div>

                    <div className="text-[#C9A94D]">
                        <div className="w-full relative mb-6 md:mb-14">
                            <Image src="/contact/contact-head.png" alt="contact us" width={1920} height={600} className="w-full h-40 md:h-auto rounded-[12px]" />
                        </div>
                        <h3 className="text-xl md:text-2xl mb-6 md:mb-14">Get Started</h3>
                        <h1 className="text-2xl md:text-[40px] font-bold mb-6 md:mb-14">Get in touch with us. We&apos;re here to assist you.</h1>

                        <div className="mb-6 md:mb-14">
                            <ContactUsForm></ContactUsForm>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-20">
                            <div>
                                <p className="md:text-[18px] mb-6">Contact Info</p>
                                <h2 className="text-xl md:text-[28px] font-bold">We are always happy to assist you</h2>
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="md:text-[18px] font-bold mb-6">Email Address</h3>
                                    <span className="relative block h-1 w-7 bg-[#C9A94D] mb-6" />
                                    <a href="mailto:help@info.com" className="md:text-[18px] hover:underline">
                                        help@info.com
                                    </a>
                                    <p className="md:text-[18px]">
                                        Assistance hours: <br /> Monday - Friday 6 am to 8 pm EST
                                    </p>
                                </div>
                                <div>
                                    <h3 className="md:text-[18px] font-bold mb-6">Number</h3>
                                    <span className="relative block h-1 w-7 bg-[#C9A94D] mb-6" />
                                    <a href="tel:+180899834256" className="md:text-[18px] hover:underline">
                                        (808) 998-34256
                                    </a>
                                    <p className="md:text-[18px]">
                                        Assistance hours: <br /> Monday - Friday 6 am to 8 pm EST
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ContactUs;

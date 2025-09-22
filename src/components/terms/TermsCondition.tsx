"use client";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

interface Host {
    id: number;
    name: string;
    image: string;
    role: string;
}

const TermsCondition = () => {
    const router = useRouter();

    const handleClick = () => {
        router.push("/");
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
                            <p>Back To Home</p>
                        </div>
                        <h1 className="text-2xl text-[#C9A94D]">Terms & Conditions</h1>
                        <div className="flex items-center gap-2">
                            <Image src={host.image} alt={host.name} width={30} height={30} className="rounded-full border-[0.3px] border-[#C9A94D] object-cover" />
                            <div className="text-[#C9A94D] text-[18px]">{host.role}</div>
                        </div>
                    </div>

                    <div className="text-[#C9A94D]">
                        <h1 className="text-[32px] mb-4">Terms & Conditions</h1>
                        <p className="mb-3">
                            Welcome to LETANEST. By using our website and services, you <br className="md:block none" /> agree to the following Terms & Conditions. Please read carefully.
                        </p>
                        <div className="p-5">
                            <div className="mb-6">
                                <h1 className="text-2xl mb-4">1. Booking & Payment</h1>
                                <ul className="list-disc ml-4">
                                    <li>Your booking is confirmed once payment is received and approved by the host.</li>
                                    <li>Please notify the host in advance if you need different timings.</li>
                                </ul>
                            </div>
                            <div className="mb-6">
                                <h1 className="text-2xl mb-4">2. Check-In & Check-Out</h1>
                                <ul className="list-disc ml-4">
                                    <li>Check-in: [Insert time] | Check-out: [Insert time]</li>
                                    <li>Please notify the host in advance if you need different timings.</li>
                                </ul>
                            </div>
                            <div className="mb-6">
                                <h1 className="text-2xl mb-4">3. House Rules</h1>
                                <ul className="list-disc ml-4">
                                    <li>No smoking inside the property.</li>
                                    <li>Pets only if agreed in advance.</li>
                                    <li>Respect neighbours; keep noise to a minimum.</li>
                                    <li>Maximum occupancy: [Insert number].</li>
                                </ul>
                            </div>
                            <div className="mb-6">
                                <h1 className="text-2xl mb-4">4. Cancellations & Refunds</h1>
                                <ul className="list-disc ml-4">
                                    <li>Cancel at least [Insert timeframe] before check-in for a full refund.</li>
                                    <li>Late cancellations or no-shows may not be refundable.</li>
                                </ul>
                            </div>
                            <div className="mb-6">
                                <h1 className="text-2xl mb-4">5. Damage & Liability</h1>
                                <ul className="list-disc ml-4">
                                    <li>Guests are responsible for any damage during their stay.</li>
                                    <li>Hosts are not liable for loss or theft of personal belongings.</li>
                                </ul>
                            </div>
                            <div className="mb-6">
                                <h1 className="text-2xl mb-4">6. Safety & Emergencies</h1>
                                <ul className="list-disc ml-4">
                                    <li>Familiarise yourself with fire exits and emergency procedures.</li>
                                    <li>Contact the host immediately in case of an emergency.</li>
                                </ul>
                            </div>
                            <div className="mb-6">
                                <h1 className="text-2xl mb-4">7. Questions & Communication</h1>
                                <ul className="list-disc ml-4">
                                    <li>Direct any questions about the property or stay to the host.</li>
                                    <li>Hosts may communicate updates or instructions via the website or booking platform</li>
                                </ul>
                            </div>
                            <div className="mb-6">
                                <h1 className="text-2xl mb-4">8. Additional Terms</h1>
                                <ul className="list-disc ml-4">
                                    <li>[Insert property-specific rules, e.g., parking, pool, garden, shared spaces.]</li>
                                </ul>
                            </div>
                            <div className="mb-6">
                                <h1 className="text-2xl mb-4">9. Contact Us</h1>
                                <ul className="list-disc ml-4">
                                    <li>For questions, please contact: </li>
                                    <li>📧 Email: support@[yourwebsitename].com</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default TermsCondition;

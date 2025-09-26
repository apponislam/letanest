"use client";
import { Property } from "@/types/proparty";
import Image from "next/image";
import { useParams } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import { Switch } from "@/components/ui/switch";
import PayInfoForm from "../forms/pay/PayInfo-form";
import PageHeader from "../PageHeader";

const ListingPayment = () => {
    const [property, setProperty] = useState<Property | null>(null);
    const [selected, setSelected] = useState<string | null>(null);
    const [showRules, setShowRules] = useState(false);
    const params = useParams();
    const { id } = params;

    const [enabled, setEnabled] = useState(false);

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

    const agreedFee = 300;
    const bookingFee = 300;

    const peaceOfMindFee = 5;

    const total = useMemo(() => {
        return agreedFee + bookingFee + (enabled ? peaceOfMindFee : 0);
    }, [agreedFee, bookingFee, enabled]);

    if (!property) return <p>Loading...</p>;

    return (
        <>
            <div className="container mx-auto">
                <div className="mx-4 md:mx-0">
                    <PageHeader title={"Listing Payment"}></PageHeader>
                    <div className="text-[#C9A94D]">
                        <div className="max-w-[466px] bg-[#2D3546] mb-6 py-3 md:py-5 px-4 md:px-14 rounded-[12px] mx-auto">
                            <h1 className="font-bold text-center mb-2 text-[18px]">Nest Offer</h1>
                            <div className="flex items-center justify-center mb-2">
                                <Image alt="Property id" src="/listing/pay/home-roof.png" height={24} width={24}></Image>
                                <p>Property ID : {property.token}</p>
                            </div>
                            <div className="flex flex-col gap-2 font-bold text-[18px]">
                                <div className="flex items-center justify-between ">
                                    <h1>Agreed dates</h1>
                                    <h1>${agreedFee}</h1>
                                </div>
                                <div className="flex items-center justify-between">
                                    <h1>Booking Fee</h1>
                                    <h1>${bookingFee}</h1>
                                </div>
                                {enabled && (
                                    <div className="flex items-center justify-between">
                                        <h1>Peace of Mind Guarantee</h1>
                                        <h1>${peaceOfMindFee}</h1>
                                    </div>
                                )}
                                <div className="flex items-center justify-between">
                                    <h1>Total</h1>
                                    <h1>${total}</h1>
                                </div>
                            </div>
                        </div>
                        <div className=" bg-[#2D3546] mb-6 p-[10px] rounded-[8px]">
                            <div className="flex md:items-center justify-between mb-8 flex-col md:flex-row gap-3">
                                <div className="flex items-center gap-3">
                                    <Image alt="Property id" src="/listing/pay/shield.png" height={32} width={32} className="w-8 h-8"></Image>
                                    <div>
                                        <div className="flex items-center gap-5">
                                            <h1 className="text-[18px] font-bold">Peace of Mind Guarantee +${peaceOfMindFee}</h1>
                                            <div
                                                className="relative"
                                                onMouseEnter={() => setShowRules(true)}
                                                onMouseLeave={() => setShowRules(false)}
                                                onClick={() => setShowRules(!showRules)} // optional click toggle
                                            >
                                                <Image alt="Info" src="/listing/pay/info-circle.png" height={24} width={24} className="cursor-pointer w-6" />

                                                {/* Tooltip box */}
                                                {showRules && (
                                                    <div className="absolute right-0 md:left-1/2 top-0 md:top-full z-50 mt-2 w-64 md:w-[520px] bg-[#14213D] text-white text-sm p-6 rounded-[10px] shadow-lg -translate-x-0 md:-translate-x-1/2 border border-[#C9A94D]">
                                                        <h2 className="font-bold mb-2 text-[14px]">Peace of Mind Guarantee</h2>
                                                        <p className="mb-2">Book your stay with confidence! For just £5 per booking, our Peace of Mind Guarantee ensures you’re protected if anything goes wrong.</p>

                                                        <h3 className="font-semibold mb-1 text-[13px]">What’s Covered:</h3>
                                                        <ol className="list-decimal list-outside ml-4 mb-2 text-[13px] space-y-1">
                                                            <li>Host Cancellation – We’ll help you rebook a similar property or provide a full refund.</li>
                                                            <li>Denied Access – Assistance and compensation if you can’t access the property.</li>
                                                            <li>Fraudulent Listings – Refund and help to find a safe alternative.</li>
                                                            <li>Last-Minute Issues – Quick help for cancellations or problems.</li>
                                                        </ol>

                                                        <h3 className="font-semibold mb-1 text-[13px]">How It Works:</h3>
                                                        <ul className="list-disc list-outside text-[13px] ml-4">
                                                            <li>Add the Peace of Mind Guarantee for £5 when confirming your booking.</li>
                                                            <li>Contact us immediately if an issue arises—we handle refunds or rebooking.</li>
                                                            <li>Valid only for bookings made through our platform.</li>
                                                        </ul>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <p>Protect your booking with comprehensive coverage</p>
                                    </div>
                                </div>
                                <div>
                                    <Switch checked={enabled} onCheckedChange={setEnabled} className="scale-110 p-1 h-auto w-10 bg-[#626A7D]" />
                                </div>
                            </div>
                            <div className="flex bg-[#626A7D] rounded-[8px] px-5 py-2 gap-5 flex-col md:flex-row">
                                <Image alt="Property id" src="/listing/pay/shield.png" height={24} width={24}></Image>
                                <p className="text-black">Peach of Mind Guarantee added to your booking</p>
                            </div>
                        </div>
                        <div className="rounded-[4px] border border-[#C9A94D] p-5 mb-20">
                            <div>
                                <h1 className="text-center font-medium text-xl md:text-3xl mb-8 py-3 border-b border-[#414652]">Payment Method</h1>
                            </div>
                            <div className="bg-[#FAF6ED] px-5 py-3 rounded-[12px]">
                                <div className="flex items-center gap-3">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <span className="w-5 h-5 rounded-full border-2 border-black flex items-center justify-center">{selected === "debit" && <span className="w-3 h-3 rounded-full bg-black"></span>}</span>
                                        <h1 className=" md:text-[24px] font-bold text-black ">Debit/Credit Card</h1>
                                        <input type="radio" name="payment" className="hidden" value="debit" checked={selected === "debit"} onChange={() => setSelected("debit")} />
                                    </label>
                                </div>
                                <p className="text-[#090D15] mt-2 text-[14px] md:text-[16px]">
                                    Safe payment Online Credit card needed. Paypal <br className="hidden md:block" /> account needed{" "}
                                </p>
                            </div>
                        </div>
                        {selected && (
                            <div className="max-w-[540px] w-full bg-[#2D3546] mb-6 p-5 mx-auto">
                                <h1 className="text-xl md:text-[32px] pb-6 text-center border-b border-[#E6D7AD] mb-12 md:mb-[100px]">Personal Details</h1>
                                <PayInfoForm></PayInfoForm>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default ListingPayment;

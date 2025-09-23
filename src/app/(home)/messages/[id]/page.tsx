"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { useRouter, useParams } from "next/navigation";
import { initialConversations, people } from "@/components/messages/messages";
import { ArrowLeft } from "lucide-react";

export default function MessageConversationPage() {
    const params = useParams(); // useParams() instead of getting via props
    const router = useRouter();
    const personId = Number(params.id); // now works safely
    const [conversations, setConversations] = useState(initialConversations);
    const [inputText, setInputText] = useState("");

    const messages = useMemo(() => conversations[personId] || [], [conversations, personId]);
    const person = people.find((p) => p.id === personId);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = () => {
        if (!inputText.trim()) return;
        setConversations((prev) => ({
            ...prev,
            [personId]: [...(prev[personId] || []), { from: "Me", text: inputText, avatar: "/avatars/me.png" }],
        }));
        setInputText("");
    };

    if (!person) return <p>Person not found</p>;

    return (
        <div className="h-screen flex flex-col bg-[#B6BAC3]">
            {/* Header */}
            {/* <div className="flex items-center p-4 border-b border-[#C9A94D]">
                <button onClick={() => router.back()} className="mr-4 font-bold text-[#14213D]">
                    Back
                </button>
                <h2 className="font-bold text-[#14213D]">{person.name}</h2>
            </div> */}
            <div className="fixed left-0 right-0 flex items-center p-4 border-b border-[#C9A94D] bg-[#B6BAC3] z-10 w-full">
                <button onClick={() => router.back()} className="mr-4 font-bold text-[#14213D]">
                    <ArrowLeft />
                </button>
                <h2 className="font-bold text-[#14213D]">{person.name}</h2>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-2 space-y-3">
                {messages.map((msg, i) => {
                    if (msg.type === "offer") {
                        return (
                            <div key={i} className={`flex ${msg.from === "Me" ? "justify-end" : "justify-start"}`}>
                                {msg.from !== "Me" && <Image src={msg.avatar} alt={msg.from} width={30} height={30} className="rounded-full mr-2 h-[30px] w-[30px]" />}
                                <div className="bg-[#D4BA71] p-3 rounded-lg w-64">
                                    <p className="font-semibold text-sm mb-1 text-center">Nest Offer</p>
                                    <p className="text-xs flex justify-between">
                                        <span>Property ID:</span>
                                        <span>{msg.propertyId}</span>
                                    </p>
                                    <p className="text-xs flex justify-between">
                                        <span>Agreed dates:</span>
                                        <span>{msg.dates}</span>
                                    </p>
                                    <p className="text-xs flex justify-between">
                                        <span>Agreed Fee:</span>
                                        <span>{msg.agreedFee}</span>
                                    </p>
                                    <p className="text-xs flex justify-between">
                                        <span>Booking Fee:</span>
                                        <span>{msg.bookingFee}</span>
                                    </p>
                                    <p className="text-xs font-semibold flex justify-between">
                                        <span>Total:</span>
                                        <span>{msg.total}</span>
                                    </p>
                                </div>
                                {msg.from === "Me" && <Image src={msg.avatar} alt="Me" width={30} height={30} className="rounded-full ml-2 h-[30px] w-[30px]" />}
                            </div>
                        );
                    } else if (msg.type === "accepted") {
                        return (
                            <div key={i} className={`flex ${msg.from === "Me" ? "justify-end" : "justify-start"}`}>
                                {msg.from !== "Me" && <Image src={msg.avatar} alt={msg.from} width={30} height={30} className="rounded-full mr-2 h-[30px] w-[30px]" />}
                                <div className="bg-green-200 p-3 rounded-lg w-64">
                                    <p className="font-semibold text-sm mb-1 text-center">Offer Accepted</p>
                                    <p className="text-xs flex justify-between">
                                        <span>Property name:</span>
                                        <span>{msg.propertyName || "Radison"}</span>
                                    </p>
                                    <p className="text-xs flex justify-between">
                                        <span>Address:</span>
                                        <span>{msg.address || "New City"}</span>
                                    </p>
                                    <p className="text-xs flex justify-between">
                                        <span>Property Manager:</span>
                                        <span>{msg.manager || "Jhon"}</span>
                                    </p>
                                    <p className="text-xs flex justify-between">
                                        <span>Phone:</span>
                                        <span>{msg.phone || "0000000000"}</span>
                                    </p>
                                </div>
                                {msg.from === "Me" && <Image src={msg.avatar} alt="Me" width={30} height={30} className="rounded-full ml-2 h-[30px] w-[30px]" />}
                            </div>
                        );
                    } else if (msg.type === "rejected") {
                        return (
                            <div key={i} className={`flex ${msg.from === "Me" ? "justify-end" : "justify-start"}`}>
                                {msg.from !== "Me" && <Image src={msg.avatar} alt={msg.from} width={30} height={30} className="rounded-full mr-2 h-[30px] w-[30px]" />}
                                <div className="bg-red-200 p-3 rounded-lg w-64 text-center font-semibold text-red-900">Offer Rejected</div>
                                {msg.from === "Me" && <Image src={msg.avatar} alt="Me" width={30} height={30} className="rounded-full ml-2 h-[30px] w-[30px]" />}
                            </div>
                        );
                    } else {
                        return (
                            <div key={i} className={`flex items-end ${msg.from === "Me" ? "justify-end" : "justify-start"}`}>
                                {msg.from !== "Me" && <Image src={msg.avatar} alt={msg.from} width={30} height={30} className="rounded-full mr-2 h-[30px] w-[30px]" />}
                                <p className={`px-3 py-2 rounded-lg max-w-xs break-words ${msg.from === "Me" ? "bg-[#14213D] text-white" : "bg-[#D4BA71] text-[#080E1A]"}`}>{msg.text}</p>
                                {msg.from === "Me" && <Image src={msg.avatar} alt="Me" width={30} height={30} className="rounded-full ml-2 h-[30px] w-[30px]" />}
                            </div>
                        );
                    }
                })}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Box */}
            <div className="relative w-full border-t border-[#C9A94D] p-2">
                <input type="text" placeholder="Type a message..." value={inputText} onChange={(e) => setInputText(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSend()} className="w-full border border-[#C9A94D] px-4 py-3 pr-12 focus:outline-none text-[#14213D] rounded" />
                <button onClick={handleSend} className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-[#C9A94D] py-2 px-3 rounded">
                    <Image src="/messages/sendbutton.png" alt="Send button" height={20} width={20} />
                </button>
            </div>
        </div>
    );
}

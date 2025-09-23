"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { initialConversations, people } from "./messages";
import { useRouter } from "next/navigation";

export default function MessagesLayout2() {
    const [selected, setSelected] = useState<number>(people[0].id);
    const [conversations, setConversations] = useState(initialConversations);
    const [inputText, setInputText] = useState("");
    const [search, setSearch] = useState("");
    const messages = useMemo(() => conversations[selected] || [], [conversations, selected]);

    const router = useRouter();

    const handlePersonClick = (personId: number) => {
        if (window.innerWidth < 768) {
            router.push(`/messages/${personId}`);
        } else {
            setSelected(personId);
        }
    };

    // const scrollRef = useRef<HTMLDivElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = () => {
        if (!inputText.trim()) return;
        setConversations((prev) => ({
            ...prev,
            [selected]: [...(prev[selected] || []), { from: "Me", text: inputText, avatar: "/avatars/me.png" }],
        }));
        setInputText("");
    };

    const filteredPeople = people.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));

    return (
        <div className="h-[90vh] flex bg-[#B6BAC3] border border-[#C9A94D]">
            {/* Left Sidebar */}
            <div className="w-full md:w-1/3 bg-[#B6BAC3] border-r border-[#C9A94D] flex flex-col">
                <div className="py-8 px-5 border-b border-[#C9A94D]">
                    <h1 className="font-bold test-[28px] text-[#14213D] text-xl mb-5">Messages </h1>

                    <div className="flex items-center border border-[#C9A94D] rounded-lg px-2 py-2">
                        <Image src="/messages/chat-search.png" alt="Search" width={20} height={20} className="mr-2" />
                        <input type="text" placeholder="Search conversations" value={search} onChange={(e) => setSearch(e.target.value)} className="flex-1 focus:outline-none text-black placeholder-black bg-transparent" />
                    </div>
                </div>
                <div
                    className="flex-1 flex flex-col overflow-y-auto py-12 px-6 gap-7"
                    style={{
                        scrollbarWidth: "thin",
                        scrollbarColor: "#C9A94D transparent",
                    }}
                >
                    <style jsx>{`
                        /* Chrome, Edge, Safari */
                        div::-webkit-scrollbar {
                            width: 8px;
                        }
                        div::-webkit-scrollbar-track {
                            background: transparent; /* track transparent */
                        }
                        div::-webkit-scrollbar-thumb {
                            background-color: #c9a94d; /* gold thumb */
                            border-radius: 4px;
                        }
                    `}</style>
                    {filteredPeople.map((person) => {
                        const lastMsgObj = conversations[person.id]?.[conversations[person.id].length - 1];

                        let lastMsg = "";
                        if (lastMsgObj) {
                            switch (lastMsgObj.type) {
                                case "offer":
                                    lastMsg = `Nest Offer: ${lastMsgObj.propertyId}`;
                                    break;
                                case "accepted":
                                    lastMsg = `Accepted: ${lastMsgObj.propertyId}`;
                                    break;
                                case "rejected":
                                    lastMsg = `Rejected: ${lastMsgObj.propertyId}`;
                                    break;
                                default:
                                    lastMsg = lastMsgObj.text || "";
                            }
                        }

                        return (
                            <div key={person.id} className={`flex flex-col p-2 cursor-pointer hover:bg-[#9399A6] rounded-[6px] ${selected === person.id ? "bg-[#9399A6]" : ""}`} onClick={() => handlePersonClick(person.id)}>
                                <div className="flex items-center gap-3">
                                    <Image src={person.avatar} alt={person.name} width={40} height={40} className="rounded-full border h-10 w-10 border-white" />
                                    <div className="flex flex-col">
                                        <p className="text-[#14213D] font-medium">{person.name}</p>
                                        <p className="text-white text-sm truncate max-w-[150px]">{lastMsg}</p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Conversation */}
            <div className="flex-1 md:flex flex-col bg-[#B6BAC3] border-l border-[#C9A94D] hidden">
                <div
                    className="flex-1 overflow-y-auto p-2 space-y-3"
                    style={{
                        scrollbarWidth: "thin",
                        scrollbarColor: "#C9A94D transparent",
                    }}
                >
                    <style jsx>{`
                        div::-webkit-scrollbar {
                            width: 8px;
                        }
                        div::-webkit-scrollbar-track {
                            background: transparent;
                        }
                        div::-webkit-scrollbar-thumb {
                            background-color: #c9a94d;
                            border-radius: 4px;
                        }
                    `}</style>

                    {/* {messages?.map((msg, i) => {
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
                                        <div className="mt-2">
                                            <div className="grid grid-cols-2 gap-2">
                                                <button className="bg-[#434D64] text-white px-3 py-1 rounded text-xs font-bold">Pay</button>
                                                <button className="bg-[#434D64] text-white px-3 py-1 rounded text-xs font-bold">Cancel</button>
                                            </div>
                                        </div>
                                    </div>
                                    {msg.from === "Me" && <Image src={msg.avatar} alt="Me" width={30} height={30} className="rounded-full h-[30px] w-[30px] ml-2" />}
                                </div>
                            );
                        }

                     
                        return (
                            <div key={i} className={`flex items-end ${msg.from === "Me" ? "justify-end" : "justify-start"}`}>
                                {msg.from !== "Me" && <Image src={msg.avatar} alt={msg.from} width={30} height={30} className="rounded-full mr-2" />}
                                <p className={`px-3 py-2 rounded-lg max-w-xs break-words ${msg.from === "Me" ? "bg-[#14213D] text-white" : "bg-[#D4BA71] text-[#080E1A]"}`}>{msg.text}</p>
                                {msg.from === "Me" && <Image src={msg.avatar} alt="Me" width={30} height={30} className="rounded-full ml-2" />}
                            </div>
                        );
                    })} */}
                    {messages?.map((msg, i) => {
                        if (msg.type === "offer") {
                            // Offer message (your current design)
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
                                        <div className="mt-2 grid grid-cols-2 gap-2">
                                            <button className="bg-[#434D64] text-white px-3 py-1 rounded text-xs font-bold">Pay</button>
                                            <button className="bg-[#434D64] text-white px-3 py-1 rounded text-xs font-bold">Cancel</button>
                                        </div>
                                    </div>
                                    {msg.from === "Me" && <Image src={msg.avatar} alt="Me" width={30} height={30} className="rounded-full h-[30px] w-[30px] ml-2" />}
                                </div>
                            );
                        } else if (msg.type === "accepted") {
                            // Accepted message with property details
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
                            // Rejected message (simple)
                            return (
                                <div key={i} className={`flex ${msg.from === "Me" ? "justify-end" : "justify-start"}`}>
                                    {msg.from !== "Me" && <Image src={msg.avatar} alt={msg.from} width={30} height={30} className="rounded-full mr-2 h-[30px] w-[30px]" />}
                                    <div className="bg-red-200 p-3 rounded-lg w-64 text-center font-semibold text-red-900">Offer Rejected</div>
                                    {msg.from === "Me" && <Image src={msg.avatar} alt="Me" width={30} height={30} className="rounded-full ml-2 h-[30px] w-[30px]" />}
                                </div>
                            );
                        } else {
                            // Normal text message
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
                <div className="relative w-full">
                    <input type="text" placeholder="Type a message..." value={inputText} onChange={(e) => setInputText(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSend()} className="w-full border border-[#C9A94D] px-8 py-4 pr-12 focus:outline-none text-[#14213D]" />
                    <button onClick={handleSend} className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-[#C9A94D] py-3 px-8 rounded">
                        <Image src="/messages/sendbutton.png" alt="Send button" height={20} width={20} />
                    </button>
                </div>
            </div>
        </div>
    );
}

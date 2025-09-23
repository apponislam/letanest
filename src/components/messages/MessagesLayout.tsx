"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";

export default function MessagesLayout() {
    const people = [
        { id: 1, name: "John", avatar: "/home/avatar.jpg" },
        { id: 2, name: "Jane", avatar: "/home/avatar.jpg" },
        { id: 3, name: "Mike", avatar: "/home/avatar.jpg" },
        { id: 4, name: "Alice", avatar: "/home/avatar.jpg" },
        { id: 5, name: "Bob", avatar: "/home/avatar.jpg" },
        { id: 6, name: "Charlie", avatar: "/home/avatar.jpg" },
        { id: 7, name: "David", avatar: "/home/avatar.jpg" },
        { id: 8, name: "Eve", avatar: "/home/avatar.jpg" },
        { id: 9, name: "Frank", avatar: "/home/avatar.jpg" },
        { id: 10, name: "Grace", avatar: "/home/avatar.jpg" },
        { id: 11, name: "Hannah", avatar: "/home/avatar.jpg" },
        { id: 12, name: "Ian", avatar: "/home/avatar.jpg" },
        { id: 13, name: "Jack", avatar: "/home/avatar.jpg" },
        { id: 14, name: "Kate", avatar: "/home/avatar.jpg" },
        { id: 15, name: "Leo", avatar: "/home/avatar.jpg" },
        { id: 16, name: "Mia", avatar: "/home/avatar.jpg" },
        { id: 17, name: "Nick", avatar: "/home/avatar.jpg" },
    ];

    const initialConversations: Record<number, { from: string; text: string; avatar: string }[]> = {
        1: [
            { from: "Me", text: "Hi John!", avatar: "/home/avatar.jpg" },
            { from: "John", text: "Hello!", avatar: "/home/avatar.jpg" },
            { from: "Me", text: "How are you?", avatar: "/home/avatar.jpg" },
            { from: "John", text: "I'm good, thanks!", avatar: "/home/avatar.jpg" },
            { from: "Me", text: "What's up?", avatar: "/home/avatar.jpg" },
            { from: "John", text: "Just working.", avatar: "/home/avatar.jpg" },
            { from: "Me", text: "Want to catch up later?", avatar: "/home/avatar.jpg" },
            { from: "John", text: "Sure!", avatar: "/home/avatar.jpg" },
            { from: "Me", text: "Great!", avatar: "/home/avatar.jpg" },
            { from: "John", text: "See you then.", avatar: "/home/avatar.jpg" },
            { from: "Me", text: "Okay.", avatar: "/home/avatar.jpg" },
            { from: "John", text: "Bye for now.", avatar: "/home/avatar.jpg" },
            { from: "Me", text: "Bye!", avatar: "/home/avatar.jpg" },
            { from: "John", text: "Take care.", avatar: "/home/avatar.jpg" },
            { from: "Me", text: "You too.", avatar: "/home/avatar.jpg" },
            { from: "John", text: "Thanks.", avatar: "/home/avatar.jpg" },
            { from: "Me", text: "No problem.", avatar: "/home/avatar.jpg" },
            { from: "John", text: "Catch you later.", avatar: "/home/avatar.jpg" },
            { from: "Me", text: "Bye!", avatar: "/home/avatar.jpg" },
            { from: "John", text: "Bye!", avatar: "/home/avatar.jpg" },
            { from: "Me", text: "See you.", avatar: "/home/avatar.jpg" },
            { from: "John", text: "See you.", avatar: "/home/avatar.jpg" },
            { from: "Me", text: "Alright.", avatar: "/home/avatar.jpg" },
            { from: "John", text: "Ok.", avatar: "/home/avatar.jpg" },
            { from: "Me", text: "Talk soon.", avatar: "/home/avatar.jpg" },
            { from: "John", text: "Yes.", avatar: "/home/avatar.jpg" },
            { from: "Me", text: "Goodbye.", avatar: "/home/avatar.jpg" },
            { from: "John", text: "Goodbye.", avatar: "/home/avatar.jpg" },
            { from: "Me", text: "Take care.", avatar: "/home/avatar.jpg" },
            { from: "John", text: "Will do.", avatar: "/home/avatar.jpg" },
            { from: "Me", text: "Great.", avatar: "/home/avatar.jpg" },
            { from: "John", text: "Indeed.", avatar: "/home/avatar.jpg" },
            { from: "Me", text: "Catch you later.", avatar: "/home/avatar.jpg" },
            { from: "John", text: "Sure.", avatar: "/home/avatar.jpg" },
            { from: "Me", text: "Talk soon.", avatar: "/home/avatar.jpg" },
            { from: "John", text: "Absolutely.", avatar: "/home/avatar.jpg" },
            { from: "Me", text: "Bye!", avatar: "/home/avatar.jpg" },
            { from: "John", text: "Bye!", avatar: "/home/avatar.jpg" },
            { from: "Me", text: "Alright then.", avatar: "/home/avatar.jpg" },
            { from: "John", text: "Alright.", avatar: "/home/avatar.jpg" },
            { from: "Me", text: "Good day.", avatar: "/home/avatar.jpg" },
            { from: "John", text: "Good day to you too.", avatar: "/home/avatar.jpg" },
            { from: "Me", text: "See you later.", avatar: "/home/avatar.jpg" },
            { from: "John", text: "See you.", avatar: "/home/avatar.jpg" },
            { from: "Me", text: "Take it easy.", avatar: "/home/avatar.jpg" },
            { from: "John", text: "Will do.", avatar: "/home/avatar.jpg" },
            { from: "Me", text: "Bye for now.", avatar: "/home/avatar.jpg" },
            { from: "John", text: "Bye.", avatar: "/home/avatar.jpg" },
            { from: "Me", text: "Catch you soon.", avatar: "/home/avatar.jpg" },
            { from: "John", text: "Yes, soon.", avatar: "/home/avatar.jpg" },
            { from: "Me", text: "Good luck!", avatar: "/home/avatar.jpg" },
            { from: "John", text: "Thanks!", avatar: "/home/avatar.jpg" },
            { from: "Me", text: "Alright, bye!", avatar: "/home/avatar.jpg" },
            { from: "John", text: "Bye!", avatar: "/home/avatar.jpg" },
            { from: "Me", text: "See ya!", avatar: "/home/avatar.jpg" },
            { from: "John", text: "See ya!", avatar: "/home/avatar.jpg" },
        ],
        2: [
            { from: "Me", text: "Hey Jane!", avatar: "/home/avatar.jpg" },
            { from: "Jane", text: "Hi there!", avatar: "/home/avatar.jpg" },
        ],
        3: [
            { from: "Me", text: "Yo Mike!", avatar: "/home/avatar.jpg" },
            { from: "Mike", text: "Yo!", avatar: "/home/avatar.jpg" },
        ],
        4: [
            { from: "Me", text: "Hi Alice!", avatar: "/home/avatar.jpg" },
            { from: "Alice", text: "Hello!", avatar: "/home/avatar.jpg" },
        ],
        5: [
            { from: "Me", text: "Hey Bob!", avatar: "/home/avatar.jpg" },
            { from: "Bob", text: "Hi!", avatar: "/home/avatar.jpg" },
        ],
        6: [
            { from: "Me", text: "Hi Charlie!", avatar: "/home/avatar.jpg" },
            { from: "Charlie", text: "Hello!", avatar: "/home/avatar.jpg" },
        ],
        7: [
            { from: "Me", text: "Hey David!", avatar: "/home/avatar.jpg" },
            { from: "David", text: "Hi!", avatar: "/home/avatar.jpg" },
        ],
        8: [
            { from: "Me", text: "Hi Eve!", avatar: "/home/avatar.jpg" },
            { from: "Eve", text: "Hello!", avatar: "/home/avatar.jpg" },
        ],
        9: [
            { from: "Me", text: "Hey Frank!", avatar: "/home/avatar.jpg" },
            { from: "Frank", text: "Hi!", avatar: "/home/avatar.jpg" },
        ],
        10: [
            { from: "Me", text: "Hi Grace!", avatar: "/home/avatar.jpg" },
            { from: "Grace", text: "Hello!", avatar: "/home/avatar.jpg" },
        ],
        11: [
            { from: "Me", text: "Hey Hannah!", avatar: "/home/avatar.jpg" },
            { from: "Hannah", text: "Hi!", avatar: "/home/avatar.jpg" },
        ],
        12: [
            { from: "Me", text: "Hi Ian!", avatar: "/home/avatar.jpg" },
            { from: "Ian", text: "Hello!", avatar: "/home/avatar.jpg" },
        ],
        13: [
            { from: "Me", text: "Hey Jack!", avatar: "/home/avatar.jpg" },
            { from: "Jack", text: "Hi!", avatar: "/home/avatar.jpg" },
        ],
        14: [
            { from: "Me", text: "Hi Kate!", avatar: "/home/avatar.jpg" },
            { from: "Kate", text: "Hello!", avatar: "/home/avatar.jpg" },
        ],
        15: [
            { from: "Me", text: "Hey Leo!", avatar: "/home/avatar.jpg" },
            { from: "Leo", text: "Hi!", avatar: "/home/avatar.jpg" },
        ],
        16: [
            { from: "Me", text: "Hi Mia!", avatar: "/home/avatar.jpg" },
            { from: "Mia", text: "Hello!", avatar: "/home/avatar.jpg" },
        ],
        17: [
            { from: "Me", text: "Hey Nick!", avatar: "/home/avatar.jpg" },
            { from: "Nick", text: "Hi!", avatar: "/home/avatar.jpg" },
        ],
    };

    const [selected, setSelected] = useState<number>(people[0].id);
    const [conversations, setConversations] = useState(initialConversations);
    const [inputText, setInputText] = useState("");
    const [search, setSearch] = useState("");
    const messages = useMemo(() => conversations[selected] || [], [conversations, selected]);

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
            <div className="w-1/3 bg-[#B6BAC3] border-r border-[#C9A94D] flex flex-col">
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
                        const lastMsg = conversations[person.id]?.[conversations[person.id].length - 1]?.text || "";
                        return (
                            <div key={person.id} className={`flex flex-col p-2  cursor-pointer hover:bg-[#9399A6] rounded-[6px] ${selected === person.id ? "bg-[#9399A6]" : ""}`} onClick={() => setSelected(person.id)}>
                                <div className="flex items-center gap-3">
                                    <Image src={person.avatar} alt={person.name} width={40} height={40} className="rounded-full border border-white" />
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
            <div className="flex-1 flex flex-col bg-[#B6BAC3] border-l border-[#C9A94D]">
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
                    {messages?.map((msg, i) => (
                        <div key={i} className={`flex items-end ${msg.from === "Me" ? "justify-end" : "justify-start"}`}>
                            {msg.from !== "Me" && <Image src={msg.avatar} alt={msg.from} width={30} height={30} className="rounded-full mr-2" />}
                            <p className={`px-3 py-2 rounded-lg max-w-xs break-words ${msg.from === "Me" ? "bg-[#14213D] text-white" : "bg-[#D4BA71] text-[#080E1A]"}`}>{msg.text}</p>
                            {msg.from === "Me" && <Image src={msg.avatar} alt="Me" width={30} height={30} className="rounded-full ml-2" />}
                        </div>
                    ))}

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

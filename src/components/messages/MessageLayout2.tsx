// "use client";

// import React, { useEffect, useMemo, useRef, useState } from "react";
// import Image from "next/image";
// import { initialConversations, people } from "./messages";
// import { useRouter } from "next/navigation";
// import Link from "next/link";
// import { Star } from "lucide-react";

// export default function MessagesLayout2() {
//     const [selected, setSelected] = useState<number>(people[0].id);
//     const [conversations, setConversations] = useState(initialConversations);
//     const [inputText, setInputText] = useState("");
//     const [search, setSearch] = useState("");
//     const messages = useMemo(() => conversations[selected] || [], [conversations, selected]);
//     console.log(messages);

//     const router = useRouter();

//     const handlePersonClick = (personId: number) => {
//         if (window.innerWidth < 768) {
//             router.push(`/messages/${personId}`);
//         } else {
//             setSelected(personId);
//         }
//     };

//     // const scrollRef = useRef<HTMLDivElement>(null);
//     const messagesEndRef = useRef<HTMLDivElement>(null);

//     useEffect(() => {
//         messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//     }, [messages]);

//     const handleSend = () => {
//         if (!inputText.trim()) return;
//         setConversations((prev) => ({
//             ...prev,
//             [selected]: [...(prev[selected] || []), { from: "Me", text: inputText, avatar: "/avatars/me.png" }],
//         }));
//         setInputText("");
//     };

//     const filteredPeople = people.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));

//     return (
//         <div className="h-[90vh] flex bg-[#B6BAC3] border border-[#C9A94D]">
//             {/* Left Sidebar */}
//             <div className="w-full md:w-1/3 bg-[#B6BAC3] border-r border-[#C9A94D] flex flex-col">
//                 <div className="py-8 px-5 border-b border-[#C9A94D]">
//                     <h1 className="font-bold test-[28px] text-[#14213D] text-xl mb-5">Messages </h1>

//                     <div className="flex items-center border border-[#C9A94D] rounded-lg px-2 py-2">
//                         <Image src="/messages/chat-search.png" alt="Search" width={20} height={20} className="mr-2" />
//                         <input type="text" placeholder="Search conversations" value={search} onChange={(e) => setSearch(e.target.value)} className="flex-1 focus:outline-none text-black placeholder-black bg-transparent" />
//                     </div>
//                 </div>
//                 <div
//                     className="flex-1 flex flex-col overflow-y-auto py-12 px-6 gap-7"
//                     style={{
//                         scrollbarWidth: "thin",
//                         scrollbarColor: "#C9A94D transparent",
//                     }}
//                 >
//                     <style jsx>{`
//                         /* Chrome, Edge, Safari */
//                         div::-webkit-scrollbar {
//                             width: 8px;
//                         }
//                         div::-webkit-scrollbar-track {
//                             background: transparent; /* track transparent */
//                         }
//                         div::-webkit-scrollbar-thumb {
//                             background-color: #c9a94d; /* gold thumb */
//                             border-radius: 4px;
//                         }
//                     `}</style>
//                     {filteredPeople.map((person) => {
//                         const lastMsgObj = conversations[person.id]?.[conversations[person.id].length - 1];

//                         let lastMsg = "";
//                         if (lastMsgObj) {
//                             switch (lastMsgObj.type) {
//                                 case "offer":
//                                     lastMsg = `Nest Offer: ${lastMsgObj.propertyId}`;
//                                     break;
//                                 case "accepted":
//                                     lastMsg = `Accepted: ${lastMsgObj.propertyId}`;
//                                     break;
//                                 case "rejected":
//                                     lastMsg = `Rejected: ${lastMsgObj.propertyId}`;
//                                     break;
//                                 default:
//                                     lastMsg = lastMsgObj.text || "";
//                             }
//                         }

//                         return (
//                             <div key={person.id} className={`flex flex-col p-2 cursor-pointer hover:bg-[#9399A6] rounded-[6px] ${selected === person.id ? "bg-[#9399A6]" : ""}`} onClick={() => handlePersonClick(person.id)}>
//                                 <div className="flex items-center gap-3">
//                                     <div className="relative">
//                                         <div className="relative">
//                                             <Image src={person.avatar} alt={person.name} width={40} height={40} className="rounded-full border h-10 w-10 border-white" />
//                                             {/* Online indicator on image corner */}
//                                             <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${false ? "bg-green-500" : "bg-gray-400"}`}></div>
//                                         </div>
//                                     </div>
//                                     <div className="flex flex-col">
//                                         <p className="text-[#14213D] font-medium">{person.name}</p>
//                                         <p className="text-white text-sm truncate max-w-[150px]">{lastMsg}</p>
//                                     </div>
//                                 </div>
//                             </div>
//                         );
//                     })}
//                 </div>
//             </div>

//             {/* Conversation */}
//             <div className="flex-1 md:flex flex-col bg-[#B6BAC3] border-l border-[#C9A94D] hidden">
//                 <div
//                     className="flex-1 flex flex-col overflow-y-auto"
//                     style={{
//                         scrollbarWidth: "thin",
//                         scrollbarColor: "#C9A94D transparent",
//                     }}
//                 >
//                     <style jsx>{`
//                         div::-webkit-scrollbar {
//                             width: 8px;
//                         }
//                         div::-webkit-scrollbar-track {
//                             background: transparent;
//                         }
//                         div::-webkit-scrollbar-thumb {
//                             background-color: #c9a94d;
//                             border-radius: 4px;
//                         }
//                     `}</style>
//                     <div className="sticky top-0 w-full bg-[#9399A6] py-[10px] px-5">
//                         <div className="flex items-center gap-3">
//                             <Image src="/home/avatar.jpg" alt="Host Image" width={30} height={30} className="rounded-full border border-white mr-2 h-[66px] w-[66px]" />
//                             <div className="text-[#14213D]">
//                                 <h1 className="text-[18px] font-bold">Jhon</h1>
//                                 <div className="flex items-center gap-6 text-sm">
//                                     <p className="">Host</p>
//                                     <div className="flex items-center gap-2">
//                                         <Star className="h-3 w-3"></Star>
//                                         <p>4.5</p>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                     <div className="p-2 space-y-3">
//                         {messages?.map((msg, i) => {
//                             if (msg.type === "offer") {
//                                 // Offer message (your current design)
//                                 return (
//                                     <div key={i} className={`flex ${msg.from === "Me" ? "justify-end" : "justify-start"}`}>
//                                         {msg.from !== "Me" && <Image src={msg.avatar} alt={msg.from} width={30} height={30} className="rounded-full mr-2 h-[30px] w-[30px]" />}
//                                         <div className="bg-[#D4BA71] p-3 rounded-lg w-64">
//                                             <p className="font-semibold text-sm mb-1 text-center">Nest Offer</p>
//                                             <p className="text-xs flex justify-between">
//                                                 <span>Property ID:</span>
//                                                 <span>{msg.propertyId}</span>
//                                             </p>
//                                             <p className="text-xs flex justify-between">
//                                                 <span>Agreed dates:</span>
//                                                 <span>{msg.dates}</span>
//                                             </p>
//                                             <p className="text-xs flex justify-between">
//                                                 <span>Agreed Fee:</span>
//                                                 <span>{msg.agreedFee}</span>
//                                             </p>
//                                             <p className="text-xs flex justify-between">
//                                                 <span>Booking Fee:</span>
//                                                 <span>{msg.bookingFee}</span>
//                                             </p>
//                                             <p className="text-xs font-semibold flex justify-between">
//                                                 <span>Total:</span>
//                                                 <span>{msg.total}</span>
//                                             </p>
//                                             <div className="flex flex-col gap-2">
//                                                 <div className="mt-2 grid grid-cols-2 gap-2">
//                                                     <Link href="/listings/1/pay" className="w-full">
//                                                         <button className="bg-[#434D64] text-white px-3 py-1 rounded text-xs font-bold w-full">Pay</button>
//                                                     </Link>
//                                                     <button className="bg-[#434D64] text-white px-3 py-1 rounded text-xs font-bold">Cancel</button>
//                                                 </div>
//                                                 <div>
//                                                     <Link href="/listings/1">
//                                                         <button className="bg-[#434D64] text-white px-3 py-1 rounded text-xs font-bold w-full">View Property Details</button>
//                                                     </Link>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                         {msg.from === "Me" && <Image src={msg.avatar} alt="Me" width={30} height={30} className="rounded-full h-[30px] w-[30px] ml-2" />}
//                                     </div>
//                                 );
//                             } else if (msg.type === "accepted") {
//                                 // Accepted message with property details
//                                 return (
//                                     <div key={i} className={`flex ${msg.from === "Me" ? "justify-end" : "justify-start"}`}>
//                                         {msg.from !== "Me" && <Image src={msg.avatar} alt={msg.from} width={30} height={30} className="rounded-full mr-2 h-[30px] w-[30px]" />}

//                                         <div className="bg-[#D4BA71] p-3 rounded-lg w-64">
//                                             <p className="font-semibold text-sm mb-1 text-center">Offer Accepted</p>

//                                             <div className="flex flex-col gap-2">
//                                                 <div className="text-xs flex justify-between">
//                                                     <div className="flex items-center gap-2">
//                                                         <Image alt="Property Name" src="/messages/accepted/home-roof.png" height={16} width={16} />
//                                                         <span>Property name:</span>
//                                                     </div>
//                                                     <span>{msg.propertyName || "Radison"}</span>
//                                                 </div>

//                                                 <div className="text-xs flex justify-between">
//                                                     <div className="flex items-center gap-2">
//                                                         <Image alt="Address" src="/messages/accepted/location-pin.png" height={16} width={16} />
//                                                         <span>Address:</span>
//                                                     </div>
//                                                     <span>{msg.address || "New City"}</span>
//                                                 </div>

//                                                 <div className="text-xs flex justify-between">
//                                                     <div className="flex items-center gap-2">
//                                                         <Image alt="Property Manager" src="/messages/accepted/user-alt.png" height={16} width={16} />
//                                                         <span>Property Manager:</span>
//                                                     </div>
//                                                     <span>{msg.manager || "Jhon"}</span>
//                                                 </div>

//                                                 <div className="text-xs flex justify-between">
//                                                     <div className="flex items-center gap-2">
//                                                         <Image alt="Phone" src="/messages/accepted/phone.png" height={16} width={16} />
//                                                         <span>Phone:</span>
//                                                     </div>
//                                                     <span>{msg.phone || "0000000000"}</span>
//                                                 </div>
//                                             </div>
//                                         </div>

//                                         {msg.from === "Me" && <Image src={msg.avatar} alt="Me" width={30} height={30} className="rounded-full ml-2 h-[30px] w-[30px]" />}
//                                     </div>
//                                 );
//                             } else if (msg.type === "rejected") {
//                                 // Rejected message (simple)
//                                 return (
//                                     <div key={i} className={`flex ${msg.from === "Me" ? "justify-end" : "justify-start"}`}>
//                                         {msg.from !== "Me" && <Image src={msg.avatar} alt={msg.from} width={30} height={30} className="rounded-full mr-2 h-[30px] w-[30px]" />}
//                                         <div className="bg-red-200 p-3 rounded-lg w-64 text-center font-semibold text-red-900">Offer Rejected</div>
//                                         {msg.from === "Me" && <Image src={msg.avatar} alt="Me" width={30} height={30} className="rounded-full ml-2 h-[30px] w-[30px]" />}
//                                     </div>
//                                 );
//                             } else {
//                                 // Normal text message
//                                 return (
//                                     <div key={i} className={`flex items-end ${msg.from === "Me" ? "justify-end" : "justify-start"}`}>
//                                         {msg.from !== "Me" && <Image src={msg.avatar} alt={msg.from} width={30} height={30} className="rounded-full mr-2 h-[30px] w-[30px]" />}
//                                         <p className={`px-3 py-2 rounded-lg max-w-xs break-words ${msg.from === "Me" ? "bg-[#14213D] text-white" : "bg-[#D4BA71] text-[#080E1A]"}`}>{msg.text}</p>
//                                         {msg.from === "Me" && <Image src={msg.avatar} alt="Me" width={30} height={30} className="rounded-full ml-2 h-[30px] w-[30px]" />}
//                                     </div>
//                                 );
//                             }
//                         })}

//                         <div ref={messagesEndRef} />
//                     </div>
//                 </div>

//                 {/* Input Box */}
//                 <div className="relative w-full">
//                     <input type="text" placeholder="Type a message..." value={inputText} onChange={(e) => setInputText(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSend()} className="w-full border border-[#C9A94D] px-8 py-4 pr-12 focus:outline-none text-[#14213D]" />
//                     <button onClick={handleSend} className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-[#C9A94D] py-3 px-8 rounded">
//                         <Image src="/messages/sendbutton.png" alt="Send button" height={20} width={20} />
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// }

"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Star, MessagesSquare } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useSocket } from "@/redux/features/socket/socketHooks";
import { useGetUserConversationsQuery, useSendMessageMutation, useGetConversationMessagesQuery } from "@/redux/features/messages/messageApi";

export default function MessagesLayout2() {
    const { user } = useSelector((state: RootState) => state.auth);
    const { isConnected, joinConversation, leaveConversation, sendTyping, getTypingUsers, isUserOnline } = useSocket();

    // Fix: Access the data property from RTK Query response
    const { data: conversationsResponse, isLoading: loadingConversations } = useGetUserConversationsQuery({});
    const conversations = conversationsResponse?.data || []; // Extract the data array

    const [sendMessage] = useSendMessageMutation();

    const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
    const [inputText, setInputText] = useState("");
    const [search, setSearch] = useState("");

    // Fix: Access the data property from messages response
    const { data: messagesResponse, isLoading: loadingMessages } = useGetConversationMessagesQuery({ conversationId: selectedConversation!, page: 1, limit: 50 }, { skip: !selectedConversation });
    const messagesData = messagesResponse?.data || []; // Extract the data array

    const router = useRouter();
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const typingUsers = selectedConversation ? getTypingUsers(selectedConversation) : [];

    // Auto-select first conversation
    useEffect(() => {
        if (conversations.length > 0 && !selectedConversation) {
            setSelectedConversation(conversations[0]._id);
        }
    }, [conversations, selectedConversation]);

    // Join conversation room when selected
    useEffect(() => {
        if (selectedConversation) {
            joinConversation(selectedConversation);
        }

        return () => {
            if (selectedConversation) {
                leaveConversation(selectedConversation);
            }
        };
    }, [selectedConversation, joinConversation, leaveConversation]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messagesData]);

    const handleSend = async () => {
        if (!inputText.trim() || !selectedConversation || !user) return;

        try {
            await sendMessage({
                conversationId: selectedConversation,
                sender: user._id,
                type: "text",
                text: inputText,
            }).unwrap();

            setInputText("");
            sendTyping(selectedConversation, user._id, false);
        } catch (error) {
            console.error("Failed to send message:", error);
        }
    };

    const handleTyping = (isTyping: boolean) => {
        if (selectedConversation && user) {
            sendTyping(selectedConversation, user._id, isTyping);
        }
    };

    // Fix: Now conversations is an array
    const filteredConversations = conversations.filter((conv: any) => {
        const otherParticipant = conv.participants.find((p: any) => p._id !== user?._id);
        return otherParticipant?.name.toLowerCase().includes(search.toLowerCase());
    });

    const currentConversation = conversations.find((conv: any) => conv._id === selectedConversation);
    const otherParticipant = currentConversation?.participants.find((p: any) => p._id !== user?._id);

    if (loadingConversations) {
        return <div className="h-[90vh] flex items-center justify-center">Loading conversations...</div>;
    }

    return (
        <div className="h-[90vh] flex bg-[#B6BAC3] border border-[#C9A94D]">
            {/* Left Sidebar */}
            <div className="w-full md:w-1/3 bg-[#B6BAC3] border-r border-[#C9A94D] flex flex-col">
                <div className="py-8 px-5 border-b border-[#C9A94D]">
                    <h1 className="font-bold test-[28px] text-[#14213D] text-xl mb-5">Messages</h1>

                    <div className="flex items-center border border-[#C9A94D] rounded-lg px-2 py-2">
                        <Image src="/messages/chat-search.png" alt="Search" width={20} height={20} className="mr-2" />
                        <input type="text" placeholder="Search conversations" value={search} onChange={(e) => setSearch(e.target.value)} className="flex-1 focus:outline-none text-black placeholder-black bg-transparent" />
                    </div>
                </div>

                <div className="flex-1 flex flex-col overflow-y-auto py-12 px-6 gap-7 custom-scrollbar">
                    {filteredConversations.map((conversation: any) => {
                        const otherParticipant = conversation.participants.find((p: any) => p._id !== user?._id);
                        const lastMessage = conversation.lastMessage as any;

                        let lastMsg = "";
                        if (lastMessage) {
                            switch (lastMessage.type) {
                                case "offer":
                                    lastMsg = `Nest Offer: ${lastMessage.propertyId}`;
                                    break;
                                case "accepted":
                                    lastMsg = `Accepted: ${lastMessage.propertyId}`;
                                    break;
                                case "rejected":
                                    lastMsg = `Rejected: ${lastMessage.propertyId}`;
                                    break;
                                default:
                                    lastMsg = lastMessage.text || "";
                            }
                        }

                        return (
                            <div key={conversation._id} className={`flex flex-col p-2 cursor-pointer hover:bg-[#9399A6] rounded-[6px] ${selectedConversation === conversation._id ? "bg-[#9399A6]" : ""}`} onClick={() => setSelectedConversation(conversation._id)}>
                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                        <Image src={otherParticipant?.profileImg || "/home/avatar.jpg"} alt={otherParticipant?.name} width={40} height={40} className="rounded-full border h-10 w-10 border-white" />
                                        <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${isUserOnline(otherParticipant?._id) ? "bg-green-500" : "bg-gray-400"}`}></div>
                                    </div>
                                    <div className="flex flex-col">
                                        <p className="text-[#14213D] font-medium">{otherParticipant?.name}</p>
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
                {!selectedConversation ? (
                    <div className="flex-1 flex items-center justify-center">
                        <div className="text-center">
                            <MessagesSquare className="h-16 w-16 text-[#C9A94D] mx-auto mb-4" />
                            <p className="text-[#14213D] text-lg">Select a conversation to start chatting</p>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="flex-1 flex flex-col overflow-y-auto custom-scrollbar">
                            {/* Connection Status */}
                            <div className={`px-4 py-2 text-sm ${isConnected ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>{isConnected ? "🟢 Connected" : "🔴 Disconnected"}</div>

                            {/* Chat Header */}
                            <div className="sticky top-0 w-full bg-[#9399A6] py-[10px] px-5">
                                <div className="flex items-center gap-3">
                                    <Image src={otherParticipant?.profileImg || "/home/avatar.jpg"} alt="Host Image" width={66} height={66} className="rounded-full border border-white" />
                                    <div className="text-[#14213D]">
                                        <h1 className="text-[18px] font-bold">{otherParticipant?.name}</h1>
                                        <div className="flex items-center gap-6 text-sm">
                                            <p>Host</p>
                                            <div className="flex items-center gap-2">
                                                <Star className="h-3 w-3" />
                                                <p>4.5</p>
                                            </div>
                                            <div className={`text-xs ${isUserOnline(otherParticipant?._id) ? "text-green-600" : "text-gray-600"}`}>{isUserOnline(otherParticipant?._id) ? "Online" : "Offline"}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Messages */}
                            <div className="p-2 space-y-3">
                                {/* Typing Indicator */}
                                {typingUsers.length > 0 && (
                                    <div className="flex justify-start">
                                        <div className="bg-[#D4BA71] px-3 py-2 rounded-lg">
                                            <div className="flex space-x-1">
                                                <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce"></div>
                                                <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                                                <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {loadingMessages ? <div className="flex justify-center">Loading messages...</div> : messagesData?.map((msg: any) => <MessageBubble key={msg._id} message={msg} currentUserId={user?._id} />)}

                                <div ref={messagesEndRef} />
                            </div>
                        </div>

                        {/* Input Box */}
                        <div className="relative w-full">
                            <input
                                type="text"
                                placeholder="Type a message..."
                                value={inputText}
                                onChange={(e) => {
                                    setInputText(e.target.value);
                                    handleTyping(!!e.target.value);
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        handleSend();
                                    }
                                }}
                                onFocus={() => handleTyping(true)}
                                onBlur={() => handleTyping(false)}
                                className="w-full border border-[#C9A94D] px-8 py-4 pr-12 focus:outline-none text-[#14213D]"
                            />
                            <button onClick={handleSend} disabled={!inputText.trim()} className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-[#C9A94D] py-3 px-8 rounded disabled:opacity-50">
                                <Image src="/messages/sendbutton.png" alt="Send button" height={20} width={20} />
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

// Separate component for message bubbles (keep this part the same)
const MessageBubble = ({ message, currentUserId }: { message: any; currentUserId?: string }) => {
    const isMe = message.sender._id === currentUserId;

    if (message.type === "offer") {
        return (
            <div className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                {!isMe && <Image src={message.sender.profileImg || "/home/avatar.jpg"} alt={message.sender.name} width={30} height={30} className="rounded-full mr-2 h-[30px] w-[30px]" />}
                <div className="bg-[#D4BA71] p-3 rounded-lg w-64">
                    <p className="font-semibold text-sm mb-1 text-center">Nest Offer</p>
                    <p className="text-xs flex justify-between">
                        <span>Property ID:</span>
                        <span>{message.propertyId}</span>
                    </p>
                    <p className="text-xs flex justify-between">
                        <span>Agreed dates:</span>
                        <span>{message.dates}</span>
                    </p>
                    <p className="text-xs flex justify-between">
                        <span>Agreed Fee:</span>
                        <span>{message.agreedFee}</span>
                    </p>
                    <p className="text-xs flex justify-between">
                        <span>Booking Fee:</span>
                        <span>{message.bookingFee}</span>
                    </p>
                    <p className="text-xs font-semibold flex justify-between">
                        <span>Total:</span>
                        <span>{message.total}</span>
                    </p>
                    <div className="flex flex-col gap-2 mt-2">
                        <div className="grid grid-cols-2 gap-2">
                            <Link href="/listings/1/pay" className="w-full">
                                <button className="bg-[#434D64] text-white px-3 py-1 rounded text-xs font-bold w-full">Pay</button>
                            </Link>
                            <button className="bg-[#434D64] text-white px-3 py-1 rounded text-xs font-bold">Cancel</button>
                        </div>
                        <Link href="/listings/1">
                            <button className="bg-[#434D64] text-white px-3 py-1 rounded text-xs font-bold w-full">View Property Details</button>
                        </Link>
                    </div>
                </div>
                {isMe && <Image src={message.sender.profileImg || "/home/avatar.jpg"} alt="Me" width={30} height={30} className="rounded-full h-[30px] w-[30px] ml-2" />}
            </div>
        );
    }

    if (message.type === "accepted") {
        return (
            <div className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                {!isMe && <Image src={message.sender.profileImg || "/home/avatar.jpg"} alt={message.sender.name} width={30} height={30} className="rounded-full mr-2 h-[30px] w-[30px]" />}
                <div className="bg-[#D4BA71] p-3 rounded-lg w-64">
                    <p className="font-semibold text-sm mb-1 text-center">Offer Accepted</p>
                    <div className="flex flex-col gap-2">
                        <div className="text-xs flex justify-between">
                            <div className="flex items-center gap-2">
                                <Image alt="Property Name" src="/messages/accepted/home-roof.png" height={16} width={16} />
                                <span>Property name:</span>
                            </div>
                            <span>{message.propertyName}</span>
                        </div>
                        <div className="text-xs flex justify-between">
                            <div className="flex items-center gap-2">
                                <Image alt="Address" src="/messages/accepted/location-pin.png" height={16} width={16} />
                                <span>Address:</span>
                            </div>
                            <span>{message.address}</span>
                        </div>
                        <div className="text-xs flex justify-between">
                            <div className="flex items-center gap-2">
                                <Image alt="Property Manager" src="/messages/accepted/user-alt.png" height={16} width={16} />
                                <span>Property Manager:</span>
                            </div>
                            <span>{message.manager}</span>
                        </div>
                        <div className="text-xs flex justify-between">
                            <div className="flex items-center gap-2">
                                <Image alt="Phone" src="/messages/accepted/phone.png" height={16} width={16} />
                                <span>Phone:</span>
                            </div>
                            <span>{message.phone}</span>
                        </div>
                    </div>
                </div>
                {isMe && <Image src={message.sender.profileImg || "/home/avatar.jpg"} alt="Me" width={30} height={30} className="rounded-full ml-2 h-[30px] w-[30px]" />}
            </div>
        );
    }

    if (message.type === "rejected") {
        return (
            <div className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                {!isMe && <Image src={message.sender.profileImg || "/home/avatar.jpg"} alt={message.sender.name} width={30} height={30} className="rounded-full mr-2 h-[30px] w-[30px]" />}
                <div className="bg-red-200 p-3 rounded-lg w-64 text-center font-semibold text-red-900">Offer Rejected</div>
                {isMe && <Image src={message.sender.profileImg || "/home/avatar.jpg"} alt="Me" width={30} height={30} className="rounded-full ml-2 h-[30px] w-[30px]" />}
            </div>
        );
    }

    // Normal text message
    return (
        <div className={`flex items-end ${isMe ? "justify-end" : "justify-start"}`}>
            {!isMe && <Image src={message.sender.profileImg || "/home/avatar.jpg"} alt={message.sender.name} width={30} height={30} className="rounded-full mr-2 h-[30px] w-[30px]" />}
            <p className={`px-3 py-2 rounded-lg max-w-xs break-words ${isMe ? "bg-[#14213D] text-white" : "bg-[#D4BA71] text-[#080E1A]"}`}>{message.text}</p>
            {isMe && <Image src={message.sender.profileImg || "/home/avatar.jpg"} alt="Me" width={30} height={30} className="rounded-full ml-2 h-[30px] w-[30px]" />}
        </div>
    );
};

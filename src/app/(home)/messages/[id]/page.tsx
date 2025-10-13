// "use client";

// import React, { useEffect, useRef, useState } from "react";
// import Image from "next/image";
// import { useRouter, useParams } from "next/navigation";
// import { ArrowLeft, Loader2 } from "lucide-react";
// import { useSelector } from "react-redux";
// import { RootState } from "@/redux/store";
// import { useSocket } from "@/redux/features/socket/socketHooks";
// import { useGetUserConversationsQuery, useSendMessageMutation, useGetConversationMessagesQuery } from "@/redux/features/messages/messageApi";

// export default function MessageConversationPage() {
//     const { user } = useSelector((state: RootState) => state.auth);
//     const { isConnected, connectSocket, disconnectSocket, joinConversation, leaveConversation, sendTyping, getTypingUsers, isUserOnline } = useSocket();

//     const params = useParams();
//     const router = useRouter();
//     const conversationId = params.id as string;

//     // Connect socket when component mounts
//     useEffect(() => {
//         if (user?._id) {
//             connectSocket(user._id);
//         }
//         return () => disconnectSocket();
//     }, [user?._id]);

//     // Get conversation data
//     const { data: conversationsResponse, isLoading: loadingConversations } = useGetUserConversationsQuery({});
//     const conversations = conversationsResponse?.data || [];
//     const currentConversation = conversations.find((conv: any) => conv._id === conversationId);
//     const otherParticipant = currentConversation?.participants?.find((p: any) => p._id !== user?._id);

//     const [sendMessage, { isLoading: isSending }] = useSendMessageMutation();
//     const [inputText, setInputText] = useState("");
//     const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);

//     // Get messages for selected conversation
//     const { data: messagesResponse, isLoading: loadingMessages, refetch: refetchMessages } = useGetConversationMessagesQuery({ conversationId: conversationId!, page: 1, limit: 50 }, { skip: !conversationId });
//     const messagesData = messagesResponse?.data || [];

//     const messagesEndRef = useRef<HTMLDivElement>(null);
//     const typingUsers = conversationId ? getTypingUsers(conversationId) : [];
//     const otherUserTyping = typingUsers.filter((userId) => userId !== user?._id);

//     // Join conversation room when socket is connected
//     useEffect(() => {
//         if (conversationId && isConnected) {
//             joinConversation(conversationId);
//         }
//         return () => {
//             if (conversationId) {
//                 leaveConversation(conversationId);
//             }
//         };
//     }, [conversationId, isConnected]);

//     // Auto-scroll to bottom when new messages arrive
//     useEffect(() => {
//         messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//     }, [messagesData, typingUsers]);

//     const handleSend = async () => {
//         if (!inputText.trim() || !conversationId || !user || isSending) return;

//         try {
//             await sendMessage({
//                 conversationId: conversationId,
//                 sender: user._id,
//                 type: "text",
//                 text: inputText,
//             }).unwrap();

//             setInputText("");
//             handleStopTyping();

//             // Refetch messages to ensure we have latest data
//             setTimeout(() => {
//                 refetchMessages();
//             }, 100);
//         } catch (error) {
//             console.error("Failed to send message:", error);
//         }
//     };

//     // Handle typing with proper debounce
//     const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         setInputText(e.target.value);

//         // Clear existing timeout
//         if (typingTimeout) {
//             clearTimeout(typingTimeout);
//         }

//         // Send typing start
//         if (conversationId && user && isConnected && e.target.value.trim()) {
//             sendTyping(conversationId, user._id, true);
//         }

//         // Set timeout to stop typing
//         const timeout = setTimeout(() => {
//             handleStopTyping();
//         }, 1000);

//         setTypingTimeout(timeout);
//     };

//     const handleStopTyping = () => {
//         if (conversationId && user && isConnected) {
//             sendTyping(conversationId, user._id, false);
//         }
//         if (typingTimeout) {
//             clearTimeout(typingTimeout);
//             setTypingTimeout(null);
//         }
//     };

//     // Cleanup typing on unmount
//     useEffect(() => {
//         return () => {
//             handleStopTyping();
//         };
//     }, []);

//     if (loadingConversations || !currentConversation) {
//         return (
//             <div className="h-screen flex items-center justify-center bg-[#B6BAC3]">
//                 <Loader2 className="h-8 w-8 animate-spin text-[#C9A94D]" />
//                 <span className="ml-2 text-[#14213D]">Loading conversation...</span>
//             </div>
//         );
//     }

//     const backendURL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

//     return (
//         <div className="h-screen flex flex-col bg-[#B6BAC3]">
//             {/* Header */}
//             <div className="fixed left-0 right-0 flex items-center p-4 border-b border-[#C9A94D] bg-[#9399A6] z-10">
//                 <button onClick={() => router.back()} className="mr-3 text-[#14213D]">
//                     <ArrowLeft size={24} />
//                 </button>

//                 <Image
//                     src={otherParticipant?.profileImg ? `${backendURL}${otherParticipant.profileImg}` : "/Noimg.svg"}
//                     alt={otherParticipant?.name || "User"}
//                     width={40}
//                     height={40}
//                     className="rounded-full border-2 border-white object-cover mr-3"
//                     onError={(e) => {
//                         e.currentTarget.src = "/Noimg.svg";
//                     }}
//                 />

//                 <div className="flex-1">
//                     <h2 className="font-bold text-[#14213D] text-lg">{otherParticipant?.name || "Unknown User"}</h2>
//                     <div className={`text-xs ${isUserOnline(otherParticipant?._id) ? "text-green-600" : "text-gray-600"}`}>{isUserOnline(otherParticipant?._id) ? "Online" : "Offline"}</div>
//                 </div>

//                 <div className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-500" : "bg-red-500"}`} title={isConnected ? "Connected" : "Disconnected"} />
//             </div>

//             {/* Messages Area */}
//             <div className="flex-1 overflow-y-auto p-4 space-y-3 mt-20">
//                 {loadingMessages ? (
//                     <div className="flex items-center justify-center h-full">
//                         <Loader2 className="h-6 w-6 animate-spin text-[#C9A94D]" />
//                         <span className="ml-2 text-[#14213D]">Loading messages...</span>
//                     </div>
//                 ) : messagesData.length === 0 ? (
//                     <div className="flex items-center justify-center h-full">
//                         <div className="text-center">
//                             <p className="text-[#14213D]">No messages yet</p>
//                             <p className="text-sm text-gray-600 mt-1">Start the conversation!</p>
//                         </div>
//                     </div>
//                 ) : (
//                     messagesData.map((msg: any) => <MessageBubble key={msg._id} message={msg} currentUserId={user?._id} />)
//                 )}

//                 {/* Typing Indicator */}
//                 {otherUserTyping.length > 0 && (
//                     <div className="flex justify-start">
//                         <div className="bg-[#D4BA71] px-4 py-3 rounded-lg">
//                             <div className="flex items-center gap-2">
//                                 <Image
//                                     src={otherParticipant?.profileImg ? `${backendURL}${otherParticipant.profileImg}` : "/Noimg.svg"}
//                                     alt={otherParticipant?.name || "User"}
//                                     width={20}
//                                     height={20}
//                                     className="rounded-full border border-white"
//                                     onError={(e) => {
//                                         e.currentTarget.src = "/Noimg.svg";
//                                     }}
//                                 />
//                                 <div className="flex space-x-1 items-center">
//                                     <span className="text-sm text-gray-600">is typing</span>
//                                     <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce"></div>
//                                     <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
//                                     <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 )}

//                 <div ref={messagesEndRef} />
//             </div>

//             {/* Input Box */}
//             <div className="sticky bottom-0 left-0 right-0 border-t border-[#C9A94D] p-4 bg-[#B6BAC3]">
//                 <div className="flex items-center gap-2">
//                     <input
//                         type="text"
//                         placeholder="Type a message..."
//                         value={inputText}
//                         onChange={handleInputChange}
//                         onKeyDown={(e) => {
//                             if (e.key === "Enter" && !e.shiftKey) {
//                                 e.preventDefault();
//                                 handleSend();
//                             }
//                         }}
//                         onBlur={handleStopTyping}
//                         className="flex-1 border border-[#C9A94D] rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#C9A94D] bg-white text-[#14213D]"
//                         disabled={isSending}
//                     />
//                     <button onClick={handleSend} disabled={!inputText.trim() || isSending} className="bg-[#C9A94D] hover:bg-[#B89A45] disabled:opacity-50 disabled:cursor-not-allowed p-3 rounded-lg transition-colors">
//                         {isSending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Image src="/messages/sendbutton.png" alt="Send" width={20} height={20} />}
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// }

// // Reuse the same MessageBubble component from your desktop version
// const MessageBubble = ({ message, currentUserId }: { message: any; currentUserId?: string }) => {
//     const isMe = message.sender?._id === currentUserId;
//     const backendURL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

//     // Handle optimistic messages
//     if (message.isOptimistic) {
//         return (
//             <div className={`flex items-end ${isMe ? "justify-end" : "justify-start"}`}>
//                 {!isMe && (
//                     <Image
//                         src={message.sender?.profileImg ? `${backendURL}${message.sender.profileImg}` : "/Noimg.svg"}
//                         alt={message.sender?.name}
//                         width={30}
//                         height={30}
//                         className="rounded-full mr-2 h-[30px] w-[30px]"
//                         onError={(e) => {
//                             e.currentTarget.src = "/Noimg.svg";
//                         }}
//                     />
//                 )}
//                 <div className={`px-3 py-2 rounded-lg max-w-xs break-words ${isMe ? "bg-[#14213D] text-white opacity-80" : "bg-[#D4BA71] text-[#080E1A] opacity-80"}`}>
//                     <p>{message.text}</p>
//                     <p className="text-xs opacity-70 mt-1">Sending...</p>
//                 </div>
//                 {isMe && (
//                     <Image
//                         src={message.sender?.profileImg ? `${backendURL}${message.sender.profileImg}` : "/Noimg.svg"}
//                         alt="Me"
//                         width={30}
//                         height={30}
//                         className="rounded-full ml-2 h-[30px] w-[30px]"
//                         onError={(e) => {
//                             e.currentTarget.src = "/Noimg.svg";
//                         }}
//                     />
//                 )}
//             </div>
//         );
//     }

//     if (message.type === "offer") {
//         return (
//             <div className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
//                 {!isMe && (
//                     <Image
//                         src={message.sender?.profileImg ? `${backendURL}${message.sender.profileImg}` : "/Noimg.svg"}
//                         alt={message.sender?.name}
//                         width={30}
//                         height={30}
//                         className="rounded-full mr-2 h-[30px] w-[30px]"
//                         onError={(e) => {
//                             e.currentTarget.src = "/Noimg.svg";
//                         }}
//                     />
//                 )}
//                 <div className="bg-[#D4BA71] p-3 rounded-lg w-64">
//                     <p className="font-semibold text-sm mb-1 text-center">Nest Offer</p>
//                     <p className="text-xs flex justify-between">
//                         <span>Property ID:</span>
//                         <span>{message.propertyId}</span>
//                     </p>
//                     <p className="text-xs flex justify-between">
//                         <span>Agreed dates:</span>
//                         <span>{message.dates}</span>
//                     </p>
//                     <p className="text-xs flex justify-between">
//                         <span>Agreed Fee:</span>
//                         <span>{message.agreedFee}</span>
//                     </p>
//                     <p className="text-xs flex justify-between">
//                         <span>Booking Fee:</span>
//                         <span>{message.bookingFee}</span>
//                     </p>
//                     <p className="text-xs font-semibold flex justify-between">
//                         <span>Total:</span>
//                         <span>{message.total}</span>
//                     </p>
//                     <div className="flex flex-col gap-2 mt-2">
//                         <div className="grid grid-cols-2 gap-2">
//                             <button className="bg-[#434D64] text-white px-3 py-1 rounded text-xs font-bold w-full">Pay</button>
//                             <button className="bg-[#434D64] text-white px-3 py-1 rounded text-xs font-bold">Cancel</button>
//                         </div>
//                         <button className="bg-[#434D64] text-white px-3 py-1 rounded text-xs font-bold w-full">View Property Details</button>
//                     </div>
//                 </div>
//                 {isMe && (
//                     <Image
//                         src={message.sender?.profileImg ? `${backendURL}${message.sender.profileImg}` : "/Noimg.svg"}
//                         alt="Me"
//                         width={30}
//                         height={30}
//                         className="rounded-full ml-2 h-[30px] w-[30px]"
//                         onError={(e) => {
//                             e.currentTarget.src = "/Noimg.svg";
//                         }}
//                     />
//                 )}
//             </div>
//         );
//     }

//     if (message.type === "accepted") {
//         return (
//             <div className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
//                 {!isMe && (
//                     <Image
//                         src={message.sender?.profileImg ? `${backendURL}${message.sender.profileImg}` : "/Noimg.svg"}
//                         alt={message.sender?.name}
//                         width={30}
//                         height={30}
//                         className="rounded-full mr-2 h-[30px] w-[30px]"
//                         onError={(e) => {
//                             e.currentTarget.src = "/Noimg.svg";
//                         }}
//                     />
//                 )}
//                 <div className="bg-[#D4BA71] p-3 rounded-lg w-64">
//                     <p className="font-semibold text-sm mb-1 text-center">Offer Accepted</p>
//                     <div className="flex flex-col gap-2">
//                         <div className="text-xs flex justify-between">
//                             <div className="flex items-center gap-2">
//                                 <Image alt="Property Name" src="/messages/accepted/home-roof.png" height={16} width={16} />
//                                 <span>Property name:</span>
//                             </div>
//                             <span>{message.propertyName}</span>
//                         </div>
//                         <div className="text-xs flex justify-between">
//                             <div className="flex items-center gap-2">
//                                 <Image alt="Address" src="/messages/accepted/location-pin.png" height={16} width={16} />
//                                 <span>Address:</span>
//                             </div>
//                             <span>{message.address}</span>
//                         </div>
//                         <div className="text-xs flex justify-between">
//                             <div className="flex items-center gap-2">
//                                 <Image alt="Property Manager" src="/messages/accepted/user-alt.png" height={16} width={16} />
//                                 <span>Property Manager:</span>
//                             </div>
//                             <span>{message.manager}</span>
//                         </div>
//                         <div className="text-xs flex justify-between">
//                             <div className="flex items-center gap-2">
//                                 <Image alt="Phone" src="/messages/accepted/phone.png" height={16} width={16} />
//                                 <span>Phone:</span>
//                             </div>
//                             <span>{message.phone}</span>
//                         </div>
//                     </div>
//                 </div>
//                 {isMe && (
//                     <Image
//                         src={message.sender?.profileImg ? `${backendURL}${message.sender.profileImg}` : "/Noimg.svg"}
//                         alt="Me"
//                         width={30}
//                         height={30}
//                         className="rounded-full ml-2 h-[30px] w-[30px]"
//                         onError={(e) => {
//                             e.currentTarget.src = "/Noimg.svg";
//                         }}
//                     />
//                 )}
//             </div>
//         );
//     }

//     if (message.type === "rejected") {
//         return (
//             <div className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
//                 {!isMe && (
//                     <Image
//                         src={message.sender?.profileImg ? `${backendURL}${message.sender.profileImg}` : "/Noimg.svg"}
//                         alt={message.sender?.name}
//                         width={30}
//                         height={30}
//                         className="rounded-full mr-2 h-[30px] w-[30px]"
//                         onError={(e) => {
//                             e.currentTarget.src = "/Noimg.svg";
//                         }}
//                     />
//                 )}
//                 <div className="bg-red-200 p-3 rounded-lg w-64 text-center font-semibold text-red-900">Offer Rejected</div>
//                 {isMe && (
//                     <Image
//                         src={message.sender?.profileImg || "/Noimg.svg"}
//                         alt="Me"
//                         width={30}
//                         height={30}
//                         className="rounded-full ml-2 h-[30px] w-[30px]"
//                         onError={(e) => {
//                             e.currentTarget.src = "/Noimg.svg";
//                         }}
//                     />
//                 )}
//             </div>
//         );
//     }

//     // Normal text message
//     return (
//         <div className={`flex items-end ${isMe ? "justify-end" : "justify-start"}`}>
//             {!isMe && (
//                 <Image
//                     src={message.sender?.profileImg ? `${backendURL}${message.sender.profileImg}` : "/Noimg.svg"}
//                     alt={message.sender?.name}
//                     width={30}
//                     height={30}
//                     className="rounded-full mr-2 h-[30px] w-[30px]"
//                     onError={(e) => {
//                         e.currentTarget.src = "/Noimg.svg";
//                     }}
//                 />
//             )}
//             <div className={`px-3 py-2 rounded-lg max-w-xs break-words ${isMe ? "bg-[#14213D] text-white" : "bg-[#D4BA71] text-[#080E1A]"}`}>
//                 <p>{message.text}</p>
//                 {message.createdAt && <p className="text-xs opacity-70 mt-1 text-right">{new Date(message.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>}
//             </div>
//             {isMe && (
//                 <Image
//                     src={message.sender?.profileImg ? `${backendURL}${message.sender.profileImg}` : "/Noimg.svg"}
//                     alt="Me"
//                     width={30}
//                     height={30}
//                     className="rounded-full ml-2 h-[30px] w-[30px]"
//                     onError={(e) => {
//                         e.currentTarget.src = "/Noimg.svg";
//                     }}
//                 />
//             )}
//         </div>
//     );
// };

"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useSocket } from "@/redux/features/socket/socketHooks";
import { useGetUserConversationsQuery, useSendMessageMutation, useGetConversationMessagesQuery } from "@/redux/features/messages/messageApi";

// Avatar component for fallback
const Avatar = ({ name, size = 48, className = "" }: { name: string; size?: number; className?: string }) => {
    const getInitials = (fullName: string) => {
        return fullName
            .split(" ")
            .map((part) => part.charAt(0))
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    const getBackgroundColor = (fullName: string) => {
        const colors = ["bg-[#C9A94D]", "bg-[#14213D]", "bg-[#9399A6]", "bg-[#434D64]", "bg-[#B89A45]", "bg-[#080E1A]"];
        const index = fullName.length % colors.length;
        return colors[index];
    };

    return (
        <div className={`rounded-full border-2 border-white flex items-center justify-center text-white font-semibold ${getBackgroundColor(name)} ${className}`} style={{ width: size, height: size }}>
            {getInitials(name)}
        </div>
    );
};

export default function MessageConversationPage() {
    const { user } = useSelector((state: RootState) => state.auth);
    const { isConnected, connectSocket, disconnectSocket, joinConversation, leaveConversation, sendTyping, getTypingUsers, isUserOnline } = useSocket();

    const params = useParams();
    const router = useRouter();
    const conversationId = params.id as string;

    // Connect socket when component mounts
    useEffect(() => {
        if (user?._id) {
            connectSocket(user._id);
        }
        return () => disconnectSocket();
    }, [user?._id]);

    // Get conversation data
    const { data: conversationsResponse, isLoading: loadingConversations } = useGetUserConversationsQuery({});
    const conversations = conversationsResponse?.data || [];
    const currentConversation = conversations.find((conv: any) => conv._id === conversationId);
    const otherParticipant = currentConversation?.participants?.find((p: any) => p._id !== user?._id);

    const [sendMessage, { isLoading: isSending }] = useSendMessageMutation();
    const [inputText, setInputText] = useState("");
    const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);

    // Get messages for selected conversation
    const { data: messagesResponse, isLoading: loadingMessages, refetch: refetchMessages } = useGetConversationMessagesQuery({ conversationId: conversationId!, page: 1, limit: 50 }, { skip: !conversationId });
    const messagesData = messagesResponse?.data || [];

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const typingUsers = conversationId ? getTypingUsers(conversationId) : [];
    const otherUserTyping = typingUsers.filter((userId) => userId !== user?._id);

    // Join conversation room when socket is connected
    useEffect(() => {
        if (conversationId && isConnected) {
            joinConversation(conversationId);
        }
        return () => {
            if (conversationId) {
                leaveConversation(conversationId);
            }
        };
    }, [conversationId, isConnected]);

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messagesData, typingUsers]);

    const handleSend = async () => {
        if (!inputText.trim() || !conversationId || !user || isSending) return;

        try {
            await sendMessage({
                conversationId: conversationId,
                sender: user._id,
                type: "text",
                text: inputText,
            }).unwrap();

            setInputText("");
            handleStopTyping();

            // Refetch messages to ensure we have latest data
            setTimeout(() => {
                refetchMessages();
            }, 100);
        } catch (error) {
            console.error("Failed to send message:", error);
        }
    };

    // Handle typing with proper debounce
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputText(e.target.value);

        // Clear existing timeout
        if (typingTimeout) {
            clearTimeout(typingTimeout);
        }

        // Send typing start
        if (conversationId && user && isConnected && e.target.value.trim()) {
            sendTyping(conversationId, user._id, true);
        }

        // Set timeout to stop typing
        const timeout = setTimeout(() => {
            handleStopTyping();
        }, 1000);

        setTypingTimeout(timeout);
    };

    const handleStopTyping = () => {
        if (conversationId && user && isConnected) {
            sendTyping(conversationId, user._id, false);
        }
        if (typingTimeout) {
            clearTimeout(typingTimeout);
            setTypingTimeout(null);
        }
    };

    // Cleanup typing on unmount
    useEffect(() => {
        return () => {
            handleStopTyping();
        };
    }, []);

    if (loadingConversations || !currentConversation) {
        return (
            <div className="h-screen flex items-center justify-center bg-[#B6BAC3]">
                <Loader2 className="h-8 w-8 animate-spin text-[#C9A94D]" />
                <span className="ml-2 text-[#14213D]">Loading conversation...</span>
            </div>
        );
    }

    const backendURL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

    return (
        <div className="h-screen flex flex-col bg-[#B6BAC3]">
            {/* Header */}
            <div className="fixed left-0 right-0 flex items-center p-4 border-b border-[#C9A94D] bg-[#9399A6] z-10">
                <button onClick={() => router.back()} className="mr-3 text-[#14213D]">
                    <ArrowLeft size={24} />
                </button>

                {otherParticipant?.profileImg ? (
                    <Image
                        src={`${backendURL}${otherParticipant.profileImg}`}
                        alt={otherParticipant?.name || "User"}
                        width={40}
                        height={40}
                        className="rounded-full border-2 border-white object-cover mr-3"
                        onError={(e) => {
                            e.currentTarget.style.display = "none";
                        }}
                    />
                ) : (
                    <Avatar name={otherParticipant?.name || "Unknown User"} size={40} className="mr-3" />
                )}

                <div className="flex-1">
                    <h2 className="font-bold text-[#14213D] text-lg">{otherParticipant?.name || "Unknown User"}</h2>
                    <div className={`text-xs ${isUserOnline(otherParticipant?._id) ? "text-green-600" : "text-gray-600"}`}>{isUserOnline(otherParticipant?._id) ? "Online" : "Offline"}</div>
                </div>

                <div className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-500" : "bg-red-500"}`} title={isConnected ? "Connected" : "Disconnected"} />
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 mt-20">
                {loadingMessages ? (
                    <div className="flex items-center justify-center h-full">
                        <Loader2 className="h-6 w-6 animate-spin text-[#C9A94D]" />
                        <span className="ml-2 text-[#14213D]">Loading messages...</span>
                    </div>
                ) : messagesData.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                            <p className="text-[#14213D]">No messages yet</p>
                            <p className="text-sm text-gray-600 mt-1">Start the conversation!</p>
                        </div>
                    </div>
                ) : (
                    messagesData.map((msg: any) => <MessageBubble key={msg._id} message={msg} currentUserId={user?._id} />)
                )}

                {/* Typing Indicator */}
                {otherUserTyping.length > 0 && (
                    <div className="flex justify-start">
                        <div className="bg-[#D4BA71] px-4 py-3 rounded-lg">
                            <div className="flex items-center gap-2">
                                {otherParticipant?.profileImg ? (
                                    <Image
                                        src={`${backendURL}${otherParticipant.profileImg}`}
                                        alt={otherParticipant?.name || "User"}
                                        width={20}
                                        height={20}
                                        className="rounded-full border border-white"
                                        onError={(e) => {
                                            e.currentTarget.style.display = "none";
                                        }}
                                    />
                                ) : (
                                    <Avatar name={otherParticipant?.name || "Unknown User"} size={20} />
                                )}
                                <div className="flex space-x-1 items-center">
                                    <span className="text-sm text-gray-600">is typing</span>
                                    <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce"></div>
                                    <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                                    <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input Box */}
            <div className="sticky bottom-0 left-0 right-0 border-t border-[#C9A94D] p-4 bg-[#B6BAC3]">
                <div className="flex items-center gap-2">
                    <input
                        type="text"
                        placeholder="Type a message..."
                        value={inputText}
                        onChange={handleInputChange}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                handleSend();
                            }
                        }}
                        onBlur={handleStopTyping}
                        className="flex-1 border border-[#C9A94D] rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#C9A94D] bg-white text-[#14213D]"
                        disabled={isSending}
                    />
                    <button onClick={handleSend} disabled={!inputText.trim() || isSending} className="bg-[#C9A94D] hover:bg-[#B89A45] disabled:opacity-50 disabled:cursor-not-allowed p-3 rounded-lg transition-colors">
                        {isSending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Image src="/messages/sendbutton.png" alt="Send" width={20} height={20} />}
                    </button>
                </div>
            </div>
        </div>
    );
}

// Reuse the same MessageBubble component from your desktop version
const MessageBubble = ({ message, currentUserId }: { message: any; currentUserId?: string }) => {
    const isMe = message.sender?._id === currentUserId;
    const backendURL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

    // Handle optimistic messages
    if (message.isOptimistic) {
        return (
            <div className={`flex items-end ${isMe ? "justify-end" : "justify-start"}`}>
                {!isMe &&
                    (message.sender?.profileImg ? (
                        <Image
                            src={`${backendURL}${message.sender.profileImg}`}
                            alt={message.sender?.name}
                            width={30}
                            height={30}
                            className="rounded-full mr-2 h-[30px] w-[30px]"
                            onError={(e) => {
                                e.currentTarget.style.display = "none";
                            }}
                        />
                    ) : (
                        <Avatar name={message.sender?.name || "Unknown User"} size={30} className="mr-2" />
                    ))}
                <div className={`px-3 py-2 rounded-lg max-w-xs break-words ${isMe ? "bg-[#14213D] text-white opacity-80" : "bg-[#D4BA71] text-[#080E1A] opacity-80"}`}>
                    <p>{message.text}</p>
                    <p className="text-xs opacity-70 mt-1">Sending...</p>
                </div>
                {isMe &&
                    (message.sender?.profileImg ? (
                        <Image
                            src={`${backendURL}${message.sender.profileImg}`}
                            alt="Me"
                            width={30}
                            height={30}
                            className="rounded-full ml-2 h-[30px] w-[30px]"
                            onError={(e) => {
                                e.currentTarget.style.display = "none";
                            }}
                        />
                    ) : (
                        <Avatar name={message.sender?.name || "Unknown User"} size={30} className="ml-2" />
                    ))}
            </div>
        );
    }

    if (message.type === "offer") {
        return (
            <div className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                {!isMe &&
                    (message.sender?.profileImg ? (
                        <Image
                            src={`${backendURL}${message.sender.profileImg}`}
                            alt={message.sender?.name}
                            width={30}
                            height={30}
                            className="rounded-full mr-2 h-[30px] w-[30px]"
                            onError={(e) => {
                                e.currentTarget.style.display = "none";
                            }}
                        />
                    ) : (
                        <Avatar name={message.sender?.name || "Unknown User"} size={30} className="mr-2" />
                    ))}
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
                            <button className="bg-[#434D64] text-white px-3 py-1 rounded text-xs font-bold w-full">Pay</button>
                            <button className="bg-[#434D64] text-white px-3 py-1 rounded text-xs font-bold">Cancel</button>
                        </div>
                        <button className="bg-[#434D64] text-white px-3 py-1 rounded text-xs font-bold w-full">View Property Details</button>
                    </div>
                </div>
                {isMe &&
                    (message.sender?.profileImg ? (
                        <Image
                            src={`${backendURL}${message.sender.profileImg}`}
                            alt="Me"
                            width={30}
                            height={30}
                            className="rounded-full ml-2 h-[30px] w-[30px]"
                            onError={(e) => {
                                e.currentTarget.style.display = "none";
                            }}
                        />
                    ) : (
                        <Avatar name={message.sender?.name || "Unknown User"} size={30} className="ml-2" />
                    ))}
            </div>
        );
    }

    if (message.type === "accepted") {
        return (
            <div className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                {!isMe &&
                    (message.sender?.profileImg ? (
                        <Image
                            src={`${backendURL}${message.sender.profileImg}`}
                            alt={message.sender?.name}
                            width={30}
                            height={30}
                            className="rounded-full mr-2 h-[30px] w-[30px]"
                            onError={(e) => {
                                e.currentTarget.style.display = "none";
                            }}
                        />
                    ) : (
                        <Avatar name={message.sender?.name || "Unknown User"} size={30} className="mr-2" />
                    ))}
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
                {isMe &&
                    (message.sender?.profileImg ? (
                        <Image
                            src={`${backendURL}${message.sender.profileImg}`}
                            alt="Me"
                            width={30}
                            height={30}
                            className="rounded-full ml-2 h-[30px] w-[30px]"
                            onError={(e) => {
                                e.currentTarget.style.display = "none";
                            }}
                        />
                    ) : (
                        <Avatar name={message.sender?.name || "Unknown User"} size={30} className="ml-2" />
                    ))}
            </div>
        );
    }

    if (message.type === "rejected") {
        return (
            <div className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                {!isMe &&
                    (message.sender?.profileImg ? (
                        <Image
                            src={`${backendURL}${message.sender.profileImg}`}
                            alt={message.sender?.name}
                            width={30}
                            height={30}
                            className="rounded-full mr-2 h-[30px] w-[30px]"
                            onError={(e) => {
                                e.currentTarget.style.display = "none";
                            }}
                        />
                    ) : (
                        <Avatar name={message.sender?.name || "Unknown User"} size={30} className="mr-2" />
                    ))}
                <div className="bg-red-200 p-3 rounded-lg w-64 text-center font-semibold text-red-900">Offer Rejected</div>
                {isMe &&
                    (message.sender?.profileImg ? (
                        <Image
                            src={`${backendURL}${message.sender.profileImg}`}
                            alt="Me"
                            width={30}
                            height={30}
                            className="rounded-full ml-2 h-[30px] w-[30px]"
                            onError={(e) => {
                                e.currentTarget.style.display = "none";
                            }}
                        />
                    ) : (
                        <Avatar name={message.sender?.name || "Unknown User"} size={30} className="ml-2" />
                    ))}
            </div>
        );
    }

    // Normal text message
    return (
        <div className={`flex items-end ${isMe ? "justify-end" : "justify-start"}`}>
            {!isMe &&
                (message.sender?.profileImg ? (
                    <Image
                        src={`${backendURL}${message.sender.profileImg}`}
                        alt={message.sender?.name}
                        width={30}
                        height={30}
                        className="rounded-full mr-2 h-[30px] w-[30px]"
                        onError={(e) => {
                            e.currentTarget.style.display = "none";
                        }}
                    />
                ) : (
                    <Avatar name={message.sender?.name || "Unknown User"} size={30} className="mr-2" />
                ))}
            <div className={`px-3 py-2 rounded-lg max-w-xs break-words ${isMe ? "bg-[#14213D] text-white" : "bg-[#D4BA71] text-[#080E1A]"}`}>
                <p>{message.text}</p>
                {message.createdAt && <p className="text-xs opacity-70 mt-1 text-right">{new Date(message.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>}
            </div>
            {isMe &&
                (message.sender?.profileImg ? (
                    <Image
                        src={`${backendURL}${message.sender.profileImg}`}
                        alt="Me"
                        width={30}
                        height={30}
                        className="rounded-full ml-2 h-[30px] w-[30px]"
                        onError={(e) => {
                            e.currentTarget.style.display = "none";
                        }}
                    />
                ) : (
                    <Avatar name={message.sender?.name || "Unknown User"} size={30} className="ml-2" />
                ))}
        </div>
    );
};

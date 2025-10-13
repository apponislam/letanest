"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Star, MessagesSquare, Loader2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useSocket } from "@/redux/features/socket/socketHooks";
import { useGetUserConversationsQuery, useSendMessageMutation, useGetConversationMessagesQuery, useMarkConversationAsReadMutation } from "@/redux/features/messages/messageApi";
import { useGetMyPublishedPropertiesQuery } from "@/redux/features/property/propertyApi";

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

export default function MessagesLayout2() {
    const { user } = useSelector((state: RootState) => state.auth);
    const { isConnected, onlineUsers, connectSocket, disconnectSocket, joinConversation, leaveConversation, sendTyping, getTypingUsers, isUserOnline } = useSocket();
    const [markConversationAsRead] = useMarkConversationAsReadMutation();

    // Connect socket when component mounts
    useEffect(() => {
        if (user?._id) {
            console.log("🔗 [MessagesLayout2] Connecting socket for user:", user._id);
            connectSocket(user._id);
        } else {
            console.warn("⚠️ [MessagesLayout2] No user found, cannot connect socket");
        }

        return () => {
            console.log("🔌 [MessagesLayout2] Cleaning up - disconnecting socket");
            disconnectSocket();
        };
    }, [user?._id, connectSocket, disconnectSocket]);

    // Get conversations
    const { data: conversationsResponse, isLoading: loadingConversations, error: conversationsError, refetch: refetchConversations } = useGetUserConversationsQuery({});
    const conversations = conversationsResponse?.data || [];

    const [sendMessage, { isLoading: isSending }] = useSendMessageMutation();

    const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
    const [inputText, setInputText] = useState("");
    const [search, setSearch] = useState("");
    const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);

    // Get messages for selected conversation
    const { data: messagesResponse, isLoading: loadingMessages, error: messagesError, refetch: refetchMessages } = useGetConversationMessagesQuery({ conversationId: selectedConversation!, page: 1, limit: 50 }, { skip: !selectedConversation });

    const [showOfferModal, setShowOfferModal] = useState(false);
    const [selectedProperty, setSelectedProperty] = useState<string | null>(null);
    const [offerType, setOfferType] = useState<string>("text"); // Default to text message
    const { data: publishedProperties, isLoading, error } = useGetMyPublishedPropertiesQuery();
    console.log(publishedProperties);
    console.log(error);

    const messagesData = messagesResponse?.data || [];

    const router = useRouter();
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const messagesContainerRef = useRef<HTMLDivElement>(null);
    const typingUsers = selectedConversation ? getTypingUsers(selectedConversation) : [];

    // Auto-select first conversation
    useEffect(() => {
        if (conversations.length > 0 && !selectedConversation) {
            console.log("🎯 [MessagesLayout2] Auto-selecting first conversation:", conversations[0]._id);
            setSelectedConversation(conversations[0]._id);
        }
    }, [conversations, selectedConversation]);

    // Join conversation room when selected and socket is connected
    useEffect(() => {
        if (selectedConversation && isConnected) {
            console.log("💬 [MessagesLayout2] Joining conversation:", selectedConversation);
            joinConversation(selectedConversation);
        } else if (selectedConversation && !isConnected) {
            console.warn("⚠️ [MessagesLayout2] Cannot join conversation - socket not connected");
        }

        return () => {
            if (selectedConversation) {
                console.log("🚪 [MessagesLayout2] Leaving conversation:", selectedConversation);
                leaveConversation(selectedConversation);
            }
        };
    }, [selectedConversation, isConnected, joinConversation, leaveConversation]);

    // Reset unread count when conversation is selected
    useEffect(() => {
        if (selectedConversation && user?._id) {
            // Mark conversation as read when selected
            markConversationAsRead(selectedConversation);
            console.log("✅ [MessagesLayout2] Marking conversation as read:", selectedConversation);
        }
    }, [selectedConversation, user?._id, markConversationAsRead]);

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        console.log("📜 [MessagesLayout2] Messages updated, scrolling to bottom. Messages count:", messagesData.length);
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messagesData, typingUsers]);

    const handleSend = async () => {
        if (!inputText.trim() || !selectedConversation || !user || isSending) {
            console.warn("⚠️ [MessagesLayout2] Cannot send message - missing requirements:", {
                hasText: !!inputText.trim(),
                hasConversation: !!selectedConversation,
                hasUser: !!user,
                isSending,
            });
            return;
        }

        console.log("📤 [MessagesLayout2] Sending message:", inputText);
        try {
            await sendMessage({
                conversationId: selectedConversation,
                sender: user._id,
                type: "text",
                text: inputText,
            }).unwrap();

            console.log("✅ [MessagesLayout2] Message sent successfully");
            setInputText("");
            handleStopTyping();

            // Refetch messages to ensure we have latest data
            setTimeout(() => {
                refetchMessages();
                refetchConversations();
            }, 100);
        } catch (error) {
            console.error("❌ [MessagesLayout2] Failed to send message:", error);
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
        if (selectedConversation && user && isConnected && e.target.value.trim()) {
            console.log("⌨️ [MessagesLayout2] Starting typing indicator");
            sendTyping(selectedConversation, user._id, true);
        }

        // Set timeout to stop typing
        const timeout = setTimeout(() => {
            handleStopTyping();
        }, 1000);

        setTypingTimeout(timeout);
    };

    const handleStopTyping = () => {
        if (selectedConversation && user && isConnected) {
            console.log("⌨️ [MessagesLayout2] Stopping typing indicator");
            sendTyping(selectedConversation, user._id, false);
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

    // Filter conversations based on search
    const filteredConversations = conversations.filter((conv: any) => {
        const otherParticipant = conv.participants.find((p: any) => p._id !== user?._id);
        return otherParticipant?.name?.toLowerCase().includes(search.toLowerCase());
    });

    const currentConversation = conversations.find((conv: any) => conv._id === selectedConversation);
    const otherParticipant = currentConversation?.participants?.find((p: any) => p._id !== user?._id);

    // Filter out current user from typing indicators
    const otherUserTyping = typingUsers.filter((userId) => userId !== user?._id);

    // Helper function to get unread count
    const getUnreadCount = (conversation: any) => {
        return conversation.unreadCount || 0;
    };

    // Helper function to format last message
    const formatLastMessage = (lastMessage: any) => {
        if (!lastMessage) return "";

        switch (lastMessage.type) {
            case "offer":
                return `Nest Offer: ${lastMessage.propertyId || ""}`;
            case "accepted":
                return `Accepted: ${lastMessage.propertyId || ""}`;
            case "rejected":
                return `Rejected: ${lastMessage.propertyId || ""}`;
            default:
                return lastMessage.text || "";
        }
    };

    const handleConversationClick = async (conversationId: string) => {
        if (window.innerWidth < 768) {
            router.push(`/messages/${conversationId}`);
        } else {
            setSelectedConversation(conversationId);
        }

        // Mark conversation as read when clicked
        try {
            await markConversationAsRead(conversationId).unwrap();
            console.log("✅ Conversation marked as read");
        } catch (error) {
            console.error("❌ Failed to mark conversation as read:", error);
        }
    };

    if (loadingConversations) {
        return (
            <div className="h-[90vh] flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-[#C9A94D]" />
                <span className="ml-2 text-[#14213D]">Loading conversations...</span>
            </div>
        );
    }

    if (conversationsError) {
        return (
            <div className="h-[90vh] flex items-center justify-center">
                <div className="text-center">
                    <MessagesSquare className="h-16 w-16 text-red-500 mx-auto mb-4" />
                    <p className="text-red-600">Failed to load conversations</p>
                    <button onClick={() => refetchConversations()} className="mt-4 bg-[#C9A94D] text-white px-4 py-2 rounded">
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    const backendURL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

    return (
        <div className="h-[90vh] flex bg-[#B6BAC3] border border-[#C9A94D]">
            {/* Left Sidebar */}
            <div className="w-full md:w-1/3 bg-[#B6BAC3] border-r border-[#C9A94D] flex flex-col">
                <div className="py-8 px-5 border-b border-[#C9A94D]">
                    <div className="flex items-center justify-between mb-5">
                        <h1 className="font-bold text-[28px] text-[#14213D]">Messages</h1>
                        {/* <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${isConnected ? "bg-green-500" : "bg-red-500"}`} title={isConnected ? "Connected" : "Disconnected"} />
                            <span className="text-xs text-[#14213D]">{onlineUsers.length} online</span>
                        </div> */}
                    </div>

                    <div className="flex items-center border border-[#C9A94D] rounded-lg px-3 py-2 bg-white">
                        <Image src="/messages/chat-search.png" alt="Search" width={20} height={20} className="mr-2" />
                        <input type="text" placeholder="Search conversations" value={search} onChange={(e) => setSearch(e.target.value)} className="flex-1 focus:outline-none text-black placeholder-gray-600 bg-transparent" />
                    </div>
                </div>

                <div className="flex-1 flex flex-col overflow-y-auto py-6 px-4 gap-4 custom-scrollbar">
                    {filteredConversations.length === 0 ? (
                        <div className="text-center text-[#14213D] py-8">
                            <MessagesSquare className="h-12 w-12 mx-auto mb-3 text-[#C9A94D] opacity-50" />
                            <p>{search ? "No conversations found" : "No conversations"}</p>
                        </div>
                    ) : (
                        filteredConversations.map((conversation: any) => {
                            const otherParticipant = conversation.participants.find((p: any) => p._id !== user?._id);
                            const unreadCount = getUnreadCount(conversation);
                            const isOnline = isUserOnline(otherParticipant?._id);

                            return (
                                <div key={conversation._id} className={`flex flex-col p-3 cursor-pointer hover:bg-[#9399A6] rounded-lg transition-colors ${selectedConversation === conversation._id ? "bg-[#9399A6] shadow-md" : ""}`} onClick={() => handleConversationClick(conversation._id)}>
                                    <div className="flex items-center gap-3">
                                        <div className="relative">
                                            {otherParticipant?.profileImg ? (
                                                <Image
                                                    src={`${backendURL}${otherParticipant.profileImg}`}
                                                    alt={otherParticipant?.name}
                                                    width={48}
                                                    height={48}
                                                    className="rounded-full border-2 border-white object-cover h-12 w-12"
                                                    onError={(e) => {
                                                        // If image fails to load, the parent will render the Avatar component
                                                        e.currentTarget.style.display = "none";
                                                    }}
                                                />
                                            ) : null}
                                            <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${isOnline ? "bg-green-500" : "bg-gray-400"}`} title={isOnline ? "Online" : "Offline"} />
                                            {!otherParticipant?.profileImg && <Avatar name={otherParticipant?.name || "Unknown User"} size={48} />}

                                            {/* Unread count badge */}
                                            {unreadCount > 0 && <div className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">{unreadCount > 9 ? "9+" : unreadCount}</div>}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between">
                                                <p className="text-[#14213D] truncate font-medium">{otherParticipant?.name || "Unknown User"}</p>
                                                <div className="flex items-center gap-2">
                                                    {unreadCount > 0 && <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full min-w-[20px] text-center">{unreadCount > 9 ? "9+" : unreadCount}</span>}
                                                    {isOnline ? <span className="text-xs text-green-300 font-medium">Online</span> : <span className="text-xs text-gray-600 font-medium">Offline</span>}
                                                </div>
                                            </div>
                                            <p className={`text-sm truncate ${unreadCount > 0 ? "text-white font-medium" : "text-white"}`}>{formatLastMessage(conversation.lastMessage) || "No messages yet"}</p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            {/* Conversation Panel */}
            <div className="flex-1 md:flex flex-col bg-[#B6BAC3] border-l border-[#C9A94D] hidden">
                {!selectedConversation ? (
                    <div className="flex-1 flex items-center justify-center">
                        <div className="text-center">
                            <MessagesSquare className="h-16 w-16 text-[#C9A94D] mx-auto mb-4 opacity-50" />
                            <p className="text-[#14213D] text-lg">Select a conversation to start chatting</p>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Chat Header */}
                        <div className="sticky top-0 w-full bg-[#9399A6] py-4 px-6 border-b border-[#C9A94D] z-10">
                            <div className="flex items-center gap-4">
                                {otherParticipant?.profileImg ? (
                                    <Image
                                        src={`${backendURL}${otherParticipant.profileImg}`}
                                        alt="Profile"
                                        width={64}
                                        height={64}
                                        className="rounded-full object-cover border-2 border-white h-16 w-16"
                                        onError={(e) => {
                                            e.currentTarget.style.display = "none";
                                        }}
                                    />
                                ) : (
                                    <Avatar name={otherParticipant?.name || "Unknown User"} size={64} />
                                )}
                                <div className="flex-1 text-[#14213D]">
                                    <h1 className="text-xl font-bold">{otherParticipant?.name || "Unknown User"}</h1>
                                    <div className="flex items-center gap-6 text-sm">
                                        <p>Host</p>
                                        <div className="flex items-center gap-2">
                                            <Star className="h-4 w-4 fill-current text-yellow-500" />
                                            <p>4.5</p>
                                        </div>
                                        <div className={`text-sm font-medium ${isUserOnline(otherParticipant?._id) ? "text-green-300" : "text-gray-600"}`}>{isUserOnline(otherParticipant?._id) ? "Online" : "Offline"}</div>
                                    </div>
                                </div>
                                <div className={`px-3 py-1 rounded-full text-xs font-medium ${isConnected ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>{isConnected ? "Connected" : "Disconnected"}</div>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 flex flex-col overflow-hidden">
                            {loadingMessages ? (
                                <div className="flex-1 flex items-center justify-center">
                                    <Loader2 className="h-8 w-8 animate-spin text-[#C9A94D]" />
                                    <span className="ml-2 text-[#14213D]">Loading messages...</span>
                                </div>
                            ) : messagesError ? (
                                <div className="flex-1 flex items-center justify-center">
                                    <div className="text-center">
                                        <p className="text-red-600">Failed to load messages</p>
                                        <button onClick={() => refetchMessages()} className="mt-2 bg-[#C9A94D] text-white px-3 py-1 rounded text-sm">
                                            Retry
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar" ref={messagesContainerRef}>
                                    {messagesData.length === 0 ? (
                                        <div className="flex-1 flex items-center justify-center h-full">
                                            <div className="text-center">
                                                <MessagesSquare className="h-12 w-12 text-[#C9A94D] opacity-50 mx-auto mb-3" />
                                                <p className="text-[#14213D]">No messages yet</p>
                                                <p className="text-sm text-gray-600 mt-1">Start the conversation!</p>
                                            </div>
                                        </div>
                                    ) : (
                                        messagesData.map((msg: any) => <MessageBubble key={msg._id} message={msg} currentUserId={user?._id} />)
                                    )}

                                    {/* Typing Indicator - AT THE BOTTOM */}
                                    {otherUserTyping.length > 0 && (
                                        <div className="flex justify-start">
                                            <div className="bg-[#D4BA71] px-4 py-3 rounded-lg">
                                                <div className="flex space-x-1 items-center">
                                                    <span className="text-sm text-gray-600 mr-2">Typing...</span>
                                                    <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce"></div>
                                                    <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                                                    <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    <div ref={messagesEndRef} />
                                </div>
                            )}

                            {/* Input Box */}
                            <div className="border-t border-[#C9A94D] p-4 bg-[#B6BAC3]">
                                {/* {user?.role === "GUEST" ? null : <button className="bg-[#14213D] w-full text-white rounded-lg mb-1 p-2">Make an Offer</button>} */}
                                {user?.role === "GUEST" ? null : (
                                    <div className="relative">
                                        <button onClick={() => setShowOfferModal(true)} className="bg-[#14213D] w-full text-white rounded-lg mb-1 p-2">
                                            Make an Offer
                                        </button>

                                        {/* Offer Modal - POSITIONED ABOVE THE BUTTON */}
                                        {showOfferModal && (
                                            <div className="absolute bottom-full left-0 right-0 mb-2 bg-white border border-[#C9A94D] rounded-lg shadow-lg z-50 p-4 min-w-[300px]">
                                                <div className="flex justify-between items-center mb-3">
                                                    <h3 className="font-bold text-[#14213D]">Make an Offer</h3>
                                                    <button onClick={() => setShowOfferModal(false)} className="text-gray-500 hover:text-gray-700">
                                                        ✕
                                                    </button>
                                                </div>

                                                {/* Property Selection - RADIO BUTTONS */}
                                                <div className="mb-4">
                                                    <label className="block text-sm font-medium text-[#14213D] mb-2">Select Property</label>
                                                    {isLoading ? (
                                                        <div className="text-center py-2">
                                                            <Loader2 className="h-4 w-4 animate-spin mx-auto" />
                                                            <span className="text-xs text-gray-600">Loading properties...</span>
                                                        </div>
                                                    ) : publishedProperties?.data ? (
                                                        <div className="space-y-2 max-h-40 overflow-y-auto">
                                                            {publishedProperties.data.map((property: any) => (
                                                                <label key={property._id} className="flex items-center space-x-2 cursor-pointer">
                                                                    <input type="radio" name="property" value={property._id} checked={selectedProperty === property._id} onChange={(e) => setSelectedProperty(e.target.value)} className="text-[#C9A94D] focus:ring-[#C9A94D]" />
                                                                    <span className="text-sm">
                                                                        {property.propertyNumber} - ${property.price}
                                                                    </span>
                                                                </label>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <p className="text-sm text-gray-600">No published properties found</p>
                                                    )}
                                                </div>

                                                {/* Date and Price Inputs */}
                                                <div className="space-y-3 mb-4">
                                                    <div>
                                                        <label className="block text-sm font-medium text-[#14213D] mb-1">Check-in Date</label>
                                                        <input type="date" className="w-full border border-[#C9A94D] rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#C9A94D] text-sm" />
                                                    </div>

                                                    <div>
                                                        <label className="block text-sm font-medium text-[#14213D] mb-1">Check-out Date</label>
                                                        <input type="date" className="w-full border border-[#C9A94D] rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#C9A94D] text-sm" />
                                                    </div>

                                                    <div>
                                                        <label className="block text-sm font-medium text-[#14213D] mb-1">Fee Offered ($)</label>
                                                        <input type="number" placeholder="Enter amount" className="w-full border border-[#C9A94D] rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#C9A94D] text-sm" />
                                                    </div>
                                                </div>

                                                {/* Action Buttons */}
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => {
                                                            if (selectedProperty) {
                                                                // Handle offer creation
                                                                console.log("Creating offer for property:", selectedProperty);
                                                                setShowOfferModal(false);
                                                                setSelectedProperty(null);
                                                            }
                                                        }}
                                                        disabled={!selectedProperty}
                                                        className="flex-1 bg-[#14213D] text-white py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                                                    >
                                                        Create Offer
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setShowOfferModal(false);
                                                            setSelectedProperty(null);
                                                        }}
                                                        className="px-4 py-2 border border-gray-300 rounded-lg text-[#14213D] text-sm"
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

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
                    </>
                )}
            </div>
        </div>
    );
}

// Message Bubble Component
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

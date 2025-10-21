"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Star, MessagesSquare, Loader2 } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useSocket } from "@/redux/features/socket/socketHooks";
import { useGetUserConversationsQuery, useSendMessageMutation, useGetConversationMessagesQuery, useRejectOfferMutation, useMarkConversationAsReadsMutation } from "@/redux/features/messages/messageApi";
import { useGetMyPublishedPropertiesQuery } from "@/redux/features/property/propertyApi";
import { socketService } from "@/redux/features/socket/socketService";
import { useConnectStripeAccountMutation, useGetStripeAccountStatusQuery } from "@/redux/features/users/usersApi";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";

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
    // const [markConversationAsRead] = useMarkConversationAsReadsMutation();
    const [markConversationAsReads] = useMarkConversationAsReadsMutation();

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
            // disconnectSocket();
        };
    }, [user?._id, connectSocket]);

    // Get conversations
    const { data: conversationsResponse, isLoading: loadingConversations, error: conversationsError, refetch: refetchConversations } = useGetUserConversationsQuery({});
    const conversations = conversationsResponse?.data || [];
    // console.log(conversations);

    const [sendMessage, { isLoading: isSending }] = useSendMessageMutation();
    const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
    const [inputText, setInputText] = useState("");
    const [search, setSearch] = useState("");
    const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);

    // Get messages for selected conversation
    const { data: messagesResponse, isLoading: loadingMessages, error: messagesError, refetch: refetchMessages } = useGetConversationMessagesQuery({ conversationId: selectedConversation!, page: 1, limit: 50 }, { skip: !selectedConversation });

    const [showOfferModal, setShowOfferModal] = useState(false);
    const [selectedProperty, setSelectedProperty] = useState<string | null>(null);
    const [agreed, setAgreed] = useState(false);
    const { data: publishedProperties, isLoading } = useGetMyPublishedPropertiesQuery();
    const messagesData = messagesResponse?.data || [];
    const [showStripeTooltip, setShowStripeTooltip] = useState(false);
    const { data: response, isLoading: stripeLoading } = useGetStripeAccountStatusQuery();
    const [connectStripeAccount, { isLoading: isConnectingStripe }] = useConnectStripeAccountMutation();
    const stripeAccount = response?.data;
    // console.log(stripeAccount);
    const isStripeConnected = stripeAccount?.status === "verified";

    const handleConnectStripe = async () => {
        try {
            const result = await connectStripeAccount().unwrap();
            if (result.data?.onboardingUrl) {
                window.location.href = result.data.onboardingUrl;
            }
        } catch (error: any) {
            console.log(error);
            toast.error(error.message ? error.message : "Failed to connect Stripe");
        }
    };

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
            markConversationAsReads(selectedConversation);
            socketService.joinConversation(selectedConversation);
            console.log("✅ [MessagesLayout2] Marking conversation as read:", selectedConversation);
        }
    }, [selectedConversation, user?._id, markConversationAsReads]);

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

        // console.log("📤 [MessagesLayout2] Sending message:", inputText);
        try {
            await sendMessage({
                conversationId: selectedConversation,
                sender: user._id,
                type: "text",
                text: inputText,
            }).unwrap();

            // console.log("✅ [MessagesLayout2] Message sent successfully");
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

    const handleSendOffer = async () => {
        if (!selectedProperty || !agreed || !user || !selectedConversation) {
            console.warn("⚠️ Cannot send offer - missing requirements:", {
                selectedProperty,
                agreed,
                user: !!user,
                conversation: !!selectedConversation,
            });
            return;
        }

        // Collect input values
        const checkInInput = (document.querySelector<HTMLInputElement>("#checkInDate")?.value || "").trim();
        const checkOutInput = (document.querySelector<HTMLInputElement>("#checkOutDate")?.value || "").trim();
        const feeInput = (document.querySelector<HTMLInputElement>("#offerFee")?.value || "").trim();

        if (!checkInInput || !checkOutInput || !feeInput) {
            console.warn("⚠️ Offer missing required fields (dates or fee)");
            return;
        }

        try {
            // Convert string dates to Date objects
            const checkInDate = new Date(checkInInput);
            const checkOutDate = new Date(checkOutInput);

            // Validate dates
            if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
                console.warn("⚠️ Invalid dates provided");
                return;
            }

            console.log("📤 Sending offer:", {
                propertyId: selectedProperty,
                checkInDate: checkInDate,
                checkOutDate: checkOutDate,
                agreedFee: feeInput,
            });

            await sendMessage({
                conversationId: selectedConversation,
                sender: user._id,
                type: "offer",
                propertyId: selectedProperty,
                checkInDate: checkInDate.toISOString(), // Convert to ISO string
                checkOutDate: checkOutDate.toISOString(), // Convert to ISO string
                agreedFee: feeInput,
            }).unwrap();

            console.log("✅ Offer sent successfully");

            // Reset modal and inputs
            setShowOfferModal(false);
            setSelectedProperty(null);
            setAgreed(false);

            // Refetch latest data
            setTimeout(() => {
                refetchMessages();
                refetchConversations();
            }, 100);
        } catch (error) {
            console.log(error);
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
    // console.log(conversations);

    // Helper function to format last message
    const formatLastMessage = (lastMessage: any) => {
        if (!lastMessage) return "";

        switch (lastMessage.type) {
            case "offer":
                return `Nest Offer: ${lastMessage.propertyId.propertyNumber || ""}`;
            case "accepted":
                return `Accepted: ${lastMessage.propertyId.propertyNumber || ""}`;
            case "rejected":
                return `Rejected: ${lastMessage.propertyId.propertyNumber || ""}`;
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
            const result = await markConversationAsReads(conversationId).unwrap();
            console.log("mark all message read", result);
            // const result2 = await markConversationAsRead(conversationId).unwrap();
            // console.log(result2);
            console.log("✅ Conversation marked as read");
        } catch (error) {
            console.log(error);
            // console.error("❌ Failed to mark conversation as read:", error);
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

    const backendURL = process.env.NEXT_PUBLIC_BASE_API || "http://localhost:5000";

    return (
        <div className="h-[90vh] flex bg-[#B6BAC3] border border-[#C9A94D]">
            <StripeStatusModal></StripeStatusModal>

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
                                                    {/* {unreadCount > 0 && <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full min-w-[20px] text-center">{unreadCount > 9 ? "9+" : unreadCount}</span>} */}
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
                                        <p>{otherParticipant.role}</p>
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
                                {user?.role === "GUEST" ? null : (
                                    <div className="relative">
                                        {/* Stripe Connection Check */}
                                        {stripeLoading ? (
                                            <button disabled className="bg-gray-400 w-full text-white rounded-lg mb-1 p-2 opacity-50 cursor-not-allowed">
                                                <Loader2 className="h-4 w-4 animate-spin mx-auto" />
                                            </button>
                                        ) : !isStripeConnected ? (
                                            <div className="relative">
                                                <button onClick={() => setShowStripeTooltip(!showStripeTooltip)} className="bg-gray-400 w-full text-white rounded-lg mb-1 p-2 cursor-pointer">
                                                    Connect Stripe to Make Offers
                                                </button>

                                                {/* Click-based Tooltip */}
                                                {showStripeTooltip && (
                                                    <div className="absolute bottom-full left-0 right-0 mb-2 bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-800 z-50">
                                                        <div className="flex justify-between items-start mb-2">
                                                            <div>
                                                                <p className="font-medium">Stripe Account Required</p>
                                                                <p className="text-xs mt-1">You need to connect your Stripe account to receive payments for offers.</p>
                                                            </div>
                                                            <button onClick={() => setShowStripeTooltip(false)} className="text-yellow-600 hover:text-yellow-800 ml-2">
                                                                ✕
                                                            </button>
                                                        </div>
                                                        <button
                                                            onClick={() => {
                                                                setShowStripeTooltip(false);
                                                                handleConnectStripe();
                                                            }}
                                                            disabled={isConnectingStripe}
                                                            className="w-full bg-yellow-500 text-white py-2 px-3 rounded text-sm font-medium hover:bg-yellow-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                        >
                                                            {isConnectingStripe ? <Loader2 className="h-4 w-4 animate-spin mx-auto" /> : "Connect Stripe Now"}
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <>
                                                <button onClick={() => setShowOfferModal(true)} className="bg-[#14213D] w-full text-white rounded-lg mb-1 p-2">
                                                    Make an Offer
                                                </button>

                                                {/* Offer Modal */}
                                                {showOfferModal && (
                                                    <div className="absolute bottom-full left-0 right-0 mb-2 bg-white border border-[#C9A94D] rounded-lg shadow-lg z-50 p-4 min-w-[300px]">
                                                        <div className="flex justify-between items-center mb-3">
                                                            <h3 className="font-bold text-[#14213D]">Make an Offer</h3>
                                                            <button onClick={() => setShowOfferModal(false)} className="text-gray-500 hover:text-gray-700">
                                                                ✕
                                                            </button>
                                                        </div>

                                                        {/* Property Selection */}
                                                        <div className="mb-4">
                                                            <label className="block text-sm font-medium text-[#14213D] mb-2">Select Property</label>
                                                            {isLoading ? (
                                                                <div className="text-center py-2">
                                                                    <Loader2 className="h-4 w-4 animate-spin mx-auto" />
                                                                    <span className="text-xs text-gray-600">Loading properties...</span>
                                                                </div>
                                                            ) : publishedProperties?.data ? (
                                                                <div className="space-y-2 max-h-20 overflow-y-auto">
                                                                    {publishedProperties.data.map((property: any) => (
                                                                        <label key={property._id} className="flex items-center space-x-2 cursor-pointer">
                                                                            <input type="radio" name="property" value={property._id} checked={selectedProperty === property._id} onChange={(e) => setSelectedProperty(e.target.value)} className="accent-[#C9A94D] w-4 h-4 focus:ring-[#C9A94D]" />
                                                                            <span className="text-sm">
                                                                                Property No: <span className="text-[#C9A94D] font-bold">{property.propertyNumber}</span> - Price: <span className="text-[#C9A94C] font-bold">£{property.price}</span>
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
                                                            <div className="flex items-center gap-3">
                                                                <div className="flex-1">
                                                                    <label className="block text-sm font-medium text-[#14213D] mb-1">Check-in Date</label>
                                                                    <input id="checkInDate" type="date" className="w-full border border-[#C9A94D] rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#C9A94D] text-sm" />
                                                                </div>

                                                                <div className="flex-1">
                                                                    <label className="block text-sm font-medium text-[#14213D] mb-1">Check-out Date</label>
                                                                    <input id="checkOutDate" type="date" className="w-full border border-[#C9A94D] rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#C9A94D] text-sm" />
                                                                </div>
                                                            </div>

                                                            <div>
                                                                <label className="block text-sm font-medium text-[#14213D] mb-1">Fee Offered (£)</label>
                                                                <input id="offerFee" type="number" placeholder="Enter amount" className="w-full border border-[#C9A94D] rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#C9A94D] text-sm" />
                                                            </div>
                                                        </div>

                                                        {/* ✅ Agree to T&Cs */}
                                                        <div className="flex items-center gap-2 mb-3">
                                                            <input type="checkbox" id="agree" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="accent-[#C9A94D] w-4 h-4 focus:ring-[#C9A94D]" />
                                                            <label htmlFor="agree" className="text-sm text-gray-700 cursor-pointer select-none">
                                                                I agree to the{" "}
                                                                <Link href="/terms-of-conditions" target="_blank" className="text-[#C9A94D] hover:underline">
                                                                    T&Cs
                                                                </Link>
                                                            </label>
                                                        </div>

                                                        {/* Action Buttons */}
                                                        <div className="flex gap-2">
                                                            <button onClick={handleSendOffer} disabled={!selectedProperty || !agreed} className="flex-1 bg-[#14213D] text-white py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed text-sm">
                                                                Send Offer
                                                            </button>
                                                            <button
                                                                onClick={() => {
                                                                    setShowOfferModal(false);
                                                                    setSelectedProperty(null);
                                                                    setAgreed(false);
                                                                }}
                                                                className="px-4 py-2 border border-gray-300 rounded-lg text-[#14213D] text-sm"
                                                            >
                                                                Cancel
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </>
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
    const backendURL = process.env.NEXT_PUBLIC_BASE_API || "http://localhost:5000";

    const [rejectOffer, { isLoading: isRejecting }] = useRejectOfferMutation();

    const handleRejectOffer = async () => {
        try {
            await rejectOffer({
                messageId: message._id,
                conversationId: message.conversationId,
            }).unwrap();
        } catch (error) {
            console.error("Failed to reject offer:", error);
        }
    };

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
        // Format dates properly
        const formatDate = (dateString: string) => {
            if (!dateString) return "Not set";

            const date = new Date(dateString);
            if (isNaN(date.getTime())) return "Invalid date";

            const day = String(date.getDate()).padStart(2, "0");
            const month = String(date.getMonth() + 1).padStart(2, "0"); // months are 0-indexed
            const year = date.getFullYear();

            return `${day}/${month}/${year}`;
        };

        // Calculate total if not provided
        const calculateTotal = () => {
            const agreedFee = parseFloat(message.agreedFee) || 0;
            const bookingFee = parseFloat(message.bookingFee) || 0;
            return (agreedFee + bookingFee).toFixed(2);
        };

        const totalAmount = message.total || calculateTotal();

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
                    <p className="font-semibold text-sm mb-2 text-center">Nest Offer</p>

                    {/* Property ID - show only first 8 characters for better display */}
                    <p className="text-xs flex justify-between mb-1">
                        <span className="text-gray-700">Property ID:</span>
                        <span className="font-medium">{message.propertyId?.propertyNumber}</span>
                    </p>

                    {/* Dates with proper formatting */}
                    <div className="text-xs mb-1 flex justify-between">
                        <span className="text-gray-700 block mb-1">Agreed dates:</span>
                        <div className="font-medium block text-right">
                            <p>{formatDate(message.checkInDate)}</p> <p>{formatDate(message.checkOutDate)}</p>
                        </div>
                    </div>

                    {/* Fees with currency formatting */}
                    <p className="text-xs flex justify-between mb-1">
                        <span className="text-gray-700">Agreed Fee:</span>
                        <span className="font-medium">£{parseFloat(message.agreedFee || "0").toFixed(2)}</span>
                    </p>

                    <p className="text-xs flex justify-between mb-1">
                        <span className="text-gray-700">Booking Fee:</span>
                        <span className="font-medium">{message.bookingFee ? `£${parseFloat(message.bookingFee).toFixed(2)}` : "£0.00"}</span>
                    </p>

                    {/* Total */}
                    <p className="text-xs font-semibold flex justify-between  pt-1 mt-1">
                        <span>Total:</span>
                        <span>£{totalAmount}</span>
                    </p>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-2 mt-3">
                        <div className="grid grid-cols-2 gap-2">
                            {isMe ? (
                                // Disabled Pay button when message is from current user
                                <button disabled className="bg-gray-400 text-white px-3 py-1 rounded text-xs font-bold w-full cursor-not-allowed opacity-60">
                                    Pay
                                </button>
                            ) : (
                                // Active Pay button when message is from other user
                                <Link href={`/listings/${message._id}/pay`} className="w-full">
                                    <button className="bg-[#434D64] text-white px-3 py-1 rounded text-xs font-bold w-full hover:bg-[#363D4F] transition-colors">Pay</button>
                                </Link>
                            )}
                            {/* <button className="bg-[#434D64] text-white px-3 py-1 rounded text-xs font-bold hover:bg-[#363D4F] transition-colors">Cancel</button> */}
                            <button onClick={handleRejectOffer} disabled={isRejecting} className="hover:bg-[#363D4F] text-white px-3 py-1 rounded text-xs font-bold bg-[#434D64] transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                                {isRejecting ? "Cancelling..." : "Cancel"}
                            </button>
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

    // console.log(message);

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
                        <div className="text-xs flex justify-between flex-wrap items-start">
                            <div className="flex items-center gap-2">
                                <Image alt="Property Name" src="/messages/accepted/home-roof.png" height={16} width={16} />
                                <span>Property name:</span>
                            </div>
                            <span className="text-right flex-1">{message?.propertyId?.title}</span>
                        </div>
                        <div className="text-xs flex justify-between flex-wrap items-start">
                            <div className="flex items-center gap-2">
                                <Image alt="Address" src="/messages/accepted/location-pin.png" height={16} width={16} />
                                <span>Address:</span>
                            </div>
                            <span className="text-right flex-1">{message?.propertyId?.location}</span>
                        </div>
                        <div className="text-xs flex justify-between flex-wrap items-start">
                            <div className="flex items-center gap-2">
                                <Image alt="Property Manager" src="/messages/accepted/user-alt.png" height={16} width={16} />
                                <span>Property Manager:</span>
                            </div>
                            <span className="text-right flex-1">{message?.sender?.name}</span>
                        </div>
                        <div className="text-xs flex justify-between flex-wrap items-start">
                            <div className="flex items-center gap-2">
                                <Image alt="Phone" src="/messages/accepted/phone.png" height={16} width={16} />
                                <span>Phone:</span>
                            </div>
                            <span>{message?.sender?.phone}</span>
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

// Stripe Status Modal Component
const StripeStatusModal = () => {
    const searchParams = useSearchParams();
    const [isVisible, setIsVisible] = useState(false);
    const [status, setStatus] = useState<"success" | "failed" | null>(null);
    const [connectStripeAccount, { isLoading: isConnectingStripe }] = useConnectStripeAccountMutation();

    const handleConnectStripe = async () => {
        try {
            const result = await connectStripeAccount().unwrap();
            if (result.data?.onboardingUrl) {
                window.location.href = result.data.onboardingUrl;
            }
        } catch (error) {
            console.error("Failed to connect Stripe:", error);
        }
    };

    useEffect(() => {
        const stripe = searchParams.get("stripe");

        if (stripe === "success" || stripe === "failed") {
            setStatus(stripe);
            setIsVisible(true);

            // Remove the stripe parameter from URL without page reload
            const newUrl = new URL(window.location.href);
            newUrl.searchParams.delete("stripe");
            window.history.replaceState({}, "", newUrl.toString());
        }
    }, [searchParams]);

    const closeModal = () => {
        setIsVisible(false);
        setStatus(null);
    };

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative">
                {/* Close Button */}
                <button onClick={closeModal} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {/* Content */}
                <div className="text-center">
                    {status === "success" ? (
                        <>
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Stripe Connected Successfully!</h3>
                            <p className="text-gray-600 mb-6">Your Stripe account has been verified and you can now make offers and receive payments.</p>
                        </>
                    ) : (
                        <>
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Stripe Connection Failed</h3>
                            <p className="text-gray-600 mb-6">There was an issue connecting your Stripe account. Please try again to start receiving payments.</p>
                        </>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                        {status === "failed" && (
                            <button
                                onClick={() => {
                                    closeModal();
                                    handleConnectStripe();
                                }}
                                disabled={isConnectingStripe}
                                className="flex-1 bg-yellow-500 text-white py-2 px-4 rounded-lg hover:bg-yellow-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isConnectingStripe ? <Loader2 className="h-4 w-4 animate-spin mx-auto" /> : "Connect Stripe Now"}
                            </button>
                        )}
                        <button onClick={closeModal} className={`bg-[#14213D] text-white py-2 px-4 rounded-lg hover:bg-[#1a2d5a] transition-colors font-medium ${status === "failed" ? "flex-1" : "w-full"}`}>
                            Continue to Messages
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

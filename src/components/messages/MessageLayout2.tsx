"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Star, MessagesSquare, Loader2, MessageCircle, CalendarIcon } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useSocket } from "@/redux/features/socket/socketHooks";
import { useGetUserConversationsQuery, useSendMessageMutation, useGetConversationMessagesQuery, useRejectOfferMutation, useMarkConversationAsReadsMutation, useCreateConversationMutation, useSendMessageAutoMutation, useConvertRequestToOfferMutation, useSendWelcomeMessageMutation, useEditOfferMutation, useConvertMakeOfferToRequestMutation } from "@/redux/features/messages/messageApi";
import { useGetMyPublishedPropertiesQuery } from "@/redux/features/property/propertyApi";
import { socketService } from "@/redux/features/socket/socketService";
import { useConnectStripeAccountMutation, useGetRandomAdminQuery, useGetStripeAccountStatusQuery } from "@/redux/features/users/usersApi";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { useGetHostRatingStatsQuery } from "@/redux/features/rating/ratingApi";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar } from "../ui/calendar";
import { DateRange } from "react-day-picker";
import ReportModal from "./RepostHost";
import { useAppSelector } from "@/redux/hooks";
import { currentUser } from "@/redux/features/auth/authSlice";
import EditOfferModal from "./EditOfferModal";
import SuggestNewOfferModal from "./SuggestNewOffer";
import BankTransferModal from "./BankTransferModal";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

// Avatar component for fallback
const Avatar = ({ name, size = 48, className = "", isVerified = false }: { name: string; size?: number; className?: string; isVerified?: boolean }) => {
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
        <div className={`rounded-full border-2 flex items-center justify-center text-white font-semibold ${getBackgroundColor(name)} ${className} ${isVerified ? "border-green-500" : "border-white"}`} style={{ width: size, height: size }}>
            {getInitials(name)}
        </div>
    );
};

export default function MessagesLayout2() {
    const { user } = useSelector((state: RootState) => state.auth);
    const { isConnected, connectSocket, joinConversation, leaveConversation, sendTyping, getTypingUsers, isUserOnline } = useSocket();
    const [markConversationAsReads] = useMarkConversationAsReadsMutation();
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);

    // Add these to your component state
    const [date, setDate] = React.useState<DateRange | undefined>();
    const [calculatedPrice, setCalculatedPrice] = useState(0);

    const messageInputRef = useRef<HTMLInputElement>(null);

    // Add this function to handle focusing the input
    const focusMessageInput = () => {
        if (messageInputRef.current) {
            messageInputRef.current.focus();
            messageInputRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
        }
    };

    // Connect socket when component mounts
    useEffect(() => {
        if (user?._id) {
            // console.log("🔗 [MessagesLayout2] Connecting socket for user:", user._id);
            connectSocket(user._id);
        } else {
            console.warn("⚠️ [MessagesLayout2] No user found, cannot connect socket");
        }

        return () => {
            // console.log("🔌 [MessagesLayout2] Cleaning up - disconnecting socket");
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
    const { data: messagesResponse, isLoading: loadingMessages, error: messagesError, refetch: refetchMessages } = useGetConversationMessagesQuery({ conversationId: selectedConversation!, page: 1, limit: 150 }, { skip: !selectedConversation });

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
                // leaveConversation(selectedConversation);
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
    const { data: randomAdminData, refetch: refetchRandomAdmin } = useGetRandomAdminQuery();
    const [createConversation] = useCreateConversationMutation();
    const [sendMessageAuto] = useSendMessageAutoMutation();
    // useSendMessageAutoMutation;

    const handleSupport = async () => {
        console.log(randomAdminData);

        const conversationResult = await createConversation({
            participants: [randomAdminData?.data?._id!],
            propertyId: user?._id!,
        }).unwrap();
        if (conversationResult.success && conversationResult.data?._id) {
            const conversationId = conversationResult.data._id;

            // Step 2: Send the booking message
            console.log("📤 Sending booking message...");
            await sendMessage({
                conversationId: conversationId,
                sender: user?._id,
                type: "text",
                text: `I need support`,
                skip: true,
            }).unwrap();
            setSelectedConversation(conversationId);

            await sendMessageAuto({
                conversationId: conversationId,
                sender: randomAdminData?.data?._id!,
                type: "text",
                text: `Thank you for contacting us! Please use the chat below to tell us how we can help. Our team strives to respond within 24 hours, though response times may be slightly longer during busy periods.`,
                skip: true,
            }).unwrap();
            // console.log(sendMessageAuto);
        } else {
            console.error("❌ Conversation creation failed:", conversationResult.message);
        }
    };

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

        try {
            await sendMessage({
                conversationId: selectedConversation,
                sender: user._id,
                type: "text",
                text: inputText,
            }).unwrap();

            setInputText("");
            handleStopTyping();

            setTimeout(() => {
                refetchMessages();
                refetchConversations();
            }, 100);
        } catch (error) {
            console.error("❌ [MessagesLayout2] Failed to send message:", error);
        }
    };

    const [manualPrice, setManualPrice] = useState("");

    const handleSendOffer = async () => {
        // Calculate final price - manual price takes priority if both are provided
        const finalPrice = manualPrice ? parseFloat(manualPrice) : calculatedPrice;

        if (!selectedProperty || !agreed || !user || !selectedConversation || finalPrice === 0) {
            console.warn("⚠️ Cannot send offer - missing requirements:", {
                selectedProperty,
                agreed,
                user: !!user,
                conversation: !!selectedConversation,
                finalPrice,
            });
            return;
        }

        try {
            console.log("📤 Sending offer:", {
                propertyId: selectedProperty,
                checkInDate: date?.from,
                checkOutDate: date?.to,
                agreedFee: finalPrice,
                nights: date?.from && date?.to ? Math.ceil((date.to.getTime() - date.from.getTime()) / (1000 * 60 * 60 * 24)) : null,
                offerType: manualPrice ? "manual" : "calculated",
            });

            await sendMessage({
                conversationId: selectedConversation,
                sender: user._id,
                type: "offer",
                propertyId: selectedProperty,
                agreedFee: finalPrice.toString(),
                // Include dates if available (even for manual offers)
                ...(date?.from && { checkInDate: date.from.toISOString() }),
                ...(date?.to && { checkOutDate: date.to.toISOString() }),
            }).unwrap();

            console.log("✅ Offer sent successfully");

            // Reset modal and inputs
            setShowOfferModal(false);
            setSelectedProperty(null);
            setAgreed(false);
            setDate(undefined);
            setCalculatedPrice(0);
            setManualPrice("");

            // Refetch latest data
            setTimeout(() => {
                refetchMessages();
                refetchConversations();
            }, 100);
        } catch (error) {
            console.error("❌ Failed to send offer:", error);
        }
    };

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
    const otherUserTyping = typingUsers.filter((userId: any) => userId !== user?._id);

    const { data: ratingStats } = useGetHostRatingStatsQuery(otherParticipant?.role === "HOST" ? otherParticipant._id : "", {
        skip: !otherParticipant || otherParticipant?.role !== "HOST",
    });

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
            case "request":
                return `Request: ${lastMessage.propertyId.propertyNumber || ""}`;
            case "makeoffer":
                return `New Conversation For: ${lastMessage.propertyId.propertyNumber || ""}`;
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

            console.log("✅ Conversation marked as read");
        } catch (error) {
            console.log(error);
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

    const getDisplayName = (name: string, role: string) => {
        if (!name) return "Unknown User";

        const parts = name.trim().split(" ");

        if (role === "HOST") {
            if (parts.length === 1) return parts[0];
            if (parts.length === 2) return parts[0];
            if (parts.length >= 3) return parts.slice(0, 2).join(" ");
        }

        return name;
    };

    const backendURL = process.env.NEXT_PUBLIC_BASE_API || "http://localhost:5000";

    // console.log(otherParticipant);

    return (
        <div className="h-[90vh] flex bg-[#B6BAC3] border border-[#C9A94D]">
            <StripeStatusModal></StripeStatusModal>

            {/* Left Sidebar */}
            <div className="w-full md:w-1/3 bg-[#B6BAC3] border-r border-[#C9A94D] flex flex-col">
                <div className="py-8 px-5 border-b border-[#C9A94D]">
                    <div className="flex items-center justify-between mb-5">
                        <h1 className="font-bold text-[28px] text-[#14213D]">Messages</h1>
                        {user?.role === "HOST" && (
                            <div>
                                <button className="flex items-center gap-2 bg-[#14213D] text-white px-3 py-1 rounded-xl" onClick={handleSupport}>
                                    <MessageCircle className="w-5 h-5" />
                                    Support
                                </button>
                            </div>
                        )}
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
                            // const isOnline = isUserOnline(otherParticipant?._id);
                            // console.log(otherParticipant);

                            return (
                                <div key={conversation._id} className={`flex flex-col p-3 cursor-pointer hover:bg-[#9399A6] rounded-lg transition-colors ${selectedConversation === conversation._id ? "bg-[#9399A6] shadow-md" : ""}`} onClick={() => handleConversationClick(conversation._id)}>
                                    <div className="flex items-center gap-3">
                                        <div className="relative">
                                            {otherParticipant?.profileImg ? (
                                                <div className="relative">
                                                    <Image
                                                        src={`${backendURL}${otherParticipant.profileImg}`}
                                                        alt={otherParticipant?.name}
                                                        width={48}
                                                        height={48}
                                                        className={`rounded-full border-2 object-cover h-12 w-12 ${otherParticipant?.isVerifiedByAdmin ? "border-green-500" : "border-white"}`}
                                                        onError={(e) => {
                                                            // If image fails to load, the parent will render the Avatar component
                                                            e.currentTarget.style.display = "none";
                                                        }}
                                                    />
                                                    {/* Verified text at bottom center for Image */}
                                                    {otherParticipant?.isVerifiedByAdmin && <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 bg-green-500 text-white text-[8px] px-1 rounded-[4px] whitespace-nowrap">verified</div>}
                                                </div>
                                            ) : null}

                                            {!otherParticipant?.profileImg && (
                                                <div className="relative">
                                                    <Avatar name={otherParticipant?.name || "Unknown User"} size={48} isVerified={otherParticipant?.isVerifiedByAdmin} />
                                                    {/* Verified text at bottom center for Avatar */}
                                                    {otherParticipant?.isVerifiedByAdmin && <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 bg-green-500 text-white text-[8px] px-1 rounded-[4px] whitespace-nowrap">verified</div>}
                                                </div>
                                            )}

                                            {/* Unread count badge */}
                                            {unreadCount > 0 && <div className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">{unreadCount > 9 ? "9+" : unreadCount}</div>}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between">
                                                <p className="text-[#14213D] truncate font-medium">{otherParticipant?.name || "Unknown User"}</p>
                                                <div className="flex items-center gap-2">
                                                    {/* {unreadCount > 0 && <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full min-w-[20px] text-center">{unreadCount > 9 ? "9+" : unreadCount}</span>} */}
                                                    {/* {isOnline ? <span className="text-xs text-green-300 font-medium">Online</span> : <span className="text-xs text-gray-600 font-medium">Offline</span>} */}
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
                                    {/* <h1 className="text-xl font-bold">{otherParticipant?.name || "Unknown User"}</h1> */}
                                    <div className="flex items-center gap-4">
                                        <h1 className="text-xl font-bold"> {getDisplayName(otherParticipant?.name, otherParticipant?.role)}</h1>
                                        {otherParticipant?.role === "HOST" ? (
                                            <button className="bg-[#C9A94D] px-2 text-white rounded-[4px] hover:bg-[#b8973e] transition-colors" onClick={() => setIsReportModalOpen(true)}>
                                                Report Host
                                            </button>
                                        ) : otherParticipant?.role === "GUEST" ? (
                                            <button className="bg-[#14213D] px-2 text-white rounded-[4px] hover:bg-[#0f1a2f] transition-colors" onClick={() => setIsReportModalOpen(true)}>
                                                Report Guest
                                            </button>
                                        ) : null}
                                    </div>
                                    <div className="flex items-center gap-6 text-sm">
                                        <p>{otherParticipant?.role}</p>

                                        {otherParticipant?.role === "HOST" && (
                                            <div className="flex items-center gap-2">
                                                <Star className="h-4 w-4 fill-current text-[#C9A94D]" />
                                                <p>{ratingStats?.data?.averageRating?.toFixed(1) || "0.0"}</p>
                                            </div>
                                        )}
                                        {/* {otherParticipant.role === "HOST" && (
                                            <button className="bg-[#C9A94D] px-2 text-white rounded-[10px] hover:bg-[#b8973e] transition-colors" onClick={() => setIsReportModalOpen(true)}>
                                                Report Host
                                            </button>
                                        )} */}
                                        {/* <div className={`text-sm font-medium ${isUserOnline(otherParticipant?._id) ? "text-green-300" : "text-gray-600"}`}>{isUserOnline(otherParticipant?._id) ? "Online" : "Offline"}</div> */}
                                    </div>
                                </div>
                                <ReportModal isOpen={isReportModalOpen} onClose={() => setIsReportModalOpen(false)} reportedUserId={otherParticipant._id} reportedUserName={otherParticipant.name} reportedUserRole="HOST" conversationId={selectedConversation} />
                                {/* <div className={`px-3 py-1 rounded-full text-xs font-medium ${isConnected ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>{isConnected ? "Connected" : "Disconnected"}</div> */}
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
                                        messagesData.map((msg: any) => <MessageBubble key={msg._id} message={msg} currentUserId={user?._id} focusMessageInput={focusMessageInput} />)
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
                                {user?.role === "GUEST" || otherParticipant?.role === "ADMIN" ? null : (
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
                                                {showOfferModal && (
                                                    <div className="absolute bottom-full left-0 right-0 mb-2 bg-white border border-[#C9A94D] rounded-lg shadow-lg z-50 p-4 min-w-[300px]  overflow-y-auto">
                                                        <div className="flex justify-between items-center mb-3">
                                                            <h3 className="font-bold text-[#14213D]">Make an Offer</h3>
                                                            <button onClick={() => setShowOfferModal(false)} className="text-gray-500 hover:text-gray-700">
                                                                ✕
                                                            </button>
                                                        </div>

                                                        {/* Property Selection */}
                                                        <div className="mb-3">
                                                            <label className="block text-sm font-medium text-[#14213D] mb-1">Select Property</label>
                                                            {isLoading ? (
                                                                <div className="text-center py-1">
                                                                    <Loader2 className="h-4 w-4 animate-spin mx-auto" />
                                                                    <span className="text-xs text-gray-600">Loading properties...</span>
                                                                </div>
                                                            ) : publishedProperties?.data ? (
                                                                <div className="space-y-1 max-h-16 overflow-y-auto">
                                                                    {publishedProperties.data.map((property: any) => (
                                                                        <label key={property._id} className="flex items-center space-x-2 cursor-pointer text-xs">
                                                                            <input
                                                                                type="radio"
                                                                                name="property"
                                                                                value={property._id}
                                                                                checked={selectedProperty === property._id}
                                                                                onChange={(e) => {
                                                                                    setSelectedProperty(e.target.value);
                                                                                    setDate(undefined);
                                                                                    setCalculatedPrice(0);
                                                                                    setManualPrice("");
                                                                                }}
                                                                                className="accent-[#C9A94D] w-3 h-3"
                                                                            />
                                                                            <span className="text-xs">
                                                                                Property {property.propertyNumber} - £{property.price}/night
                                                                            </span>
                                                                        </label>
                                                                    ))}
                                                                </div>
                                                            ) : (
                                                                <p className="text-xs text-gray-600">No properties found</p>
                                                            )}
                                                        </div>

                                                        {/* Get selected property data */}
                                                        {(() => {
                                                            const selectedPropertyData = publishedProperties?.data?.find((p: any) => p._id === selectedProperty);
                                                            const propertyPrice = selectedPropertyData?.price || 0;

                                                            return (
                                                                selectedPropertyData && (
                                                                    <>
                                                                        {/* Date Range Picker */}
                                                                        <div className="space-y-2 mb-3">
                                                                            <div>
                                                                                <label className="block text-sm font-medium text-[#14213D] mb-1">Select Dates</label>
                                                                                <Popover>
                                                                                    <PopoverTrigger asChild>
                                                                                        <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal border-[#C9A94D] hover:bg-[#C9A94D]/10 text-xs h-8", !date && "text-muted-foreground")}>
                                                                                            <CalendarIcon className="mr-2 h-3 w-3" />
                                                                                            {date?.from ? (
                                                                                                date.to ? (
                                                                                                    <>
                                                                                                        {format(date.from, "LLL dd, y")} - {format(date.to, "LLL dd, y")}
                                                                                                    </>
                                                                                                ) : (
                                                                                                    format(date.from, "LLL dd, y")
                                                                                                )
                                                                                            ) : (
                                                                                                <span>Pick dates</span>
                                                                                            )}
                                                                                        </Button>
                                                                                    </PopoverTrigger>
                                                                                    <PopoverContent className="w-auto p-0" align="start">
                                                                                        <Calendar
                                                                                            initialFocus
                                                                                            mode="range"
                                                                                            defaultMonth={date?.from}
                                                                                            selected={date}
                                                                                            onSelect={(newDate) => {
                                                                                                setDate(newDate);
                                                                                                if (newDate?.from && newDate?.to) {
                                                                                                    // FIXED: Add +1 day to checkout for correct night calculation
                                                                                                    const checkoutDate = new Date(newDate.to);
                                                                                                    checkoutDate.setDate(checkoutDate.getDate() + 1);
                                                                                                    const nights = Math.ceil((checkoutDate.getTime() - newDate.from.getTime()) / (1000 * 60 * 60 * 24));
                                                                                                    setCalculatedPrice(nights * propertyPrice);
                                                                                                } else {
                                                                                                    setCalculatedPrice(0);
                                                                                                }
                                                                                            }}
                                                                                            numberOfMonths={2}
                                                                                        />
                                                                                    </PopoverContent>
                                                                                </Popover>
                                                                            </div>

                                                                            {/* Price Calculation Display */}
                                                                            {calculatedPrice > 0 && date?.from && date?.to && (
                                                                                <div className="bg-[#C9A94D]/10 border border-[#C9A94D] rounded-lg p-2">
                                                                                    <div className="flex justify-between items-center text-xs">
                                                                                        <span className="text-[#14213D] font-medium">Calculated Price:</span>
                                                                                        <span className="text-[#C9A94D] font-bold">£{calculatedPrice}</span>
                                                                                    </div>
                                                                                    <div className="text-xs text-gray-600 mt-1">
                                                                                        {(() => {
                                                                                            // FIXED: Add +1 day to checkout for correct night calculation
                                                                                            const checkoutDate = new Date(date.to);
                                                                                            checkoutDate.setDate(checkoutDate.getDate() + 1);
                                                                                            const nights = Math.ceil((checkoutDate.getTime() - date.from.getTime()) / (1000 * 60 * 60 * 24));
                                                                                            return `${nights} night${nights > 1 ? "s" : ""} × £${propertyPrice}/night`;
                                                                                        })()}
                                                                                    </div>
                                                                                    <div className="text-xs text-gray-600 mt-1">
                                                                                        Dates: {date.from.toLocaleDateString()} - {date.to.toLocaleDateString()}
                                                                                    </div>
                                                                                </div>
                                                                            )}
                                                                        </div>

                                                                        {/* Manual Price Input */}
                                                                        <div className="mb-3">
                                                                            <label className="block text-sm font-medium text-[#14213D] mb-1">Or Enter Manual Price</label>
                                                                            <div className="relative">
                                                                                <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 text-xs">£</span>
                                                                                <input type="number" value={manualPrice} onChange={(e) => setManualPrice(e.target.value)} placeholder="Custom amount" className="w-full pl-6 pr-2 py-1 border border-[#C9A94D] rounded text-xs" min="0" step="0.01" />
                                                                            </div>
                                                                        </div>

                                                                        {/* Final Offer Display */}
                                                                        {(calculatedPrice > 0 || manualPrice) && (
                                                                            <div className="bg-[#14213D] text-white rounded-lg p-2 mb-3">
                                                                                <div className="flex justify-between items-center text-xs">
                                                                                    <span className="font-medium">Final Offer:</span>
                                                                                    <span className="font-bold">£{manualPrice ? parseFloat(manualPrice).toLocaleString() : calculatedPrice}</span>
                                                                                </div>
                                                                                <div className="text-xs text-gray-300 mt-1">{manualPrice ? "Custom offer" : "Based on selected dates"}</div>
                                                                            </div>
                                                                        )}
                                                                    </>
                                                                )
                                                            );
                                                        })()}

                                                        {/* ✅ Agree to T&Cs */}
                                                        <div className="flex items-center gap-2 mb-3">
                                                            <input type="checkbox" id="agree" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="accent-[#C9A94D] w-3 h-3" />
                                                            <label htmlFor="agree" className="text-xs text-gray-700 cursor-pointer">
                                                                I agree to{" "}
                                                                <Link href="/terms-of-conditions" target="_blank" className="text-[#C9A94D] hover:underline">
                                                                    T&Cs
                                                                </Link>
                                                            </label>
                                                        </div>

                                                        {/* Action Buttons */}
                                                        <div className="flex gap-2">
                                                            <button onClick={handleSendOffer} disabled={!selectedProperty || !agreed || (calculatedPrice === 0 && !manualPrice)} className="flex-1 bg-[#14213D] text-white py-1 rounded text-xs disabled:opacity-50">
                                                                Send Offer
                                                            </button>
                                                            <button
                                                                onClick={() => {
                                                                    setShowOfferModal(false);
                                                                    setSelectedProperty(null);
                                                                    setAgreed(false);
                                                                    setDate(undefined);
                                                                    setCalculatedPrice(0);
                                                                    setManualPrice("");
                                                                }}
                                                                className="px-3 py-1 border border-gray-300 rounded text-xs text-[#14213D]"
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
                                        ref={messageInputRef}
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

const MessageBubble = ({ message, currentUserId, focusMessageInput }: { message: any; currentUserId?: string; focusMessageInput?: () => void }) => {
    const user = useAppSelector(currentUser);

    const isMe = message.sender?._id === currentUserId;
    const backendURL = process.env.NEXT_PUBLIC_BASE_API || "http://localhost:5000";

    const { refetch: refetchMessages } = useGetConversationMessagesQuery({ conversationId: message.conversationId!, page: 1, limit: 150 }, { skip: !message.conversationId });
    const { refetch: refetchConversations } = useGetUserConversationsQuery({});
    // const [sendMessage, { isLoading: isSending }] = useSendMessageMutation();
    const [showSuggestOfferModal, setShowSuggestOfferModal] = useState(false);
    const [showBankModal, setShowBankModal] = useState(false);
    const [bankModalUserId, setBankModalUserId] = useState<string | null>(null);

    const handleBankTransferClick = (userId: string) => {
        setBankModalUserId(userId);
        setShowBankModal(true);
    };

    const [rejectOffer, { isLoading: isRejecting }] = useRejectOfferMutation();

    const handleRejectOffer = async () => {
        try {
            await rejectOffer({
                messageId: message._id,
                conversationId: message.conversationId,
            }).unwrap();
        } catch (error) {
            console.log(error);
            console.error("Failed to reject offer:", error);
        }
    };

    // const handleSuggestNewOffer = async (offerData: any) => {
    //     if (!user || !message.conversationId) {
    //         console.error("User or conversation not available");
    //         return;
    //     }

    //     try {
    //         await sendMessage({
    //             conversationId: message.conversationId,
    //             sender: user._id,
    //             type: "offer",
    //             propertyId: offerData.propertyId,
    //             checkInDate: offerData.checkInDate,
    //             checkOutDate: offerData.checkOutDate,
    //             agreedFee: offerData.agreedFee.toString(),
    //             guestNo: offerData.guestNo,
    //         }).unwrap();

    //         setShowSuggestOfferModal(false);

    //         // Refetch messages
    //         setTimeout(() => {
    //             refetchMessages();
    //             refetchConversations();
    //         }, 100);
    //     } catch (error) {
    //         console.error("Failed to send new offer:", error);
    //     }
    // };

    const [convertRequestToOffer, { isLoading: isConverting }] = useConvertRequestToOfferMutation();

    const handleConvertToOffer = async () => {
        try {
            await convertRequestToOffer({
                messageId: message._id,
                conversationId: message.conversationId,
            }).unwrap();
        } catch (error) {
            console.log(error);
            console.error("Failed to convert request to offer:", error);
        }
    };

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editOffer, { isLoading: isEditing }] = useEditOfferMutation();

    const handleEditOffer = async (editData: any) => {
        try {
            await editOffer({
                messageId: message._id,
                conversationId: message.conversationId,
                ...editData,
            }).unwrap();
            setIsEditModalOpen(false);
        } catch (error) {
            console.log(error);
        }
    };

    const handleSuggestNewOffer = async (offerData: any) => {
        try {
            await editOffer({
                messageId: message._id,
                conversationId: message.conversationId,
                ...offerData,
            }).unwrap();
            setShowSuggestOfferModal(false);

            // Refetch messages
            setTimeout(() => {
                refetchMessages();
                refetchConversations();
            }, 100);
        } catch (error) {
            console.log(error);
            console.error("Failed to send new offer:", error);
        }
    };

    // Make offer to request
    const [convertMakeOfferToRequest, { isLoading: isConvertingToRequest }] = useConvertMakeOfferToRequestMutation();
    const [checkInDate, setCheckInDate] = useState("");
    const [checkOutDate, setCheckOutDate] = useState("");
    const [guestNo, setGuestNo] = useState("");
    const [agreedFee, setAgreedFee] = useState(0);

    // Calculate price whenever dates change
    useEffect(() => {
        if (checkInDate && checkOutDate) {
            calculatePrice();
        }
    }, [checkInDate, checkOutDate]);

    // Handlers at top level
    const handleDateChange = (field: "checkInDate" | "checkOutDate", value: string) => {
        if (field === "checkInDate") {
            setCheckInDate(value);
            if (checkOutDate && value > checkOutDate) {
                setCheckOutDate("");
            }
        } else {
            setCheckOutDate(value);
        }
    };

    const handleGuestChange = (value: string) => {
        setGuestNo(value);
    };

    // const getNumberOfNights = () => {
    //     if (!checkInDate || !checkOutDate) return 0;
    //     const checkIn = new Date(checkInDate);
    //     const checkOut = new Date(checkOutDate);
    //     const timeDiff = checkOut.getTime() - checkIn.getTime();
    //     return Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    // };

    const [tempDate, setTempDate] = useState<DateRange | undefined>();
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const propertyPrice = message.propertyId?.price || 100;

    const getNumberOfNights = () => {
        if (!checkInDate || !checkOutDate) return 0;
        const checkIn = new Date(checkInDate);
        const checkOut = new Date(checkOutDate);
        const timeDiff = checkOut.getTime() - checkIn.getTime();
        const nights = Math.ceil(timeDiff / (1000 * 60 * 60 * 24)) + 1;
        return nights;
    };

    const nights = getNumberOfNights();

    const calculatePrice = () => {
        if (!checkInDate || !checkOutDate) {
            console.log("❌ Missing dates:", { checkInDate, checkOutDate });
            return 0;
        }

        const checkIn = new Date(checkInDate);
        const checkOut = new Date(checkOutDate);

        if (isNaN(checkIn.getTime()) || isNaN(checkOut.getTime())) {
            console.log("❌ Invalid dates:", { checkIn, checkOut });
            return 0;
        }

        const timeDiff = checkOut.getTime() - checkIn.getTime();
        const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24)) + 1;

        const propertyPrice = message.propertyId?.price || 100;

        console.log("🔍 Price calculation:", {
            checkInDate,
            checkOutDate,
            daysDiff,
            propertyPrice,
            propertyData: message.propertyId,
        });

        const totalPrice = daysDiff * propertyPrice;

        console.log("💰 Total price calculated:", totalPrice);

        setAgreedFee(totalPrice);
        return totalPrice;
    };

    const handleDateSelect = (dates: DateRange | undefined) => {
        setTempDate(dates);
    };

    const handleConfirmDates = () => {
        if (tempDate?.from && tempDate?.to) {
            handleDateChange("checkInDate", format(tempDate.from, "yyyy-MM-dd"));
            handleDateChange("checkOutDate", format(tempDate.to, "yyyy-MM-dd"));
            setIsCalendarOpen(false);

            // CORRECT PRICE CALCULATION
            const checkIn = new Date(tempDate.from);
            const checkOut = new Date(tempDate.to);
            const timeDiff = checkOut.getTime() - checkIn.getTime();
            const nights = Math.ceil(timeDiff / (1000 * 60 * 60 * 24)) + 1;
            const totalPrice = nights * propertyPrice;
            setAgreedFee(totalPrice);
        }
    };

    const handleRequestAvailability = async () => {
        if (!checkInDate || !checkOutDate || !guestNo) {
            alert("Please fill all fields");
            return;
        }

        console.log("🚀 Sending request with agreedFee:", agreedFee); // Check this value

        try {
            await convertMakeOfferToRequest({
                messageId: message._id,
                conversationId: message.conversationId,
                checkInDate,
                checkOutDate,
                agreedFee: agreedFee,
                guestNo,
            }).unwrap();

            setCheckInDate("");
            setCheckOutDate("");
            setGuestNo("");
            setAgreedFee(0);

            setTimeout(() => {
                refetchMessages();
                refetchConversations();
            }, 100);
        } catch (error) {
            console.error("Failed to send availability request:", error);
        }
    };

    // console.log(message);

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

    // if (message.type === "makeoffer") {
    //     const isPropertyOwner = user?._id === message.propertyId?.createdBy?._id;

    //     // If property owner, show waiting message
    //     if (isPropertyOwner) {
    //         return (
    //             <div className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
    //                 {!isMe && <Avatar name={message.sender?.name || "Unknown User"} size={30} className="mr-2" />}
    //                 <div className="bg-[#D4BA71] p-3 border-2 border-black w-72">
    //                     <p className="font-semibold text-sm text-center">Availability Request</p>
    //                     <p className="text-[12px] text-[#16223D] mb-2 text-center">Property ID - {message?.propertyId?.propertyNumber}</p>
    //                     <p className="text-center text-[12px] mb-3">Waiting for guest to send availability request...</p>
    //                 </div>
    //                 {isMe && <Avatar name={message.sender?.name || "Unknown User"} size={30} className="ml-2" />}
    //             </div>
    //         );
    //     }

    //     // If guest, show the input form - USING YOUR ORIGINAL WORKING SYSTEM
    //     const nights = getNumberOfNights();
    //     const propertyPrice = message.propertyId?.price || 100;

    //     return (
    //         <div className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
    //             {!isMe && <Avatar name={user?.name || "Unknown User"} size={30} className="mr-2" />}
    //             <div className="bg-[#D4BA71] p-3 border-2 border-black w-72">
    //                 <p className="font-semibold text-sm text-center">Request Availability</p>
    //                 <p className="text-[12px] text-[#16223D] mb-2 text-center">Property ID - {message?.propertyId?.propertyNumber}</p>

    //                 <p className="text-center text-[12px] mb-2">Requested Dates</p>

    //                 {/* KEEP YOUR ORIGINAL DATE INPUTS THAT WORK */}
    //                 <div className="grid grid-cols-2 gap-2 mb-3">
    //                     <div>
    //                         <label className="block text-[10px] font-medium mb-1">Check In</label>
    //                         <input type="date" value={checkInDate} onChange={(e) => handleDateChange("checkInDate", e.target.value)} className="w-full p-1 border border-black text-[10px]" min={new Date().toISOString().split("T")[0]} />
    //                     </div>
    //                     <div>
    //                         <label className="block text-[10px] font-medium mb-1">Check Out</label>
    //                         <input type="date" value={checkOutDate} onChange={(e) => handleDateChange("checkOutDate", e.target.value)} className="w-full p-1 border border-black text-[10px]" min={checkInDate || new Date().toISOString().split("T")[0]} />
    //                     </div>
    //                 </div>

    //                 <div className="mb-3">
    //                     <label className="block text-[10px] font-medium mb-1">Guests</label>
    //                     <input type="number" min="1" value={guestNo} onChange={(e) => handleGuestChange(e.target.value)} className="w-full p-1 border border-black text-[10px]" placeholder="Number of guests" />
    //                 </div>

    //                 {/* Price Display */}
    //                 {nights > 0 && agreedFee > 0 && (
    //                     <div className="bg-yellow-50 p-2 border border-yellow-200 rounded mb-3">
    //                         <div className="flex justify-between text-[10px]">
    //                             <span>Estimated Price:</span>
    //                             <span className="font-bold">£{agreedFee}</span>
    //                         </div>
    //                         <div className="flex justify-between text-[9px] text-gray-600">
    //                             <span>
    //                                 {nights} night{nights !== 1 ? "s" : ""} × £{propertyPrice}
    //                             </span>
    //                         </div>
    //                     </div>
    //                 )}

    //                 <div className="flex justify-center mt-3">
    //                     <button onClick={handleRequestAvailability} disabled={isConvertingToRequest || !checkInDate || !checkOutDate || !guestNo} className="border border-black bg-[#16223D] text-white px-4 py-1 text-[10px] hover:bg-[#1a2a4a] transition-colors w-full cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
    //                         {isConvertingToRequest ? "Sending..." : "Request Availability"}
    //                     </button>
    //                 </div>
    //             </div>
    //             {isMe && <Avatar name={user?.name || "Unknown User"} size={30} className="ml-2" />}
    //         </div>
    //     );
    // }
    if (message.type === "makeoffer") {
        const isPropertyOwner = user?._id === message.propertyId?.createdBy?._id;

        // If property owner, show waiting message
        if (isPropertyOwner) {
            return (
                <div className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                    {!isMe && <Avatar name={message.sender?.name || "Unknown User"} size={30} className="mr-2" />}
                    <div className="bg-[#D4BA71] p-3 border-2 border-black w-72">
                        <p className="font-semibold text-sm text-center">Availability Request</p>
                        <p className="text-[12px] text-[#16223D] mb-2 text-center">Property ID - {message?.propertyId?.propertyNumber}</p>
                        <p className="text-center text-[12px] mb-3">Waiting for guest to send availability request...</p>
                    </div>
                    {isMe && <Avatar name={message.sender?.name || "Unknown User"} size={30} className="ml-2" />}
                </div>
            );
        }

        // If guest, show the input form with shadcn calendar
        const propertyPrice = message.propertyId?.price || 100;

        // State for calendar

        return (
            <div className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                {!isMe && <Avatar name={user?.name || "Unknown User"} size={30} className="mr-2" />}
                <div className="bg-[#D4BA71] p-3 border-2 border-black w-80">
                    <p className="font-semibold text-sm text-center">Request Availability</p>
                    <p className="text-[12px] text-[#16223D] mb-2 text-center">Property ID - {message?.propertyId?.propertyNumber}</p>

                    {/* Date Picker with Confirm Button */}
                    <div className="mb-3">
                        <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                            <PopoverTrigger asChild>
                                <button className="w-full p-2 border border-black bg-white text-left text-[12px] flex items-center justify-between">
                                    <span>{checkInDate && checkOutDate ? `${format(new Date(checkInDate), "MMM dd")} - ${format(new Date(checkOutDate), "MMM dd")}` : "Select dates"}</span>
                                    <CalendarIcon className="h-4 w-4" />
                                </button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <div className="flex flex-col">
                                    <Calendar mode="range" selected={tempDate} onSelect={handleDateSelect} numberOfMonths={1} className="rounded-md border" />
                                    <div className="flex justify-end gap-2 p-3 border-t">
                                        <Button variant="outline" size="sm" onClick={() => setIsCalendarOpen(false)}>
                                            Cancel
                                        </Button>
                                        <Button size="sm" onClick={handleConfirmDates} disabled={!tempDate?.from || !tempDate?.to}>
                                            Confirm
                                        </Button>
                                    </div>
                                </div>
                            </PopoverContent>
                        </Popover>

                        {/* Show selected dates summary */}
                        {checkInDate && checkOutDate && (
                            <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded">
                                <div className="flex justify-between text-[10px]">
                                    <span>
                                        {nights} nights × £{propertyPrice}
                                    </span>
                                    <span className="font-bold">£{agreedFee}</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Guest Input */}
                    <div className="mb-3">
                        <label className="block text-[10px] font-medium mb-1">Guests</label>
                        <input type="number" min="1" value={guestNo} onChange={(e) => handleGuestChange(e.target.value)} className="w-full p-2 border border-black text-[12px]" placeholder="Number of guests" />
                    </div>

                    <div className="flex justify-center mt-3">
                        <button onClick={handleRequestAvailability} disabled={isConvertingToRequest || !checkInDate || !checkOutDate || !guestNo} className="border border-black bg-[#16223D] text-white px-4 py-1 text-[10px] hover:bg-[#1a2a4a] transition-colors w-full cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
                            {isConvertingToRequest ? "Sending..." : "Request Availability"}
                        </button>
                    </div>
                </div>
                {isMe && <Avatar name={user?.name || "Unknown User"} size={30} className="ml-2" />}
            </div>
        );
    }

    if (message.type === "offer") {
        const formatDate = (dateString: string) => {
            if (!dateString) return "Not set";
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return "Invalid date";
            const day = String(date.getDate()).padStart(2, "0");
            const month = String(date.getMonth() + 1).padStart(2, "0");
            const year = date.getFullYear();
            return `${day}/${month}/${year}`;
        };

        // const calculateTotal = () => {
        //     const agreedFee = parseFloat(message.agreedFee) || 0;
        //     const bookingFee = parseFloat(message.bookingFee) || 0;
        //     return (agreedFee + bookingFee).toFixed(2);
        // };

        // const totalAmount = message.total || calculateTotal();

        const calculateDays = () => {
            if (!message.checkInDate || !message.checkOutDate) return "0 Night";

            const checkIn = new Date(message.checkInDate);
            const checkOut = new Date(message.checkOutDate);

            if (isNaN(checkIn.getTime()) || isNaN(checkOut.getTime())) return "0 Nights";

            // FIXED: Add +1 day to checkout date for correct night calculation
            const adjustedCheckOut = new Date(checkOut);
            adjustedCheckOut.setDate(adjustedCheckOut.getDate() + 1);

            const timeDiff = adjustedCheckOut.getTime() - checkIn.getTime();
            const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

            return `( ${daysDiff} Night${daysDiff !== 1 ? "s" : ""} )`;
        };

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
                <div className="bg-[#D4BA71] p-3 border-2 border-black w-72">
                    <p className="font-semibold text-sm text-center">Nest Offer</p>
                    <p className="text-[12px] text-[#16223D] mb-2 text-center">Property ID - {message?.propertyId?.propertyNumber}</p>
                    <p className="text-center font-bold mb-1 text-[14px]">Host Agreed Fee - £{message?.agreedFee}</p>

                    {!message?.bookingFeePaid && (
                        <p className="text-center font-bold mb-2 text-[14px]">
                            Booking Fee - £{message?.bookingFee} (£{((message?.bookingFee / message?.agreedFee) * 100).toFixed(0)}%)
                        </p>
                    )}

                    <div className="flex justify-between">
                        <p className="text-center text-[12px]">Requested Dates:</p>

                        <div>
                            <p className="text-right text-[12px] ">
                                {formatDate(message.checkInDate)} to {formatDate(message.checkOutDate)}
                            </p>

                            <p className="text-right text-[12px] mb-2">{calculateDays()}</p>
                        </div>
                    </div>

                    {message.guestNo && (
                        <div className="flex justify-between">
                            <p className=" text-[12px] ">Guests:</p>
                            <p className="text-[10px]  mb-2">{message.guestNo}</p>
                        </div>
                    )}

                    {/* {!message?.bookingFeePaid ? <p className="text-center font-bold mb-2 text-[14px]">To Pay - £{message?.bookingFee}</p> : <p className="text-center font-bold mb-2 text-[14px]">To Pay - £{message?.agreedFee}</p>} */}
                    {user?._id === message.propertyId?.createdBy?._id ? (
                        !message?.bookingFeePaid ? (
                            <p className="text-center font-bold mb-2 text-[14px]">Guest To Pay - £{message?.bookingFee}</p>
                        ) : (
                            <p className="text-center font-bold mb-2 text-[14px]">Guest To Pay - £{message?.agreedFee}</p>
                        )
                    ) : !message?.bookingFeePaid ? (
                        <p className="text-center font-bold mb-2 text-[14px]">To Pay - £{message?.bookingFee}</p>
                    ) : (
                        <p className="text-center font-bold mb-2 text-[14px]">To Pay - £{message?.agreedFee}</p>
                    )}

                    {user?._id === message.propertyId?.createdBy?._id ? (
                        !message?.bookingFeePaid ? (
                            <div className="flex justify-center mt-3 w-full">
                                <button onClick={handleRejectOffer} disabled={isRejecting} className="border border-black bg-[#16223D] text-white px-4 py-1 text-[8px] hover:bg-[#1a2a4a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-full max-w-[120px] cursor-pointer">
                                    {isRejecting ? "Rejecting..." : "Withdraw Offer"}
                                </button>
                            </div>
                        ) : (
                            // If bookingFeePaid true - No reject button
                            <div></div>
                        )
                    ) : // Other User View
                    !message?.bookingFeePaid ? (
                        // If bookingFeePaid false - Pay By Card | Withdraw Offer
                        <div className="grid grid-cols-2 gap-4 mt-3 w-full items-stretch">
                            <Link href={`/listings/${message._id}/pay`} className="w-full flex">
                                <button className="border border-black bg-[#16223D] text-white px-4 py-1 text-[8px] hover:bg-[#1a2a4a] transition-colors w-full flex-1 cursor-pointer">Pay By Card</button>
                            </Link>
                            <button onClick={handleRejectOffer} disabled={isRejecting} className="border border-black bg-[#16223D] text-white px-4 py-1 text-[8px] hover:bg-[#1a2a4a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-full cursor-pointer">
                                {isRejecting ? "Withdrawing..." : "Withdraw Offer"}
                            </button>
                        </div>
                    ) : (
                        // If bookingFeePaid true - Pay By Card | Pay By Bank Transfer | Withdraw Offer
                        <div className="grid grid-cols-2 gap-2 mt-3 w-full items-stretch">
                            <Link href={`/listings/${message._id}/pay`} className="w-full flex">
                                <button className="border border-black bg-[#16223D] text-white px-4 py-1 text-[8px] hover:bg-[#1a2a4a] transition-colors w-full cursor-pointer">Pay By Card</button>
                            </Link>
                            <button onClick={() => handleBankTransferClick(message.propertyId?.createdBy?._id)} className="border border-black bg-[#16223D] text-white px-4 py-1 text-[8px] hover:bg-[#1a2a4a] transition-colors w-full cursor-pointer">
                                Pay By Bank Transfer
                            </button>
                            <div></div> {/* Empty space */}
                            <button onClick={handleRejectOffer} disabled={isRejecting} className="border border-black bg-[#16223D] text-white px-4 py-1 text-[8px] hover:bg-[#1a2a4a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-full cursor-pointer">
                                {isRejecting ? "Withdrawing..." : "Withdraw Offer"}
                            </button>
                        </div>
                    )}
                    {user?._id === message.propertyId?.createdBy?._id ? null : !message?.bookingFeePaid ? ( // Property Owner - Show nothing // Guest
                        <p className="text-center mt-1 text-[9px]">Good news! The host has accepted your offer. To secure your booking, please complete the (£{((message?.bookingFee / message?.agreedFee) * 100).toFixed(0)}%) booking fee.</p>
                    ) : (
                        <p className="text-center mt-1 text-[9px]">One last step — pay the host and your nest for your next stay is all yours!</p>
                    )}
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
                <BankTransferModal isOpen={showBankModal} onClose={() => setShowBankModal(false)} userId={bankModalUserId ?? ""} />
            </div>
        );
    }

    if (message.type === "request") {
        const formatDate = (dateString: string) => {
            if (!dateString) return "Not set";

            const date = new Date(dateString);
            if (isNaN(date.getTime())) return "Invalid date";

            const day = String(date.getDate()).padStart(2, "0");
            const month = String(date.getMonth() + 1).padStart(2, "0"); // months are 0-indexed
            const year = date.getFullYear();

            return `${day}/${month}/${year}`;
        };

        const calculateDays = () => {
            if (!message.checkInDate || !message.checkOutDate) return "0 Night";

            const checkIn = new Date(message.checkInDate);
            const checkOut = new Date(message.checkOutDate);

            if (isNaN(checkIn.getTime()) || isNaN(checkOut.getTime())) return "0 Nights";

            const timeDiff = checkOut.getTime() - checkIn.getTime();
            const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24)) + 1;

            return `( ${daysDiff} Night${daysDiff !== 1 ? "s" : ""} )`;
        };

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
                <div className="bg-[#D4BA71] p-3 border-2 border-black w-72">
                    <p className="font-semibold text-sm text-center">Booking Offer</p>
                    <p className="text-[12px] text-[#16223D] mb-2 text-center">Property ID - {message?.propertyId?.propertyNumber}</p>
                    <p className="text-center font-bold mb-2">£{message?.agreedFee}</p>
                    <p className="text-center text-[12px]">Requested Dates:</p>

                    <p className="text-center text-[12px] ">
                        {formatDate(message.checkInDate)} to {formatDate(message.checkOutDate)}
                    </p>

                    <p className="text-center text-[12px] mb-2">{calculateDays()}</p>

                    {message.guestNo && (
                        <div>
                            <p className="text-center text-[12px] ">Guests:</p>
                            <p className="text-[10px] text-center mb-2">{message.guestNo}</p>
                        </div>
                    )}

                    {user?._id === message.propertyId?.createdBy?._id ? (
                        // Property Owner View - Show grid of buttons
                        <div className="grid grid-cols-2 gap-2 mt-3 w-full">
                            <button onClick={handleConvertToOffer} disabled={isConverting} className="border border-black bg-[#16223D] text-white px-4 py-1 text-[9px] hover:bg-[#1a2a4a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-full cursor-pointer">
                                {isConverting ? "Accepting..." : "Accept Offer"}
                            </button>
                            <button onClick={handleRejectOffer} disabled={isRejecting} className="border border-black bg-[#16223D] text-white px-4 py-1 text-[9px] hover:bg-[#1a2a4a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-full cursor-pointer">
                                {isRejecting ? "Rejecting..." : "Reject Offer"}
                            </button>
                            <button onClick={() => setShowSuggestOfferModal(true)} className="border border-black bg-[#16223D] text-white px-4 py-1 text-[9px] hover:bg-[#1a2a4a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-full cursor-pointer">
                                Suggest New Offer
                            </button>
                            <button
                                onClick={() => {
                                    if (focusMessageInput) {
                                        focusMessageInput();
                                    }
                                }}
                                className="border border-black bg-[#16223D] text-white px-4 py-1 text-[9px] hover:bg-[#1a2a4a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-full cursor-pointer"
                            >
                                Message Guest
                            </button>
                        </div>
                    ) : (
                        // Other User View - Show only Make Offer and Withdraw Offer
                        <div className="grid grid-cols-2 gap-4 mt-3 w-full">
                            <button onClick={() => setIsEditModalOpen(true)} className="border border-black bg-[#16223D] text-white px-4 py-1 text-[9px] hover:bg-[#1a2a4a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-full">
                                Edit/Change Offer
                            </button>
                            <button onClick={handleRejectOffer} disabled={isRejecting} className="border border-black bg-[#16223D] text-white px-4 py-1 text-[9px] hover:bg-[#1a2a4a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-full cursor-pointer">
                                {isRejecting ? "Withdrawing..." : "Withdraw Offer"}
                            </button>
                        </div>
                    )}
                    {user?._id === message.propertyId?.createdBy?._id ? <p className="text-center mt-1 text-[9px]">You've received a new offer. Please response within 48 hours - after that, the offer will automatically expire.</p> : <p className="text-center mt-1 text-[9px]">Thank you! Your offer has been sent to the host for review</p>}
                    <EditOfferModal message={message} isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} onSave={handleEditOffer} isEditing={isEditing} />
                </div>

                <SuggestNewOfferModal message={message} isOpen={showSuggestOfferModal} onClose={() => setShowSuggestOfferModal(false)} onSend={handleSuggestNewOffer} isSending={isEditing} />

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
                <div className="bg-[#D4BA71] p-3 border-2 border-black w-72">
                    <p className="font-semibold text-sm text-center">Offer Accepted</p>
                    <p className="text-[12px] text-[#16223D] mb-4 text-center">Property ID - {message?.propertyId?.propertyNumber}</p>

                    <div className="flex flex-col gap-3">
                        <div className="text-[12px] flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <Image alt="Property Name" src="/messages/accepted/home-roof.png" height={16} width={16} />
                                <span>Property:</span>
                            </div>
                            <span className="font-semibold">{message?.propertyId?.title}</span>
                        </div>

                        <div className="text-[12px] flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <Image alt="Address" src="/messages/accepted/location-pin.png" height={16} width={16} />
                                <span>Address:</span>
                            </div>
                            <span className="font-semibold text-right">{message?.propertyId?.location}</span>
                        </div>

                        <div className="text-[12px] flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <Image alt="Property Manager" src="/messages/accepted/user-alt.png" height={16} width={16} />
                                <span>Manager:</span>
                            </div>
                            <span className="font-semibold">{message.propertyId?.createdBy?.name}</span>
                        </div>

                        <div className="text-[12px] flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <Image alt="Phone" src="/messages/accepted/phone.png" height={16} width={16} />
                                <span>Phone:</span>
                            </div>
                            <span className="font-semibold">{message.propertyId?.createdBy?.phone}</span>
                        </div>
                    </div>

                    <div className="flex justify-center mt-3">
                        <div className="border border-black bg-[#16223D] text-white px-6 py-1 text-[10px]">Booking Confirmed</div>
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
                <div className="bg-red-200 p-3 rounded-lg w-72 text-center font-semibold text-red-900">Offer Rejected</div>
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

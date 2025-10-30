"use client";
import { useGetAllConversationMessagesQuery } from "@/redux/features/messages/messageApi";
import { useParams } from "next/navigation";
import React from "react";
import { Loader2, MessageSquare, User, Calendar, Home, Phone, Mail } from "lucide-react";
import Image from "next/image";

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

const MessageBubble = ({ message, currentUserId }: { message: any; currentUserId?: string }) => {
    const isMe = message.sender?._id === currentUserId;
    const backendURL = process.env.NEXT_PUBLIC_BASE_API || "http://localhost:5000";

    const formatDate = (dateString: string) => {
        if (!dateString) return "Not set";
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return "Invalid date";
        return date.toLocaleDateString("en-GB");
    };

    if (message.type === "offer") {
        const calculateTotal = () => {
            const agreedFee = parseFloat(message.agreedFee) || 0;
            const bookingFee = parseFloat(message.bookingFee) || 0;
            return (agreedFee + bookingFee).toFixed(2);
        };

        const totalAmount = message.total || calculateTotal();

        return (
            <div className={`flex ${isMe ? "justify-end" : "justify-start"} mb-4`}>
                {!isMe &&
                    (message.sender?.profileImg ? (
                        <Image
                            src={`${backendURL}${message.sender.profileImg}`}
                            alt={message.sender?.name}
                            width={40}
                            height={40}
                            className="rounded-full mr-3 h-[40px] w-[40px] object-cover"
                            onError={(e) => {
                                e.currentTarget.style.display = "none";
                            }}
                        />
                    ) : (
                        <Avatar name={message.sender?.name || "Unknown User"} size={40} className="mr-3" />
                    ))}
                <div className="bg-[#D4BA71] p-4 rounded-lg max-w-md border border-[#C9A94D]">
                    <div className="flex items-center gap-2 mb-3">
                        <div className="w-6 h-6 bg-[#14213D] rounded-full flex items-center justify-center">
                            <Home className="w-3 h-3 text-white" />
                        </div>
                        <p className="font-bold text-[#14213D] text-sm">Nest Offer</p>
                    </div>

                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-700">Property:</span>
                            <span className="font-semibold">{message.propertyId?.propertyNumber || "N/A"}</span>
                        </div>

                        <div className="flex justify-between">
                            <span className="text-gray-700">Dates:</span>
                            <div className="text-right">
                                <div>{formatDate(message.checkInDate)}</div>
                                <div>{formatDate(message.checkOutDate)}</div>
                            </div>
                        </div>

                        {message.guestNo && (
                            <div className="flex justify-between">
                                <span className="text-gray-700">Guests:</span>
                                <span className="font-semibold">{message.guestNo}</span>
                            </div>
                        )}

                        <div className="flex justify-between">
                            <span className="text-gray-700">Agreed Fee:</span>
                            <span className="font-semibold">£{parseFloat(message.agreedFee || "0").toFixed(2)}</span>
                        </div>

                        <div className="flex justify-between">
                            <span className="text-gray-700">Booking Fee:</span>
                            <span className="font-semibold">£{parseFloat(message.bookingFee || "0").toFixed(2)}</span>
                        </div>

                        <div className="border-t border-[#C9A94D] pt-2 mt-2">
                            <div className="flex justify-between font-bold">
                                <span>Total:</span>
                                <span>£{totalAmount}</span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-[#C9A94D] border-dashed">
                        <div className="flex justify-between items-center text-xs text-gray-600">
                            <span>Sent by: {message.sender?.name}</span>
                            <span>{new Date(message.createdAt).toLocaleString()}</span>
                        </div>
                    </div>
                </div>
                {isMe &&
                    (message.sender?.profileImg ? (
                        <Image
                            src={`${backendURL}${message.sender.profileImg}`}
                            alt="Me"
                            width={40}
                            height={40}
                            className="rounded-full ml-3 h-[40px] w-[40px] object-cover"
                            onError={(e) => {
                                e.currentTarget.style.display = "none";
                            }}
                        />
                    ) : (
                        <Avatar name={message.sender?.name || "Unknown User"} size={40} className="ml-3" />
                    ))}
            </div>
        );
    }

    if (message.type === "request") {
        return (
            <div className={`flex ${isMe ? "justify-end" : "justify-start"} mb-4`}>
                {!isMe &&
                    (message.sender?.profileImg ? (
                        <Image
                            src={`${backendURL}${message.sender.profileImg}`}
                            alt={message.sender?.name}
                            width={40}
                            height={40}
                            className="rounded-full mr-3 h-[40px] w-[40px] object-cover"
                            onError={(e) => {
                                e.currentTarget.style.display = "none";
                            }}
                        />
                    ) : (
                        <Avatar name={message.sender?.name || "Unknown User"} size={40} className="mr-3" />
                    ))}
                <div className="bg-blue-100 p-4 rounded-lg max-w-md border border-blue-300">
                    <div className="flex items-center gap-2 mb-3">
                        <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                            <Calendar className="w-3 h-3 text-white" />
                        </div>
                        <p className="font-bold text-blue-800 text-sm">Booking Request</p>
                    </div>

                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-700">Property:</span>
                            <span className="font-semibold">{message.propertyId?.propertyNumber || "N/A"}</span>
                        </div>

                        <div className="flex justify-between">
                            <span className="text-gray-700">Requested Dates:</span>
                            <div className="text-right">
                                <div>{formatDate(message.checkInDate)}</div>
                                <div>{formatDate(message.checkOutDate)}</div>
                            </div>
                        </div>

                        {message.guestNo && (
                            <div className="flex justify-between">
                                <span className="text-gray-700">Guests:</span>
                                <span className="font-semibold">{message.guestNo}</span>
                            </div>
                        )}
                    </div>

                    <div className="mt-3 pt-3 border-t border-blue-300 border-dashed">
                        <div className="flex justify-between items-center text-xs text-gray-600">
                            <span>Requested by: {message.sender?.name}</span>
                            <span>{new Date(message.createdAt).toLocaleString()}</span>
                        </div>
                    </div>
                </div>
                {isMe &&
                    (message.sender?.profileImg ? (
                        <Image
                            src={`${backendURL}${message.sender.profileImg}`}
                            alt="Me"
                            width={40}
                            height={40}
                            className="rounded-full ml-3 h-[40px] w-[40px] object-cover"
                            onError={(e) => {
                                e.currentTarget.style.display = "none";
                            }}
                        />
                    ) : (
                        <Avatar name={message.sender?.name || "Unknown User"} size={40} className="ml-3" />
                    ))}
            </div>
        );
    }

    if (message.type === "accepted") {
        return (
            <div className={`flex ${isMe ? "justify-end" : "justify-start"} mb-4`}>
                {!isMe &&
                    (message.sender?.profileImg ? (
                        <Image
                            src={`${backendURL}${message.sender.profileImg}`}
                            alt={message.sender?.name}
                            width={40}
                            height={40}
                            className="rounded-full mr-3 h-[40px] w-[40px] object-cover"
                            onError={(e) => {
                                e.currentTarget.style.display = "none";
                            }}
                        />
                    ) : (
                        <Avatar name={message.sender?.name || "Unknown User"} size={40} className="mr-3" />
                    ))}
                <div className="bg-green-100 p-4 rounded-lg max-w-md border border-green-300">
                    <div className="flex items-center gap-2 mb-3">
                        <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center">
                            <Calendar className="w-3 h-3 text-white" />
                        </div>
                        <p className="font-bold text-green-800 text-sm">Offer Accepted</p>
                    </div>

                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-700">Property:</span>
                            <span className="font-semibold">{message.propertyId?.title || "N/A"}</span>
                        </div>

                        <div className="flex justify-between">
                            <span className="text-gray-700">Location:</span>
                            <span className="font-semibold">{message.propertyId?.location || "N/A"}</span>
                        </div>

                        <div className="flex justify-between">
                            <span className="text-gray-700">Manager:</span>
                            <span className="font-semibold">{message.propertyId?.createdBy?.name || "N/A"}</span>
                        </div>

                        {message.propertyId?.createdBy?.phone && (
                            <div className="flex justify-between">
                                <span className="text-gray-700">Phone:</span>
                                <span className="font-semibold">{message.propertyId?.createdBy?.phone}</span>
                            </div>
                        )}
                    </div>

                    <div className="mt-3 pt-3 border-t border-green-300 border-dashed">
                        <div className="flex justify-between items-center text-xs text-gray-600">
                            <span>Accepted by: {message.sender?.name}</span>
                            <span>{new Date(message.createdAt).toLocaleString()}</span>
                        </div>
                    </div>
                </div>
                {isMe &&
                    (message.sender?.profileImg ? (
                        <Image
                            src={`${backendURL}${message.sender.profileImg}`}
                            alt="Me"
                            width={40}
                            height={40}
                            className="rounded-full ml-3 h-[40px] w-[40px] object-cover"
                            onError={(e) => {
                                e.currentTarget.style.display = "none";
                            }}
                        />
                    ) : (
                        <Avatar name={message.sender?.name || "Unknown User"} size={40} className="ml-3" />
                    ))}
            </div>
        );
    }

    if (message.type === "rejected") {
        return (
            <div className={`flex ${isMe ? "justify-end" : "justify-start"} mb-4`}>
                {!isMe &&
                    (message.sender?.profileImg ? (
                        <Image
                            src={`${backendURL}${message.sender.profileImg}`}
                            alt={message.sender?.name}
                            width={40}
                            height={40}
                            className="rounded-full mr-3 h-[40px] w-[40px] object-cover"
                            onError={(e) => {
                                e.currentTarget.style.display = "none";
                            }}
                        />
                    ) : (
                        <Avatar name={message.sender?.name || "Unknown User"} size={40} className="mr-3" />
                    ))}
                <div className="bg-red-100 p-4 rounded-lg max-w-md border border-red-300">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center">
                            <Calendar className="w-3 h-3 text-white" />
                        </div>
                        <p className="font-bold text-red-800 text-sm">Offer Rejected</p>
                    </div>
                    <div className="text-xs text-gray-600 mt-2">
                        <div>Rejected by: {message.sender?.name}</div>
                        <div>{new Date(message.createdAt).toLocaleString()}</div>
                    </div>
                </div>
                {isMe &&
                    (message.sender?.profileImg ? (
                        <Image
                            src={`${backendURL}${message.sender.profileImg}`}
                            alt="Me"
                            width={40}
                            height={40}
                            className="rounded-full ml-3 h-[40px] w-[40px] object-cover"
                            onError={(e) => {
                                e.currentTarget.style.display = "none";
                            }}
                        />
                    ) : (
                        <Avatar name={message.sender?.name || "Unknown User"} size={40} className="ml-3" />
                    ))}
            </div>
        );
    }

    // Normal text message
    return (
        <div className={`flex items-end ${isMe ? "justify-end" : "justify-start"} mb-4`}>
            {!isMe &&
                (message.sender?.profileImg ? (
                    <Image
                        src={`${backendURL}${message.sender.profileImg}`}
                        alt={message.sender?.name}
                        width={40}
                        height={40}
                        className="rounded-full mr-3 h-[40px] w-[40px] object-cover"
                        onError={(e) => {
                            e.currentTarget.style.display = "none";
                        }}
                    />
                ) : (
                    <Avatar name={message.sender?.name || "Unknown User"} size={40} className="mr-3" />
                ))}
            <div className={`px-4 py-3 rounded-lg max-w-md break-words ${isMe ? "bg-[#14213D] text-white" : "bg-[#D4BA71] text-[#080E1A]"}`}>
                <p className="text-sm">{message.text}</p>
                <div className="flex justify-between items-center mt-2 text-xs opacity-70">
                    <span>{message.sender?.name}</span>
                    <span>{new Date(message.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                </div>
            </div>
            {isMe &&
                (message.sender?.profileImg ? (
                    <Image
                        src={`${backendURL}${message.sender.profileImg}`}
                        alt="Me"
                        width={40}
                        height={40}
                        className="rounded-full ml-3 h-[40px] w-[40px] object-cover"
                        onError={(e) => {
                            e.currentTarget.style.display = "none";
                        }}
                    />
                ) : (
                    <Avatar name={message.sender?.name || "Unknown User"} size={40} className="ml-3" />
                ))}
        </div>
    );
};

const Page = () => {
    const { id } = useParams();
    const { data, error, isLoading } = useGetAllConversationMessagesQuery({
        conversationId: id as string,
    });

    const conversationData = data?.data;
    const messages = conversationData?.messages || [];
    const conversation = conversationData?.conversation;
    const participants = conversation?.participants || [];

    const backendURL = process.env.NEXT_PUBLIC_BASE_API || "http://localhost:5000";

    if (isLoading) {
        return (
            <div className="min-h-screen  flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="h-12 w-12 animate-spin text-[#C9A94D] mx-auto mb-4" />
                    <p className="text-[#14213D] text-lg">Loading conversation...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-[#B6BAC3] flex items-center justify-center">
                <div className="text-center">
                    <MessageSquare className="h-16 w-16 text-red-500 mx-auto mb-4" />
                    <p className="text-red-600 text-lg">Failed to load conversation</p>
                    <p className="text-gray-600 mt-2">Conversation ID: {id}</p>
                </div>
            </div>
        );
    }

    if (!conversationData) {
        return (
            <div className="min-h-screen bg-[#B6BAC3] flex items-center justify-center">
                <div className="text-center">
                    <MessageSquare className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 text-lg">No conversation data found</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen ">
            {/* Header */}
            <div className="bg-[#9399A6] border-b border-[#C9A94D] p-6">
                <div className="max-w-6xl mx-auto">
                    <h1 className="text-2xl font-bold text-[#14213D] mb-2">Admin - Conversation View</h1>
                    <p className="text-[#14213D]">Conversation ID: {id}</p>
                </div>
            </div>

            <div className="max-w-6xl mx-auto p-6">
                {/* Participants Info */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6 border border-[#C9A94D]">
                    <h2 className="text-xl font-bold text-[#14213D] mb-4 flex items-center gap-2">
                        <User className="w-5 h-5" />
                        Participants
                    </h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        {participants.map((participant: any) => (
                            <div key={participant._id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border">
                                {participant.profileImg ? (
                                    <Image
                                        src={`${backendURL}${participant.profileImg}`}
                                        alt={participant.name}
                                        width={60}
                                        height={60}
                                        className="rounded-full h-14 w-14 object-cover border-2 border-[#C9A94D]"
                                        onError={(e) => {
                                            e.currentTarget.style.display = "none";
                                        }}
                                    />
                                ) : (
                                    <Avatar name={participant.name} size={60} />
                                )}
                                <div className="flex-1">
                                    <h3 className="font-semibold text-[#14213D] text-lg">{participant.name}</h3>
                                    <div className="text-sm text-gray-600 space-y-1 mt-1">
                                        <div className="flex items-center gap-2">
                                            <Mail className="w-4 h-4" />
                                            <span>{participant.email}</span>
                                        </div>
                                        {participant.phone && (
                                            <div className="flex items-center gap-2">
                                                <Phone className="w-4 h-4" />
                                                <span>{participant.phone}</span>
                                            </div>
                                        )}
                                        <div className="flex items-center gap-2">
                                            <User className="w-4 h-4" />
                                            <span className="capitalize">{participant.role}</span>
                                            {participant.isVerifiedByAdmin && <span className="bg-green-500 text-white text-xs px-2 py-1 rounded">Verified</span>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Messages Section */}
                <div className="bg-white rounded-lg shadow-md p-6 border border-[#C9A94D]">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-[#14213D] flex items-center gap-2">
                            <MessageSquare className="w-5 h-5" />
                            Messages ({messages.length})
                        </h2>
                        <div className="text-sm text-gray-600">Last updated: {conversation?.updatedAt ? new Date(conversation.updatedAt).toLocaleString() : "N/A"}</div>
                    </div>

                    {messages.length === 0 ? (
                        <div className="text-center py-12">
                            <MessageSquare className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-600 text-lg">No messages in this conversation</p>
                        </div>
                    ) : (
                        <div className="space-y-4 max-h-[600px] overflow-y-auto p-4 border border-gray-200 rounded-lg">
                            {messages.map((message: any) => (
                                <MessageBubble key={message._id} message={message} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Page;

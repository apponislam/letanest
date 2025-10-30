"use client";
import { useGetConversationsByUserIdQuery } from "@/redux/features/messages/messageApi";
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";
import { Loader2, MessageSquare, User, Search, Calendar, Mail, Phone, Shield, Eye } from "lucide-react";
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

const Page = () => {
    const { id } = useParams();
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState("");
    const { data, error, isLoading } = useGetConversationsByUserIdQuery({
        userId: id as string,
    });
    console.log(data);

    const conversations = data?.data || [];
    const backendURL = process.env.NEXT_PUBLIC_BASE_API || "http://localhost:5000";

    // Filter conversations based on search
    const filteredConversations = conversations.filter((conversation: any) => {
        if (!searchTerm.trim()) return true;

        const searchLower = searchTerm.toLowerCase();
        return conversation.participants.some((participant: any) => participant.name?.toLowerCase().includes(searchLower) || participant.email?.toLowerCase().includes(searchLower) || participant.phone?.includes(searchTerm));
    });

    const formatLastMessage = (lastMessage: any) => {
        if (!lastMessage) return "No messages yet";

        switch (lastMessage.type) {
            case "offer":
                return `🏠 Offer: ${lastMessage.propertyId?.propertyNumber || "Property"}`;
            case "accepted":
                return `✅ Accepted: ${lastMessage.propertyId?.propertyNumber || "Property"}`;
            case "rejected":
                return `❌ Rejected: ${lastMessage.propertyId?.propertyNumber || "Property"}`;
            case "request":
                return `📅 Request: ${lastMessage.propertyId?.propertyNumber || "Property"}`;
            default:
                return lastMessage.text || "New message";
        }
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    const handleViewConversation = (conversationId: string) => {
        router.push(`/dashboard/user/${id}/messages/${conversationId}`);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="h-12 w-12 animate-spin text-[#C9A94D] mx-auto mb-4" />
                    <p className="text-[#14213D] text-lg">Loading user conversations...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <MessageSquare className="h-16 w-16 text-red-500 mx-auto mb-4" />
                    <p className="text-red-600 text-lg">Failed to load conversations</p>
                    <p className="text-gray-600 mt-2">User ID: {id}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-6">
            {/* Header */}
            <div className="max-w-6xl mx-auto">
                <div className="bg-white rounded-lg shadow-md p-6 mb-6 border border-[#C9A94D]">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h1 className="text-2xl font-bold text-[#14213D] flex items-center gap-3">
                                <User className="w-8 h-8" />
                                User Conversations
                            </h1>
                            <p className="text-gray-600 mt-1">Viewing all conversations for user ID: {id}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-lg font-semibold text-[#C9A94D]">
                                {conversations.length} conversation{conversations.length !== 1 ? "s" : ""}
                            </p>
                        </div>
                    </div>

                    {/* Search Bar */}
                    <div className="relative max-w-md">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input type="text" placeholder="Search conversations by name, email, or phone..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-3 border border-[#C9A94D] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C9A94D] bg-white" />
                    </div>
                </div>

                {/* Conversations Grid */}
                {filteredConversations.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-md p-12 text-center border border-[#C9A94D]">
                        <MessageSquare className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-600 mb-2">{searchTerm ? "No conversations found" : "No conversations available"}</h3>
                        <p className="text-gray-500">{searchTerm ? "Try adjusting your search terms" : "This user doesn't have any conversations yet"}</p>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {filteredConversations.map((conversation: any) => {
                            // Find other participants (excluding the current user)
                            const otherParticipants = conversation.participants.filter((p: any) => p._id !== id);

                            return (
                                <div key={conversation._id} className="bg-white rounded-lg shadow-md border border-[#C9A94D] hover:shadow-lg transition-shadow">
                                    <div className="p-6">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex items-start gap-4 flex-1">
                                                {/* Participants Avatars */}
                                                <div className="flex -space-x-2">
                                                    {otherParticipants.slice(0, 3).map((participant: any, index: number) => (
                                                        <div key={participant._id} className="relative">
                                                            {participant.profileImg ? (
                                                                <Image
                                                                    src={`${backendURL}${participant.profileImg}`}
                                                                    alt={participant.name}
                                                                    width={50}
                                                                    height={50}
                                                                    className="rounded-full border-2 h-12 w-12 border-white object-cover"
                                                                    onError={(e) => {
                                                                        e.currentTarget.style.display = "none";
                                                                    }}
                                                                />
                                                            ) : (
                                                                <Avatar name={participant.name} size={50} isVerified={participant.isVerifiedByAdmin} />
                                                            )}
                                                            {participant.isVerifiedByAdmin && <div className="absolute -bottom-1 -right-1 bg-green-500 text-white text-[8px] px-1 rounded-full border-2 border-white">✓</div>}
                                                        </div>
                                                    ))}
                                                    {otherParticipants.length > 3 && <div className="w-12 h-12 bg-[#14213D] rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-bold">+{otherParticipants.length - 3}</div>}
                                                </div>

                                                <div className="flex-1">
                                                    <h3 className="font-semibold text-[#14213D] text-lg mb-2">{otherParticipants.map((p: any) => p.name).join(", ")}</h3>

                                                    {/* Last Message */}
                                                    <div className="flex items-center gap-2 text-gray-600 mb-2">
                                                        <MessageSquare className="w-4 h-4" />
                                                        <p className="text-sm truncate">{formatLastMessage(conversation.lastMessage)}</p>
                                                    </div>

                                                    {/* Participants Info */}
                                                    <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                                                        {otherParticipants.map((participant: any) => (
                                                            <div key={participant._id} className="flex items-center gap-1">
                                                                <Shield className={`w-3 h-3 ${participant.role === "ADMIN" ? "text-purple-500" : participant.role === "HOST" ? "text-[#C9A94D]" : "text-blue-500"}`} />
                                                                <span className="capitalize">{participant.role.toLowerCase()}</span>
                                                                {participant.isVerifiedByAdmin && <span className="bg-green-100 text-green-800 px-1 rounded text-[10px]">Verified</span>}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Conversation Meta */}
                                            <div className="text-right text-sm text-gray-500">
                                                <div className="flex items-center gap-1 justify-end mb-2">
                                                    <Calendar className="w-4 h-4" />
                                                    <span>{formatDate(conversation.updatedAt)}</span>
                                                </div>
                                                {conversation.unreadCount > 0 && <div className="bg-red-500 text-white rounded-full px-2 py-1 text-xs font-bold inline-block">{conversation.unreadCount} unread</div>}
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                                            <div className="flex items-center gap-4 text-xs text-gray-500">
                                                <div className="flex items-center gap-1">
                                                    <Mail className="w-3 h-3" />
                                                    <span>{otherParticipants[0]?.email}</span>
                                                </div>
                                                {otherParticipants[0]?.phone && (
                                                    <div className="flex items-center gap-1">
                                                        <Phone className="w-3 h-3" />
                                                        <span>{otherParticipants[0]?.phone}</span>
                                                    </div>
                                                )}
                                            </div>

                                            <button onClick={() => handleViewConversation(conversation._id)} className="px-6 py-2 border-2 border-[#C9A94D] text-[#C9A94D] bg-transparent rounded-lg hover:bg-[#C9A94D] hover:text-white transition-colors flex items-center gap-2">
                                                <Eye className="w-4 h-4" />
                                                View Conversation
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Pagination Info */}
                {data?.meta && (
                    <div className="mt-6 text-center text-[#C9A94D]">
                        <p>
                            Showing {filteredConversations.length} of {data.meta.total} conversations
                            {data.meta.total > data.meta.limit && ` (Page ${data.meta.page} of ${Math.ceil(data.meta.total / data.meta.limit)})`}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Page;

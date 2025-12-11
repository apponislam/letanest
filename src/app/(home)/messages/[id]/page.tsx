// "use client";

// import React, { useEffect, useRef, useState } from "react";
// import Image from "next/image";
// import { useRouter, useParams } from "next/navigation";
// import { ArrowLeft, Loader2 } from "lucide-react";
// import { useSelector } from "react-redux";
// import { RootState } from "@/redux/store";
// import { useSocket } from "@/redux/features/socket/socketHooks";
// import { useGetUserConversationsQuery, useSendMessageMutation, useGetConversationMessagesQuery, useRejectOfferMutation, useMarkConversationAsReadsMutation, useConvertRequestToOfferMutation, useEditOfferMutation } from "@/redux/features/messages/messageApi";
// import { useAppSelector } from "@/redux/hooks";
// import { currentUser } from "@/redux/features/auth/authSlice";

// import Link from "next/link";
// import ReportModal from "@/components/messages/RepostHost";
// import EditOfferModal from "@/components/messages/EditOfferModal";
// import SuggestNewOfferModal from "@/components/messages/SuggestNewOffer";

// // Avatar component for fallback
// const Avatar = ({ name, size = 48, className = "", isVerified = false }: { name: string; size?: number; className?: string; isVerified?: boolean }) => {
//     const getInitials = (fullName: string) => {
//         return fullName
//             .split(" ")
//             .map((part) => part.charAt(0))
//             .join("")
//             .toUpperCase()
//             .slice(0, 2);
//     };

//     const getBackgroundColor = (fullName: string) => {
//         const colors = ["bg-[#C9A94D]", "bg-[#14213D]", "bg-[#9399A6]", "bg-[#434D64]", "bg-[#B89A45]", "bg-[#080E1A]"];
//         const index = fullName.length % colors.length;
//         return colors[index];
//     };

//     return (
//         <div className={`rounded-full border-2 flex items-center justify-center text-white font-semibold ${getBackgroundColor(name)} ${className} ${isVerified ? "border-green-500" : "border-white"}`} style={{ width: size, height: size }}>
//             {getInitials(name)}
//         </div>
//     );
// };

// export default function MessageConversationPage() {
//     const { user } = useSelector((state: RootState) => state.auth);
//     const { isConnected, connectSocket, disconnectSocket, joinConversation, leaveConversation, sendTyping, getTypingUsers, isUserOnline } = useSocket();

//     const params = useParams();
//     const router = useRouter();
//     const conversationId = params.id as string;

//     const [isReportModalOpen, setIsReportModalOpen] = useState(false);
//     const [markConversationAsReads] = useMarkConversationAsReadsMutation();

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
//     const { data: messagesResponse, isLoading: loadingMessages, refetch: refetchMessages } = useGetConversationMessagesQuery({ conversationId: conversationId!, page: 1, limit: 150 }, { skip: !conversationId });
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

//     // Mark conversation as read when opened
//     useEffect(() => {
//         if (conversationId && user?._id) {
//             markConversationAsReads(conversationId);
//         }
//     }, [conversationId, user?._id, markConversationAsReads]);

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

//     const backendURL = process.env.NEXT_PUBLIC_BASE_API || "http://localhost:5000";

//     return (
//         <div className="h-screen flex flex-col bg-[#B6BAC3]">
//             {/* Header */}
//             <div className="fixed left-0 right-0 flex items-center p-4 border-b border-[#C9A94D] bg-[#9399A6] z-10">
//                 <button onClick={() => router.back()} className="mr-3 text-[#14213D] hover:bg-[#B6BAC3] p-1 rounded-full transition-colors">
//                     <ArrowLeft size={24} />
//                 </button>

//                 {otherParticipant?.profileImg ? (
//                     <Image
//                         src={`${backendURL}${otherParticipant.profileImg}`}
//                         alt={otherParticipant?.name || "User"}
//                         width={44}
//                         height={44}
//                         className="rounded-full border-2 border-white object-cover mr-3"
//                         onError={(e) => {
//                             e.currentTarget.style.display = "none";
//                         }}
//                     />
//                 ) : (
//                     <Avatar name={otherParticipant?.name || "Unknown User"} size={44} className="mr-3" isVerified={otherParticipant?.isVerifiedByAdmin} />
//                 )}

//                 <div className="flex-1">
//                     <h2 className="font-bold text-[#14213D] text-lg">{otherParticipant?.name || "Unknown User"}</h2>
//                     <div className={`text-xs ${isUserOnline(otherParticipant?._id) ? "text-green-600 font-medium" : "text-gray-600"}`}>{isUserOnline(otherParticipant?._id) ? "Online" : "Offline"}</div>
//                 </div>

//                 {otherParticipant && (
//                     <button onClick={() => setIsReportModalOpen(true)} className={`px-3 py-1 text-xs rounded-[4px] transition-colors ${otherParticipant?.role === "HOST" ? "bg-[#C9A94D] text-white hover:bg-[#b8973e]" : "bg-[#14213D] text-white hover:bg-[#0f1a2f]"}`}>
//                         Report {otherParticipant?.role}
//                     </button>
//                 )}

//                 <div className={`w-2 h-2 rounded-full ml-2 ${isConnected ? "bg-green-500" : "bg-red-500"}`} title={isConnected ? "Connected" : "Disconnected"} />
//             </div>

//             {/* Messages Area */}
//             <div className="flex-1 overflow-y-auto p-4 space-y-3">
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
//                     messagesData.map((msg: any) => <MessageBubble key={msg._id} message={msg} currentUserId={user?._id} conversationId={conversationId} />)
//                 )}

//                 {/* Typing Indicator */}
//                 {otherUserTyping.length > 0 && (
//                     <div className="flex justify-start">
//                         <div className="bg-[#D4BA71] px-4 py-3 rounded-lg">
//                             <div className="flex items-center gap-2">
//                                 {otherParticipant?.profileImg ? (
//                                     <Image
//                                         src={`${backendURL}${otherParticipant.profileImg}`}
//                                         alt={otherParticipant?.name || "User"}
//                                         width={20}
//                                         height={20}
//                                         className="rounded-full border border-white"
//                                         onError={(e) => {
//                                             e.currentTarget.style.display = "none";
//                                         }}
//                                     />
//                                 ) : (
//                                     <Avatar name={otherParticipant?.name || "Unknown User"} size={20} />
//                                 )}
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

//             {/* Report Modal */}
//             {otherParticipant && <ReportModal isOpen={isReportModalOpen} onClose={() => setIsReportModalOpen(false)} reportedUserId={otherParticipant._id} reportedUserName={otherParticipant.name} reportedUserRole={otherParticipant.role} conversationId={conversationId} />}
//         </div>
//     );
// }

// // MessageBubble component with all the functionality from desktop version
// const MessageBubble = ({ message, currentUserId, conversationId }: { message: any; currentUserId?: string; conversationId: string }) => {
//     const user = useAppSelector(currentUser);

//     const isMe = message.sender?._id === currentUserId;
//     const backendURL = process.env.NEXT_PUBLIC_BASE_API || "http://localhost:5000";

//     const { refetch: refetchMessages } = useGetConversationMessagesQuery({ conversationId: conversationId!, page: 1, limit: 150 }, { skip: !conversationId });
//     const { refetch: refetchConversations } = useGetUserConversationsQuery({});
//     const [sendMessage, { isLoading: isSending }] = useSendMessageMutation();
//     const [showSuggestOfferModal, setShowSuggestOfferModal] = useState(false);

//     const [rejectOffer, { isLoading: isRejecting }] = useRejectOfferMutation();

//     const handleRejectOffer = async () => {
//         try {
//             await rejectOffer({
//                 messageId: message._id,
//                 conversationId: conversationId,
//             }).unwrap();
//         } catch (error) {
//             console.log(error);
//             console.error("Failed to reject offer:", error);
//         }
//     };

//     const handleSuggestNewOffer = async (offerData: any) => {
//         if (!user || !conversationId) {
//             console.error("User or conversation not available");
//             return;
//         }

//         try {
//             await sendMessage({
//                 conversationId: conversationId,
//                 sender: user._id,
//                 type: "offer",
//                 propertyId: offerData.propertyId,
//                 checkInDate: offerData.checkInDate,
//                 checkOutDate: offerData.checkOutDate,
//                 agreedFee: offerData.agreedFee.toString(),
//                 guestNo: offerData.guestNo,
//             }).unwrap();

//             setShowSuggestOfferModal(false);

//             // Refetch messages
//             setTimeout(() => {
//                 refetchMessages();
//                 refetchConversations();
//             }, 100);
//         } catch (error) {
//             console.error("Failed to send new offer:", error);
//         }
//     };

//     const [convertRequestToOffer, { isLoading: isConverting }] = useConvertRequestToOfferMutation();

//     const handleConvertToOffer = async () => {
//         try {
//             await convertRequestToOffer({
//                 messageId: message._id,
//                 conversationId: conversationId,
//             }).unwrap();
//         } catch (error) {
//             console.log(error);
//             console.error("Failed to convert request to offer:", error);
//         }
//     };

//     const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//     const [editOffer, { isLoading: isEditing }] = useEditOfferMutation();

//     const handleEditOffer = async (editData: any) => {
//         try {
//             await editOffer({
//                 messageId: message._id,
//                 conversationId: conversationId,
//                 ...editData,
//             }).unwrap();
//             setIsEditModalOpen(false);
//         } catch (error) {
//             console.log(error);
//         }
//     };

//     // Handle optimistic messages
//     if (message.isOptimistic) {
//         return (
//             <div className={`flex items-end ${isMe ? "justify-end" : "justify-start"}`}>
//                 {!isMe &&
//                     (message.sender?.profileImg ? (
//                         <Image
//                             src={`${backendURL}${message.sender.profileImg}`}
//                             alt={message.sender?.name}
//                             width={30}
//                             height={30}
//                             className="rounded-full mr-2 h-[30px] w-[30px]"
//                             onError={(e) => {
//                                 e.currentTarget.style.display = "none";
//                             }}
//                         />
//                     ) : (
//                         <Avatar name={message.sender?.name || "Unknown User"} size={30} className="mr-2" />
//                     ))}
//                 <div className={`px-3 py-2 rounded-lg max-w-xs break-words ${isMe ? "bg-[#14213D] text-white opacity-80" : "bg-[#D4BA71] text-[#080E1A] opacity-80"}`}>
//                     <p>{message.text}</p>
//                     <p className="text-xs opacity-70 mt-1">Sending...</p>
//                 </div>
//                 {isMe &&
//                     (message.sender?.profileImg ? (
//                         <Image
//                             src={`${backendURL}${message.sender.profileImg}`}
//                             alt="Me"
//                             width={30}
//                             height={30}
//                             className="rounded-full ml-2 h-[30px] w-[30px]"
//                             onError={(e) => {
//                                 e.currentTarget.style.display = "none";
//                             }}
//                         />
//                     ) : (
//                         <Avatar name={message.sender?.name || "Unknown User"} size={30} className="ml-2" />
//                     ))}
//             </div>
//         );
//     }

//     if (message.type === "offer") {
//         const formatDate = (dateString: string) => {
//             if (!dateString) return "Not set";
//             const date = new Date(dateString);
//             if (isNaN(date.getTime())) return "Invalid date";
//             const day = String(date.getDate()).padStart(2, "0");
//             const month = String(date.getMonth() + 1).padStart(2, "0");
//             const year = date.getFullYear();
//             return `${day}/${month}/${year}`;
//         };

//         const calculateDays = () => {
//             if (!message.checkInDate || !message.checkOutDate) return "0 Night";

//             const checkIn = new Date(message.checkInDate);
//             const checkOut = new Date(message.checkOutDate);

//             if (isNaN(checkIn.getTime()) || isNaN(checkOut.getTime())) return "0 Nights";

//             const timeDiff = checkOut.getTime() - checkIn.getTime();
//             const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

//             return `( ${daysDiff} Night${daysDiff !== 1 ? "s" : ""} )`;
//         };

//         return (
//             <div className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
//                 {!isMe &&
//                     (message.sender?.profileImg ? (
//                         <Image
//                             src={`${backendURL}${message.sender.profileImg}`}
//                             alt={message.sender?.name}
//                             width={30}
//                             height={30}
//                             className="rounded-full mr-2 h-[30px] w-[30px]"
//                             onError={(e) => {
//                                 e.currentTarget.style.display = "none";
//                             }}
//                         />
//                     ) : (
//                         <Avatar name={message.sender?.name || "Unknown User"} size={30} className="mr-2" />
//                     ))}

//                 <div className="bg-[#D4BA71] p-3 border-2 border-black w-72">
//                     <p className="font-semibold text-sm text-center">Nest Offer</p>
//                     <p className="text-[12px] text-[#16223D] mb-2 text-center">Property ID - {message?.propertyId?.propertyNumber}</p>
//                     <p className="text-center font-bold mb-1 text-[14px]">Host Agreed Fee - £{message?.agreedFee}</p>

//                     {!message?.bookingFeePaid && (
//                         <p className="text-center font-bold mb-2 text-[14px]">
//                             Booking Fee - £{message?.bookingFee} (${((message?.bookingFee / message?.agreedFee) * 100).toFixed(0)}%)
//                         </p>
//                     )}

//                     <div className="flex justify-between">
//                         <p className="text-center text-[12px]">Requested Dates:</p>

//                         <div>
//                             <p className="text-right text-[12px] ">
//                                 {formatDate(message.checkInDate)} to {formatDate(message.checkOutDate)}
//                             </p>

//                             <p className="text-right text-[12px] mb-2">{calculateDays()}</p>
//                         </div>
//                     </div>

//                     {message.guestNo && (
//                         <div className="flex justify-between">
//                             <p className=" text-[12px] ">Guests:</p>
//                             <p className="text-[10px]  mb-2">{message.guestNo}</p>
//                         </div>
//                     )}

//                     {!message?.bookingFeePaid ? <p className="text-center font-bold mb-2 text-[14px]">To Pay - £{message?.bookingFee}</p> : <p className="text-center font-bold mb-2 text-[14px]">To Pay - £{message?.agreedFee}</p>}

//                     {user?._id === message.propertyId?.createdBy?._id ? (
//                         // Property Owner View
//                         !message?.bookingFeePaid ? (
//                             // If bookingFeePaid false - Show only Reject Offer
//                             <div className="flex justify-center mt-3 w-full">
//                                 <button onClick={handleRejectOffer} disabled={isRejecting} className="border border-black bg-[#16223D] text-white px-4 py-1 text-[8px] hover:bg-[#1a2a4a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-full max-w-[120px] cursor-pointer">
//                                     {isRejecting ? "Rejecting..." : "Reject Offer"}
//                                 </button>
//                             </div>
//                         ) : (
//                             // If bookingFeePaid true - No reject button
//                             <div></div>
//                         )
//                     ) : // Other User View
//                     !message?.bookingFeePaid ? (
//                         // If bookingFeePaid false - Pay By Card | Withdraw Offer
//                         <div className="grid grid-cols-2 gap-4 mt-3 w-full items-stretch">
//                             <Link href={`/listings/${message._id}/pay`} className="w-full flex">
//                                 <button className="border border-black bg-[#16223D] text-white px-4 py-1 text-[8px] hover:bg-[#1a2a4a] transition-colors w-full flex-1">Pay By Card</button>
//                             </Link>
//                             <button onClick={handleRejectOffer} disabled={isRejecting} className="border border-black bg-[#16223D] text-white px-4 py-1 text-[8px] hover:bg-[#1a2a4a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-full cursor-pointer">
//                                 {isRejecting ? "Withdrawing..." : "Withdraw Offer"}
//                             </button>
//                         </div>
//                     ) : (
//                         // If bookingFeePaid true - Pay By Card | Pay By Bank Transfer | Withdraw Offer
//                         <div className="grid grid-cols-2 gap-2 mt-3 w-full items-stretch">
//                             <Link href={`/listings/${message._id}/pay`} className="w-full flex">
//                                 <button className="border border-black bg-[#16223D] text-white px-4 py-1 text-[8px] hover:bg-[#1a2a4a] transition-colors w-full">Pay By Card</button>
//                             </Link>
//                             <button className="border border-black bg-[#16223D] text-white px-4 py-1 text-[8px] hover:bg-[#1a2a4a] transition-colors w-full">Pay By Bank Transfer</button>
//                             <div></div> {/* Empty space */}
//                             <button onClick={handleRejectOffer} disabled={isRejecting} className="border border-black bg-[#16223D] text-white px-4 py-1 text-[8px] hover:bg-[#1a2a4a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-full cursor-pointer">
//                                 {isRejecting ? "Withdrawing..." : "Withdraw Offer"}
//                             </button>
//                         </div>
//                     )}
//                     {user?._id === message.propertyId?.createdBy?._id ? null : !message?.bookingFeePaid ? ( // Property Owner - Show nothing // Guest
//                         <p className="text-center mt-1 text-[9px]">Good news! The host has accepted your offer. To secure your booking, please complete the (${((message?.bookingFee / message?.agreedFee) * 100).toFixed(0)}%) booking fee.</p>
//                     ) : (
//                         <p className="text-center mt-1 text-[9px]">Last one last step — pay the host and your nest for your next stay is all yours!</p>
//                     )}
//                 </div>

//                 {isMe &&
//                     (message.sender?.profileImg ? (
//                         <Image
//                             src={`${backendURL}${message.sender.profileImg}`}
//                             alt="Me"
//                             width={30}
//                             height={30}
//                             className="rounded-full ml-2 h-[30px] w-[30px]"
//                             onError={(e) => {
//                                 e.currentTarget.style.display = "none";
//                             }}
//                         />
//                     ) : (
//                         <Avatar name={message.sender?.name || "Unknown User"} size={30} className="ml-2" />
//                     ))}
//             </div>
//         );
//     }

//     if (message.type === "request") {
//         const formatDate = (dateString: string) => {
//             if (!dateString) return "Not set";

//             const date = new Date(dateString);
//             if (isNaN(date.getTime())) return "Invalid date";

//             const day = String(date.getDate()).padStart(2, "0");
//             const month = String(date.getMonth() + 1).padStart(2, "0"); // months are 0-indexed
//             const year = date.getFullYear();

//             return `${day}/${month}/${year}`;
//         };

//         const calculateDays = () => {
//             if (!message.checkInDate || !message.checkOutDate) return "0 Night";

//             const checkIn = new Date(message.checkInDate);
//             const checkOut = new Date(message.checkOutDate);

//             if (isNaN(checkIn.getTime()) || isNaN(checkOut.getTime())) return "0 Nights";

//             const timeDiff = checkOut.getTime() - checkIn.getTime();
//             const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

//             return `( ${daysDiff} Night${daysDiff !== 1 ? "s" : ""} )`;
//         };

//         return (
//             <div className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
//                 {!isMe &&
//                     (message.sender?.profileImg ? (
//                         <Image
//                             src={`${backendURL}${message.sender.profileImg}`}
//                             alt={message.sender?.name}
//                             width={30}
//                             height={30}
//                             className="rounded-full mr-2 h-[30px] w-[30px]"
//                             onError={(e) => {
//                                 e.currentTarget.style.display = "none";
//                             }}
//                         />
//                     ) : (
//                         <Avatar name={message.sender?.name || "Unknown User"} size={30} className="mr-2" />
//                     ))}
//                 <div className="bg-[#D4BA71] p-3 border-2 border-black w-72">
//                     <p className="font-semibold text-sm text-center">Booking Offer</p>
//                     <p className="text-[12px] text-[#16223D] mb-2 text-center">Property ID - {message?.propertyId?.propertyNumber}</p>
//                     <p className="text-center font-bold mb-2">£{message?.agreedFee}</p>
//                     <p className="text-center text-[12px]">Requested Dates:</p>

//                     <p className="text-center text-[12px] ">
//                         {formatDate(message.checkInDate)} to {formatDate(message.checkOutDate)}
//                     </p>

//                     <p className="text-center text-[12px] mb-2">{calculateDays()}</p>

//                     {message.guestNo && (
//                         <div>
//                             <p className="text-center text-[12px] ">Guests:</p>
//                             <p className="text-[10px] text-center mb-2">{message.guestNo}</p>
//                         </div>
//                     )}

//                     {user?._id === message.propertyId?.createdBy?._id ? (
//                         // Property Owner View - Show grid of buttons
//                         <div className="grid grid-cols-2 gap-2 mt-3 w-full">
//                             <button onClick={handleConvertToOffer} disabled={isConverting} className="border border-black bg-[#16223D] text-white px-4 py-1 text-[9px] hover:bg-[#1a2a4a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-full cursor-pointer">
//                                 {isConverting ? "Accepting..." : "Accept Offer"}
//                             </button>
//                             <button onClick={handleRejectOffer} disabled={isRejecting} className="border border-black bg-[#16223D] text-white px-4 py-1 text-[9px] hover:bg-[#1a2a4a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-full cursor-pointer">
//                                 {isRejecting ? "Rejecting..." : "Reject Offer"}
//                             </button>
//                             <button onClick={() => setShowSuggestOfferModal(true)} className="border border-black bg-[#16223D] text-white px-4 py-1 text-[9px] hover:bg-[#1a2a4a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-full cursor-pointer">
//                                 Suggest New Offer
//                             </button>
//                             <button className="border border-black bg-[#16223D] text-white px-4 py-1 text-[9px] hover:bg-[#1a2a4a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-full">Message Guest</button>
//                         </div>
//                     ) : (
//                         // Other User View - Show only Make Offer and Withdraw Offer
//                         <div className="grid grid-cols-2 gap-4 mt-3 w-full">
//                             <button onClick={() => setIsEditModalOpen(true)} className="border border-black bg-[#16223D] text-white px-4 py-1 text-[9px] hover:bg-[#1a2a4a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-full">
//                                 Edit/Change Offer
//                             </button>
//                             <button onClick={handleRejectOffer} disabled={isRejecting} className="border border-black bg-[#16223D] text-white px-4 py-1 text-[9px] hover:bg-[#1a2a4a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-full cursor-pointer">
//                                 {isRejecting ? "Withdrawing..." : "Withdraw Offer"}
//                             </button>
//                         </div>
//                     )}
//                     {user?._id === message.propertyId?.createdBy?._id ? <p className="text-center mt-1 text-[9px]">You've received a new offer. Please response within 48 hours - after that, the offer will automatically expire.</p> : <p className="text-center mt-1 text-[9px]">Thank you! Your offer has been sent to the host for review</p>}
//                     <EditOfferModal message={message} isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} onSave={handleEditOffer} isEditing={isEditing} />
//                 </div>

//                 <SuggestNewOfferModal message={message} isOpen={showSuggestOfferModal} onClose={() => setShowSuggestOfferModal(false)} onSend={handleSuggestNewOffer} isSending={isSending} />

//                 {isMe &&
//                     (message.sender?.profileImg ? (
//                         <Image
//                             src={`${backendURL}${message.sender.profileImg}`}
//                             alt="Me"
//                             width={30}
//                             height={30}
//                             className="rounded-full ml-2 h-[30px] w-[30px]"
//                             onError={(e) => {
//                                 e.currentTarget.style.display = "none";
//                             }}
//                         />
//                     ) : (
//                         <Avatar name={message.sender?.name || "Unknown User"} size={30} className="ml-2" />
//                     ))}
//             </div>
//         );
//     }

//     if (message.type === "accepted") {
//         return (
//             <div className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
//                 {!isMe &&
//                     (message.sender?.profileImg ? (
//                         <Image
//                             src={`${backendURL}${message.sender.profileImg}`}
//                             alt={message.sender?.name}
//                             width={30}
//                             height={30}
//                             className="rounded-full mr-2 h-[30px] w-[30px]"
//                             onError={(e) => {
//                                 e.currentTarget.style.display = "none";
//                             }}
//                         />
//                     ) : (
//                         <Avatar name={message.sender?.name || "Unknown User"} size={30} className="mr-2" />
//                     ))}
//                 <div className="bg-[#D4BA71] p-3 border-2 border-black w-72">
//                     <p className="font-semibold text-sm text-center">Offer Accepted</p>
//                     <p className="text-[12px] text-[#16223D] mb-4 text-center">Property ID - {message?.propertyId?.propertyNumber}</p>

//                     <div className="flex flex-col gap-3">
//                         <div className="text-[12px] flex justify-between items-center">
//                             <div className="flex items-center gap-2">
//                                 <Image alt="Property Name" src="/messages/accepted/home-roof.png" height={16} width={16} />
//                                 <span>Property:</span>
//                             </div>
//                             <span className="font-semibold">{message?.propertyId?.title}</span>
//                         </div>

//                         <div className="text-[12px] flex justify-between items-center">
//                             <div className="flex items-center gap-2">
//                                 <Image alt="Address" src="/messages/accepted/location-pin.png" height={16} width={16} />
//                                 <span>Address:</span>
//                             </div>
//                             <span className="font-semibold text-right">{message?.propertyId?.location}</span>
//                         </div>

//                         <div className="text-[12px] flex justify-between items-center">
//                             <div className="flex items-center gap-2">
//                                 <Image alt="Property Manager" src="/messages/accepted/user-alt.png" height={16} width={16} />
//                                 <span>Manager:</span>
//                             </div>
//                             <span className="font-semibold">{message.propertyId?.createdBy?.name}</span>
//                         </div>

//                         <div className="text-[12px] flex justify-between items-center">
//                             <div className="flex items-center gap-2">
//                                 <Image alt="Phone" src="/messages/accepted/phone.png" height={16} width={16} />
//                                 <span>Phone:</span>
//                             </div>
//                             <span className="font-semibold">{message.propertyId?.createdBy?.phone}</span>
//                         </div>
//                     </div>

//                     <div className="flex justify-center mt-3">
//                         <div className="border border-black bg-[#16223D] text-white px-6 py-1 text-[10px]">Booking Confirmed</div>
//                     </div>
//                 </div>
//                 {isMe &&
//                     (message.sender?.profileImg ? (
//                         <Image
//                             src={`${backendURL}${message.sender.profileImg}`}
//                             alt="Me"
//                             width={30}
//                             height={30}
//                             className="rounded-full ml-2 h-[30px] w-[30px]"
//                             onError={(e) => {
//                                 e.currentTarget.style.display = "none";
//                             }}
//                         />
//                     ) : (
//                         <Avatar name={message.sender?.name || "Unknown User"} size={30} className="ml-2" />
//                     ))}
//             </div>
//         );
//     }

//     if (message.type === "rejected") {
//         return (
//             <div className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
//                 {!isMe &&
//                     (message.sender?.profileImg ? (
//                         <Image
//                             src={`${backendURL}${message.sender.profileImg}`}
//                             alt={message.sender?.name}
//                             width={30}
//                             height={30}
//                             className="rounded-full mr-2 h-[30px] w-[30px]"
//                             onError={(e) => {
//                                 e.currentTarget.style.display = "none";
//                             }}
//                         />
//                     ) : (
//                         <Avatar name={message.sender?.name || "Unknown User"} size={30} className="mr-2" />
//                     ))}
//                 <div className="bg-red-200 p-3 rounded-lg w-72 text-center font-semibold text-red-900">Offer Rejected</div>
//                 {isMe &&
//                     (message.sender?.profileImg ? (
//                         <Image
//                             src={`${backendURL}${message.sender.profileImg}`}
//                             alt="Me"
//                             width={30}
//                             height={30}
//                             className="rounded-full ml-2 h-[30px] w-[30px]"
//                             onError={(e) => {
//                                 e.currentTarget.style.display = "none";
//                             }}
//                         />
//                     ) : (
//                         <Avatar name={message.sender?.name || "Unknown User"} size={30} className="ml-2" />
//                     ))}
//             </div>
//         );
//     }

//     // Normal text message
//     return (
//         <div className={`flex items-end ${isMe ? "justify-end" : "justify-start"}`}>
//             {!isMe &&
//                 (message.sender?.profileImg ? (
//                     <Image
//                         src={`${backendURL}${message.sender.profileImg}`}
//                         alt={message.sender?.name}
//                         width={30}
//                         height={30}
//                         className="rounded-full mr-2 h-[30px] w-[30px]"
//                         onError={(e) => {
//                             e.currentTarget.style.display = "none";
//                         }}
//                     />
//                 ) : (
//                     <Avatar name={message.sender?.name || "Unknown User"} size={30} className="mr-2" />
//                 ))}
//             <div className={`px-3 py-2 rounded-lg max-w-xs break-words ${isMe ? "bg-[#14213D] text-white" : "bg-[#D4BA71] text-[#080E1A]"}`}>
//                 <p>{message.text}</p>
//                 {message.createdAt && <p className="text-xs opacity-70 mt-1 text-right">{new Date(message.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>}
//             </div>
//             {isMe &&
//                 (message.sender?.profileImg ? (
//                     <Image
//                         src={`${backendURL}${message.sender.profileImg}`}
//                         alt="Me"
//                         width={30}
//                         height={30}
//                         className="rounded-full ml-2 h-[30px] w-[30px]"
//                         onError={(e) => {
//                             e.currentTarget.style.display = "none";
//                         }}
//                     />
//                 ) : (
//                     <Avatar name={message.sender?.name || "Unknown User"} size={30} className="ml-2" />
//                 ))}
//         </div>
//     );
// };

"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Loader2, Star, CalendarIcon } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useSocket } from "@/redux/features/socket/socketHooks";
import { useGetUserConversationsQuery, useSendMessageMutation, useGetConversationMessagesQuery, useRejectOfferMutation, useMarkConversationAsReadsMutation, useConvertRequestToOfferMutation, useEditOfferMutation, useConvertMakeOfferToRequestMutation } from "@/redux/features/messages/messageApi";
import { useAppSelector } from "@/redux/hooks";
import { currentUser } from "@/redux/features/auth/authSlice";

import Link from "next/link";
import ReportModal from "@/components/messages/RepostHost";
import EditOfferModal from "@/components/messages/EditOfferModal";
import SuggestNewOfferModal from "@/components/messages/SuggestNewOffer";
import BankTransferModal from "@/components/messages/BankTransferModal";
import { toast } from "sonner";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { DateRange } from "react-day-picker";
import { useCreateRatingMutation, useGetUserRatingStatsQuery } from "@/redux/features/rating/ratingApi";

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

export default function MessageConversationPage() {
    const { user } = useSelector((state: RootState) => state.auth);
    const { isConnected, connectSocket, disconnectSocket, joinConversation, leaveConversation, sendTyping, getTypingUsers, isUserOnline } = useSocket();

    const params = useParams();
    const router = useRouter();
    const conversationId = params.id as string;

    const [isReportModalOpen, setIsReportModalOpen] = useState(false);
    const [markConversationAsReads] = useMarkConversationAsReadsMutation();

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
    const { data: messagesResponse, isLoading: loadingMessages, refetch: refetchMessages } = useGetConversationMessagesQuery({ conversationId: conversationId!, page: 1, limit: 150 }, { skip: !conversationId });
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

    // Mark conversation as read when opened
    useEffect(() => {
        if (conversationId && user?._id) {
            markConversationAsReads(conversationId);
        }
    }, [conversationId, user?._id, markConversationAsReads]);

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

    // Get rating stats for host
    const { data: ratingStats } = useGetUserRatingStatsQuery(otherParticipant?._id ?? "", {
        skip: !otherParticipant,
    });

    if (loadingConversations || !currentConversation) {
        return (
            <div className="h-screen flex items-center justify-center bg-[#B6BAC3]">
                <Loader2 className="h-8 w-8 animate-spin text-[#C9A94D]" />
                <span className="ml-2 text-[#14213D]">Loading conversation...</span>
            </div>
        );
    }

    const backendURL = process.env.NEXT_PUBLIC_BASE_API || "http://localhost:5000";

    // Helper function to format display name
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

    return (
        <div className="h-screen flex flex-col bg-[#B6BAC3]">
            {/* Header */}
            <div className="fixed left-0 right-0 flex items-center p-4 border-b border-[#C9A94D] bg-[#9399A6] z-10">
                <button onClick={() => router.back()} className="mr-3 text-[#14213D] hover:bg-[#B6BAC3] p-1 rounded-full transition-colors">
                    <ArrowLeft size={24} />
                </button>

                <div className="relative">
                    {otherParticipant?.profileImg ? (
                        <div className="relative">
                            <Image
                                src={`${backendURL}${otherParticipant.profileImg}`}
                                alt={otherParticipant?.name || "User"}
                                width={44}
                                height={44}
                                className="rounded-full border-2 border-white object-cover mr-3"
                                onError={(e) => {
                                    e.currentTarget.style.display = "none";
                                }}
                            />
                            {otherParticipant?.isVerifiedByAdmin && <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 bg-green-500 text-white text-[8px] px-1 rounded-[4px] whitespace-nowrap">verified</div>}
                        </div>
                    ) : (
                        <div className="relative">
                            <Avatar name={otherParticipant?.name || "Unknown User"} size={44} className="mr-3" isVerified={otherParticipant?.isVerifiedByAdmin} />
                            {otherParticipant?.isVerifiedByAdmin && <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 bg-green-500 text-white text-[8px] px-1 rounded-[4px] whitespace-nowrap">verified</div>}
                        </div>
                    )}
                </div>

                <div className="flex-1">
                    <h2 className="font-bold text-[#14213D] text-lg">{getDisplayName(otherParticipant?.name, otherParticipant?.role)}</h2>
                    <div className="flex items-center gap-3">
                        <div className={`text-xs ${isUserOnline(otherParticipant?._id) ? "text-green-600 font-medium" : "text-gray-600"}`}>{isUserOnline(otherParticipant?._id) ? "Online" : "Offline"}</div>
                        <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-current text-[#C9A94D]" />
                            <p className="text-xs text-[#14213D]">{ratingStats?.data?.averageRating?.toFixed(1) || "No Review"}</p>
                        </div>
                    </div>
                </div>

                {otherParticipant && (
                    <button onClick={() => setIsReportModalOpen(true)} className={`px-3 py-1 text-xs rounded-[4px] transition-colors ${otherParticipant?.role === "HOST" ? "bg-[#C9A94D] text-white hover:bg-[#b8973e]" : "bg-[#14213D] text-white hover:bg-[#0f1a2f]"}`}>
                        Report {otherParticipant?.role}
                    </button>
                )}

                <div className={`w-2 h-2 rounded-full ml-2 ${isConnected ? "bg-green-500" : "bg-red-500"}`} title={isConnected ? "Connected" : "Disconnected"} />
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 mt-14">
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
                    messagesData.map((msg: any) => <MessageBubble key={msg._id} message={msg} currentUserId={user?._id} conversationId={conversationId} otherParticipant={otherParticipant} />)
                )}

                {/* Typing Indicator */}
                {otherUserTyping.length > 0 && (
                    <div className="flex justify-start">
                        <div className="bg-[#D4BA71] px-4 py-3 rounded-lg">
                            <div className="flex items-center gap-2">
                                <div className="flex space-x-1 items-center">
                                    <span className="text-sm text-gray-600 mr-2">Typing...</span>
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

            {/* Report Modal */}
            {otherParticipant && <ReportModal isOpen={isReportModalOpen} onClose={() => setIsReportModalOpen(false)} reportedUserId={otherParticipant._id} reportedUserName={otherParticipant.name} reportedUserRole={otherParticipant.role} conversationId={conversationId} />}
        </div>
    );
}

// Updated MessageBubble component with all new message types
const MessageBubble = ({ message, currentUserId, conversationId, otherParticipant }: { message: any; currentUserId?: string; conversationId: string; otherParticipant: any }) => {
    const user = useAppSelector(currentUser);

    const isMe = message.sender?._id === currentUserId;
    const backendURL = process.env.NEXT_PUBLIC_BASE_API || "http://localhost:5000";

    const { refetch: refetchMessages } = useGetConversationMessagesQuery({ conversationId: conversationId!, page: 1, limit: 150 }, { skip: !conversationId });
    const { refetch: refetchConversations } = useGetUserConversationsQuery({});
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
                conversationId: conversationId,
            }).unwrap();
        } catch (error) {
            console.log(error);
            console.error("Failed to reject offer:", error);
        }
    };

    const [convertRequestToOffer, { isLoading: isConverting }] = useConvertRequestToOfferMutation();

    const handleConvertToOffer = async () => {
        try {
            await convertRequestToOffer({
                messageId: message._id,
                conversationId: conversationId,
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
                conversationId: conversationId,
                ...editData,
            }).unwrap();
            setIsEditModalOpen(false);
        } catch (error) {
            console.log(error);
        }
    };

    const handleSuggestNewOffer = async (offerData: any) => {
        if (!user || !conversationId) {
            console.error("User or conversation not available");
            return;
        }

        try {
            await editOffer({
                messageId: message._id,
                conversationId: conversationId,
                ...offerData,
            }).unwrap();

            setShowSuggestOfferModal(false);

            // Refetch messages
            setTimeout(() => {
                refetchMessages();
                refetchConversations();
            }, 100);
        } catch (error) {
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

        const totalPrice = daysDiff * propertyPrice;

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

        console.log("🚀 Sending request with agreedFee:", agreedFee);

        try {
            await convertMakeOfferToRequest({
                messageId: message._id,
                conversationId: conversationId,
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

    // Review functionality
    const [ratingData, setRatingData] = useState({
        communication: 0,
        accuracy: 0,
        cleanliness: 0,
        checkInExperience: 0,
        overallExperience: 0,
        description: "",
    });

    const [createRating, { isLoading: isSubmitting }] = useCreateRatingMutation();

    const handleStarChange = (field: keyof typeof ratingData, value: number) => {
        setRatingData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleSubmitReview = async () => {
        try {
            const propertyOwnerId = message?.propertyId?.createdBy?._id;
            const me = user?._id;
            const senderId = message?.sender?._id;

            console.log("IDs:", { me, propertyOwnerId, senderId });

            let actualReviewedId = null;
            let actualReviewedRole = null;

            const isSenderHost = senderId === propertyOwnerId;

            if (isSenderHost) {
                actualReviewedRole = "Host";
                actualReviewedId = propertyOwnerId;
            } else {
                actualReviewedRole = "Guest";
                actualReviewedId = senderId;
                console.log("Message from guest → Reviewing GUEST (opposite)");
            }

            if (!actualReviewedId) {
                toast.error("Unable to find review target");
                return;
            }

            // Validation
            if (ratingData.overallExperience === 0) {
                toast.error("Please select overall experience rating");
                return;
            }

            const requiredFields: Array<keyof typeof ratingData> = ["communication", "accuracy", "cleanliness", "checkInExperience"];
            const missingFields = requiredFields.filter((f) => ratingData[f] === 0);

            if (missingFields.length > 0) {
                toast.error(`Please rate: ${missingFields.join(", ")}`);
                return;
            }

            // Prepare payload
            const payload: any = {
                type: actualReviewedRole === "Guest" ? "guest" : "property",
                userId: me,
                reviewedId: actualReviewedId,
                communication: ratingData.communication,
                accuracy: ratingData.accuracy,
                cleanliness: ratingData.cleanliness,
                checkInExperience: ratingData.checkInExperience,
                overallExperience: ratingData.overallExperience,
                description: ratingData.description,
                status: "approved",
                message: message._id,
            };

            if (actualReviewedRole === "Host") {
                payload.propertyId = message.propertyId?._id;
            }

            console.log("Payload:", payload);

            const result = await createRating(payload).unwrap();
            toast.success(result.message || "Review submitted successfully!");

            setRatingData({
                communication: 0,
                accuracy: 0,
                cleanliness: 0,
                checkInExperience: 0,
                overallExperience: 0,
                description: "",
            });
        } catch (err: any) {
            toast.error(err?.data?.message || "Review failed");
            console.error(err);
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

    // Review done
    if (message.type === "review" && message.reviewed) {
        const isMyMessage = user?._id === message.sender?._id;

        if (isMyMessage) {
            // This is MY message, but SOMEONE ELSE reviewed ME
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
                    <div className="bg-[#14213D] p-3 border-2 border-[#14213D] w-80">
                        <p className="font-semibold text-sm text-center mb-3 text-[#D4BA71]">Review Received ✓</p>

                        <div className="text-center mb-3">
                            <p className="text-[11px] text-[#D4BA71] mb-2"> {otherParticipant?.name || "User"} has left a review.</p>
                        </div>

                        <div className="text-center">
                            <p className="text-[10px] text-[#D4BA71]">Submitted on: {new Date(message.updatedAt).toLocaleDateString()}</p>
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
        } else {
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
                    <div className="bg-[#14213D] p-3 border-2 border-[#14213D] w-80">
                        <p className="font-semibold text-sm text-center mb-3 text-[#D4BA71]">Review Sent ✓</p>

                        <div className="text-center mb-3">
                            <p className="text-[11px] text-[#D4BA71] mb-2">Your review has been submitted. Thank you for sharing your experience.</p>
                        </div>

                        <div className="text-center">
                            <p className="text-[10px] text-[#D4BA71]">Submitted: {new Date(message.updatedAt).toLocaleDateString()}</p>
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
    }

    // Review message type
    if (message.type === "review") {
        const isSenderHost = message.sender?._id === message.propertyId?.createdBy?._id;
        const personToReviewRole = isSenderHost ? "Host" : "Guest";
        const propertyId = message.propertyId?._id;
        const isMyMessage = user?._id === message.sender?._id;
        const shouldDisableButton = isSubmitting || isMyMessage;

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
                <div className="bg-[#14213D] p-3 border-2 border-[#14213D] w-80">
                    <p className="font-semibold text-sm text-center mb-3 text-[#D4BA71]">Review Your {personToReviewRole}</p>

                    <div className="text-center mb-3">
                        <p className="text-[11px] text-[#D4BA71] mb-2">
                            {isSenderHost
                                ? `We noticed you recently stayed with one of our hosts, Nest. We'd really appreciate it if you could leave a review - every review helps our hosts improve heir listings and reach more guests.`
                                : `We noticed ${otherParticipant?.name || "the guest"} recently stayed in your Nest! Please take a moment to leave a review — your feedback helps guests find future stays and helps hosts decide who to welcome next.`}
                        </p>
                    </div>

                    {/* Communication */}
                    <div className="flex justify-between items-center mb-2">
                        <p className="text-[12px] text-[#D4BA71]">Communication</p>
                        <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button disabled={isMyMessage} key={star} type="button" onClick={() => handleStarChange("communication", star)} className="text-xl">
                                    <Star className={`w-4 h-4 ${star <= ratingData.communication ? "fill-[#D4BA71] text-[#D4BA71]" : "fill-none text-[#D4BA71]"}`} />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Accuracy */}
                    <div className="flex justify-between items-center mb-2">
                        <p className="text-[12px] text-[#D4BA71]">Accuracy</p>
                        <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button disabled={isMyMessage} key={star} type="button" onClick={() => handleStarChange("accuracy", star)} className="text-xl">
                                    <Star className={`w-4 h-4 ${star <= ratingData.accuracy ? "fill-[#D4BA71] text-[#D4BA71]" : "fill-none text-[#D4BA71]"}`} />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Cleanliness */}
                    <div className="flex justify-between items-center mb-2">
                        <p className="text-[12px] text-[#D4BA71]">Cleanliness</p>
                        <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button disabled={isMyMessage} key={star} type="button" onClick={() => handleStarChange("cleanliness", star)} className="text-xl">
                                    <Star className={`w-4 h-4 ${star <= ratingData.cleanliness ? "fill-[#D4BA71] text-[#D4BA71]" : "fill-none text-[#D4BA71]"}`} />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Check-in Experience */}
                    <div className="flex justify-between items-center mb-2">
                        <p className="text-[12px] text-[#D4BA71]">Check-in Experience</p>
                        <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button disabled={isMyMessage} key={star} type="button" onClick={() => handleStarChange("checkInExperience", star)} className="text-xl">
                                    <Star className={`w-4 h-4 ${star <= ratingData.checkInExperience ? "fill-[#D4BA71] text-[#D4BA71]" : "fill-none text-[#D4BA71]"}`} />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Overall Experience */}
                    <div className="flex justify-between items-center mb-3">
                        <p className="text-[12px] font-semibold text-[#D4BA71]">Overall Experience</p>
                        <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button disabled={isMyMessage} key={star} type="button" onClick={() => handleStarChange("overallExperience", star)} className="text-xl">
                                    <Star className={`w-4 h-4 ${star <= ratingData.overallExperience ? "fill-[#D4BA71] text-[#D4BA71]" : "fill-none text-[#D4BA71]"}`} />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Description */}
                    <div className="mt-2 ">
                        <textarea value={ratingData.description} onChange={(e) => setRatingData((prev) => ({ ...prev, description: e.target.value }))} placeholder="Share your experience..." rows={3} className="w-full text-[11px] p-2 border border-[#D4BA71] rounded resize-none bg-transparent placeholder-[#D4BA71] text-[#D4BA71]" maxLength={500} />
                        <p className="text-[10px] text-[#D4BA71] text-right">{ratingData.description.length}/500</p>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-center mt-3">
                        <button onClick={handleSubmitReview} disabled={shouldDisableButton} className="border border-[#D4BA71] bg-[#D4BA71] text-white px-6 py-2 text-[10px] hover:bg-[#1a2a4a] transition-colors w-full cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
                            {isSubmitting ? "Submitting..." : "Submit Review"}
                        </button>
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

        // If guest, show the input form with calendar
        return (
            <div className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                {!isMe && <Avatar name={user?.name || "Unknown User"} size={30} className="mr-2" />}
                <div className="bg-[#D4BA71] p-3 border-2 border-[#14213D] w-80">
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

        const calculateDays = () => {
            if (!message.checkInDate || !message.checkOutDate) return "0 Night";

            const checkIn = new Date(message.checkInDate);
            const checkOut = new Date(message.checkOutDate);

            if (isNaN(checkIn.getTime()) || isNaN(checkOut.getTime())) return "0 Nights";

            const timeDiff = checkOut.getTime() - checkIn.getTime();
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

                    {!message?.bookingFeePaid ? <p className="text-center font-bold mb-2 text-[14px]">To Pay - £{message?.bookingFee}</p> : <p className="text-center font-bold mb-2 text-[14px]">To Pay - £{message?.agreedFee}</p>}

                    {user?._id === message.propertyId?.createdBy?._id ? (
                        // Property Owner View
                        !message?.bookingFeePaid ? (
                            // If bookingFeePaid false - Show only Reject Offer
                            <div className="flex justify-center mt-3 w-full">
                                <button onClick={handleRejectOffer} disabled={isRejecting} className="border border-black bg-[#16223D] text-white px-4 py-1 text-[8px] hover:bg-[#1a2a4a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-full max-w-[120px] cursor-pointer">
                                    {isRejecting ? "Rejecting..." : "Reject Offer"}
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
                        <p className="text-center mt-1 text-[9px]">Last one last step — pay the host and your nest for your next stay is all yours!</p>
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
                            <button className="border border-black bg-[#16223D] text-white px-4 py-1 text-[9px] hover:bg-[#1a2a4a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-full cursor-pointer">Message Guest</button>
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

    if (message.type === "system") {
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
                    {/* Use dangerouslySetInnerHTML for HTML content */}
                    <div className="rich-text-content text-[14px]" dangerouslySetInnerHTML={{ __html: message.text }} />
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

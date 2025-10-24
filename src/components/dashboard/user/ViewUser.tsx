// "use client";

// import { useState } from "react";
// import { Eye, MessageCircle } from "lucide-react";
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
// import { User } from "@/types/user";

// function UserAction({ user }: { user: User }) {
//     const [open, setOpen] = useState(false);

//     return (
//         <>
//             <button className="text-white hover:text-[#C9A94D]" onClick={() => setOpen(true)}>
//                 <Eye className="h-5 w-5" />
//             </button>

//             <Dialog open={open} onOpenChange={setOpen}>
//                 <DialogContent className="bg-[#2D3546] text-white border border-[#C9A94D] rounded-lg max-w-sm p-0 userdetails">
//                     <DialogHeader className="border-b border-[#C9A94D] p-4">
//                         <DialogTitle className="text-[#C9A94D] text-lg font-semibold flex items-center justify-between">
//                             <span>Result</span>
//                             <p>Host</p>
//                             <MessageCircle />
//                         </DialogTitle>
//                     </DialogHeader>

//                     <div className="mt-4 space-y-2 text-sm text-[#C9A94D] p-4">
//                         <div>{user.name}</div>
//                         <div>
//                             <span>Email:</span> {user.email}
//                         </div>
//                         <div>
//                             <span>Phone:</span> {user.phone}
//                         </div>
//                         <div>
//                             <span>Booking:</span> £4
//                         </div>
//                         <div>
//                             <span>Message:</span> £4
//                         </div>
//                         <div>
//                             <span>Earning:</span> £4
//                         </div>
//                         <div>
//                             <span>Guest Fees Spent:</span> £4
//                         </div>
//                     </div>

//                     {/* Bottom custom close button */}
//                     <div className="text-right p-4">
//                         <button className="px-4 py-2 bg-[#C9A94D] text-white rounded hover:bg-[#af8d28]" onClick={() => setOpen(false)}>
//                             Close
//                         </button>
//                     </div>
//                 </DialogContent>
//             </Dialog>
//         </>
//     );
// }

// export default UserAction;

"use client";

import { useState } from "react";
import { Eye, MessageCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { IUser } from "@/redux/features/users/usersApi";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useCreateConversationMutation } from "@/redux/features/messages/messageApi";

function UserAction({ user }: { user: IUser }) {
    const [open, setOpen] = useState(false);
    const [isChatLoading, setIsChatLoading] = useState(false);
    const router = useRouter();

    const [createConversation] = useCreateConversationMutation();

    // Format date
    const formatDate = (dateString?: string) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString();
    };

    // Get status badge
    const getStatusBadge = (isActive: boolean) => {
        return isActive ? <span className="px-2 py-1 bg-green-500 text-white rounded-full text-xs">Active</span> : <span className="px-2 py-1 bg-red-500 text-white rounded-full text-xs">Inactive</span>;
    };

    // Get role badge
    const getRoleBadge = (role: string) => {
        const roleColors = {
            ADMIN: "bg-red-500",
            HOST: "bg-blue-500",
            GUEST: "bg-green-500",
        };

        return <span className={`px-2 py-1 ${roleColors[role as keyof typeof roleColors] || "bg-gray-500"} text-white rounded-full text-xs`}>{role}</span>;
    };

    const handleChatWithUser = async () => {
        if (!user?._id) {
            console.error("❌ User information not available");
            toast.error("User information not available");
            return;
        }

        setIsChatLoading(true);

        try {
            const result = await createConversation({
                participants: [user._id],
                // No propertyId needed for user-to-user chat
            }).unwrap();

            console.log("✅ Conversation created:", result);
            toast.success("Conversation started successfully");

            // Close the dialog and redirect to messages
            setOpen(false);
            router.push("/messages");
        } catch (error: any) {
            console.error("❌ Failed to start chat:", error);
            toast.error(error?.data?.message || "Failed to start conversation");
        } finally {
            setIsChatLoading(false);
        }
    };

    return (
        <>
            <button className="text-white hover:text-[#C9A94D]" onClick={() => setOpen(true)}>
                <Eye className="h-5 w-5" />
            </button>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="bg-[#2D3546] text-white border border-[#C9A94D] rounded-lg max-w-md p-0 userdetails">
                    <DialogHeader className="border-b border-[#C9A94D] p-4">
                        <DialogTitle className="text-[#C9A94D] text-lg font-semibold flex items-center justify-between">
                            <span>User Details</span>
                            <div className="flex items-center gap-2">
                                {getRoleBadge(user.role)}
                                <button onClick={handleChatWithUser} disabled={isChatLoading} className="text-[#C9A94D] hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed" title="Send message to this user">
                                    <MessageCircle className="h-5 w-5" />
                                </button>
                            </div>
                        </DialogTitle>
                    </DialogHeader>

                    <div className="mt-4 space-y-3 text-sm p-4">
                        {/* User Information */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="text-[#C9A94D] font-medium">Name:</div>
                            <div className="text-white">{user.name}</div>

                            <div className="text-[#C9A94D] font-medium">Email:</div>
                            <div className="text-white">{user.email}</div>

                            <div className="text-[#C9A94D] font-medium">Phone:</div>
                            <div className="text-white">{user.phone || "N/A"}</div>

                            <div className="text-[#C9A94D] font-medium">Status:</div>
                            <div className="text-white">{getStatusBadge(user.isActive)}</div>

                            <div className="text-[#C9A94D] font-medium">Role:</div>
                            <div className="text-white">{getRoleBadge(user.role)}</div>

                            <div className="text-[#C9A94D] font-medium">Email Verified:</div>
                            <div className="text-white">{user.isEmailVerified ? <span className="text-green-500">Yes</span> : <span className="text-red-500">No</span>}</div>

                            <div className="text-[#C9A94D] font-medium">Created At:</div>
                            <div className="text-white">{formatDate(user.createdAt)}</div>

                            {/* <div className="text-[#C9A94D] font-medium">Last Login:</div>
                            <div className="text-white">{formatDate(user.lastLogin)}</div> */}
                        </div>

                        {/* Additional Stats (if needed) */}
                        {/* <div className="border-t border-[#C9A94D] pt-3 mt-3">
                            <h4 className="text-[#C9A94D] font-medium mb-2">Statistics</h4>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                                <div className="text-[#C9A94D]">Total Bookings:</div>
                                <div className="text-white">N/A</div>

                                <div className="text-[#C9A94D]">Messages:</div>
                                <div className="text-white">N/A</div>

                                <div className="text-[#C9A94D]">Earnings:</div>
                                <div className="text-white">N/A</div>

                                <div className="text-[#C9A94D]">Fees Spent:</div>
                                <div className="text-white">N/A</div>
                            </div>
                        </div> */}
                    </div>

                    {/* Bottom custom close button */}
                    <div className="text-right p-4 border-t border-[#C9A94D]">
                        <button className="px-6 py-2 bg-[#C9A94D] text-white rounded-lg hover:bg-[#af8d28] transition-colors" onClick={() => setOpen(false)}>
                            Close
                        </button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}

export default UserAction;

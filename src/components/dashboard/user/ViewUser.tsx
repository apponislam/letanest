// "use client";

// import { useState } from "react";
// import { Eye, MessageCircle, UserCog, Trash2 } from "lucide-react";
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
// import { IUser, useChangeUserRoleMutation, useDeleteUserMutation } from "@/redux/features/users/usersApi";
// import { useRouter } from "next/navigation";
// import { toast } from "sonner";
// import { useCreateConversationMutation } from "@/redux/features/messages/messageApi";
// import Swal from "sweetalert2";

// function UserAction({ user }: { user: IUser }) {
//     const [open, setOpen] = useState(false);
//     const [isChatLoading, setIsChatLoading] = useState(false);
//     const [isRoleChanging, setIsRoleChanging] = useState(false);
//     const [isDeleting, setIsDeleting] = useState(false);
//     const [showRoleSelector, setShowRoleSelector] = useState(false);
//     const router = useRouter();

//     const [createConversation] = useCreateConversationMutation();
//     const [changeUserRole] = useChangeUserRoleMutation();
//     const [deleteUser] = useDeleteUserMutation();

//     // Format date
//     const formatDate = (dateString?: string) => {
//         if (!dateString) return "N/A";
//         return new Date(dateString).toLocaleDateString();
//     };

//     // Get status badge
//     const getStatusBadge = (isActive: boolean) => {
//         return isActive ? <span className="px-2 py-1 bg-green-500 text-white rounded-full text-xs">Active</span> : <span className="px-2 py-1 bg-red-500 text-white rounded-full text-xs">Deleted</span>;
//     };

//     // Get role badge
//     const getRoleBadge = (role: string) => {
//         const roleColors = {
//             ADMIN: "bg-red-500",
//             HOST: "bg-blue-500",
//             GUEST: "bg-green-500",
//         };

//         return <span className={`px-2 py-1 ${roleColors[role as keyof typeof roleColors] || "bg-gray-500"} text-white rounded-full text-xs`}>{role}</span>;
//     };

//     const handleChatWithUser = async () => {
//         if (!user?._id) {
//             console.error("❌ User information not available");
//             toast.error("User information not available");
//             return;
//         }

//         setIsChatLoading(true);

//         try {
//             const result = await createConversation({
//                 participants: [user._id],
//                 // No propertyId needed for user-to-user chat
//             }).unwrap();

//             console.log("✅ Conversation created:", result);
//             toast.success("Conversation started successfully");

//             // Close the dialog and redirect to messages
//             setOpen(false);
//             router.push("/messages");
//         } catch (error: any) {
//             console.error("❌ Failed to start chat:", error);
//             toast.error(error?.data?.message || "Failed to start conversation");
//         } finally {
//             setIsChatLoading(false);
//         }
//     };

//     const handleChangeRole = async (newRole: "GUEST" | "HOST" | "ADMIN") => {
//         if (!user?._id) {
//             toast.error("User information not available");
//             return;
//         }

//         // Don't change if same role
//         if (user.role === newRole) {
//             toast.info(`User is already ${newRole}`);
//             setShowRoleSelector(false);
//             return;
//         }

//         setIsRoleChanging(true);

//         try {
//             const result = await changeUserRole({
//                 userId: user._id,
//                 newRole: newRole,
//             }).unwrap();

//             console.log("✅ Role changed successfully:", result);
//             toast.success(`User role changed to ${newRole} successfully`);

//             // Close the dialog and refresh the page
//             setOpen(false);
//         } catch (error: any) {
//             console.error("❌ Failed to change role:", error);
//             toast.error(error?.data?.message || "Failed to change user role");
//         } finally {
//             setIsRoleChanging(false);
//             setShowRoleSelector(false);
//         }
//     };

//     const handleDeleteUser = async () => {
//         if (!user?._id) {
//             toast.error("User information not available");
//             return;
//         }

//         setOpen(false);

//         const result = await Swal.fire({
//             title: "Are you sure?",
//             text: "You won't be able to revert this! This user will be permanently deleted from the system.",
//             icon: "warning",
//             showCancelButton: true,
//             confirmButtonColor: "#d33",
//             cancelButtonColor: "#3085d6",
//             confirmButtonText: "Yes, delete it!",
//             cancelButtonText: "Cancel",
//             background: "#2D3546",
//             color: "#ffffff",
//             iconColor: "#C9A94D",
//             customClass: {
//                 confirmButton: "bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg",
//                 cancelButton: "bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg",
//             },
//         });

//         if (!result.isConfirmed) {
//             return;
//         }
//         setIsDeleting(true);
//         try {
//             const result = await deleteUser({
//                 userId: user._id,
//             }).unwrap();

//             console.log("✅ User deleted successfully:", result);

//             // Show success SweetAlert
//             await Swal.fire({
//                 title: "Deleted!",
//                 text: "User has been deleted successfully.",
//                 icon: "success",
//                 confirmButtonColor: "#C9A94D",
//                 background: "#2D3546",
//                 color: "#ffffff",
//                 iconColor: "#C9A94D",
//             });

//             setOpen(false);
//         } catch (error: any) {
//             console.error("❌ Failed to delete user:", error);

//             // Show error SweetAlert
//             await Swal.fire({
//                 title: "Error!",
//                 text: error?.data?.message || "Failed to delete user",
//                 icon: "error",
//                 confirmButtonColor: "#d33",
//                 background: "#2D3546",
//                 color: "#ffffff",
//                 iconColor: "#C9A94D",
//             });
//         } finally {
//             setIsDeleting(false);
//         }
//     };

//     const handleViewConversation = (userId?: string) => {
//         if (userId) {
//             router.push(`/dashboard/user/${userId}`);
//         } else {
//             toast.error("No conversation available");
//         }
//     };

//     return (
//         <>
//             <button className="text-white hover:text-[#C9A94D]" onClick={() => setOpen(true)}>
//                 <Eye className="h-5 w-5" />
//             </button>

//             <Dialog open={open} onOpenChange={setOpen}>
//                 <DialogContent className="bg-[#2D3546] text-white border border-[#C9A94D] rounded-lg max-w-md p-0 userdetails">
//                     <DialogHeader className="border-b border-[#C9A94D] p-4">
//                         <DialogTitle className="text-[#C9A94D] text-lg font-semibold flex items-center justify-between">
//                             <span>User Details</span>
//                             <div className="flex items-center gap-2">
//                                 {getRoleBadge(user.role)}
//                                 <button onClick={handleChatWithUser} disabled={isChatLoading} className="text-[#C9A94D] hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed" title="Send message to this user">
//                                     <MessageCircle className="h-5 w-5" />
//                                 </button>
//                             </div>
//                         </DialogTitle>
//                     </DialogHeader>

//                     <div className="mt-4 space-y-3 text-sm p-4">
//                         {/* User Information */}
//                         <div className="grid grid-cols-2 gap-4">
//                             <div className="text-[#C9A94D] font-medium">Name:</div>
//                             <div className="text-white">{user.name}</div>

//                             <div className="text-[#C9A94D] font-medium">Email:</div>
//                             <div className="text-white">{user.email}</div>

//                             <div className="text-[#C9A94D] font-medium">Phone:</div>
//                             <div className="text-white">{user.phone || "N/A"}</div>

//                             <div className="text-[#C9A94D] font-medium">Status:</div>
//                             <div className="text-white">{getStatusBadge(user.isActive)}</div>

//                             <div className="text-[#C9A94D] font-medium">Role:</div>
//                             <div className="text-white">{getRoleBadge(user.role)}</div>

//                             <div className="text-[#C9A94D] font-medium">Email Verified:</div>
//                             <div className="text-white">{user.isEmailVerified ? <span className="text-green-500">Yes</span> : <span className="text-red-500">No</span>}</div>

//                             <div className="text-[#C9A94D] font-medium">Created At:</div>
//                             <div className="text-white">{formatDate(user.createdAt)}</div>
//                         </div>

//                         {/* Mutation Buttons */}
//                         <div className="flex flex-col gap-3 mt-4 pt-4 border-t border-gray-600">
//                             {!showRoleSelector ? (
//                                 <div className="flex gap-2">
//                                     <button onClick={() => setShowRoleSelector(true)} disabled={isRoleChanging} className="flex items-center gap-2 px-3 py-2 bg-[#C9A94D] text-white rounded-lg hover:bg-[#af8d28] transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium" title="Change user role">
//                                         <UserCog className="h-4 w-4" />
//                                         Change Role
//                                     </button>

//                                     <button onClick={handleDeleteUser} disabled={isDeleting} className="flex items-center gap-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium" title="Permanently delete user">
//                                         <Trash2 className="h-4 w-4" />
//                                         {isDeleting ? "Deleting..." : "Delete User"}
//                                     </button>
//                                 </div>
//                             ) : (
//                                 <div className="space-y-2">
//                                     <div className="text-[#C9A94D] text-sm font-medium">Select New Role:</div>
//                                     <div className="flex gap-2 flex-wrap">
//                                         {(["GUEST", "HOST", "ADMIN"] as const).map((role) => (
//                                             <button
//                                                 key={role}
//                                                 onClick={() => handleChangeRole(role)}
//                                                 disabled={isRoleChanging}
//                                                 className={`px-3 py-2 rounded-lg text-sm transition-colors font-medium ${user.role === role ? "bg-[#C9A94D] text-white cursor-not-allowed font-semibold" : "bg-[#3A4556] text-white hover:bg-[#4A5568] border border-[#C9A94D]"} disabled:opacity-50 disabled:cursor-not-allowed`}
//                                             >
//                                                 {role}
//                                                 {isRoleChanging && "..."}
//                                             </button>
//                                         ))}
//                                         <button onClick={() => setShowRoleSelector(false)} className="px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium border border-gray-500">
//                                             Cancel
//                                         </button>
//                                     </div>
//                                 </div>
//                             )}
//                         </div>
//                     </div>

//                     <div className="text-right p-4 border-t border-[#C9A94D] flex items-center justify-between">
//                         <button className="px-6 py-2 border-2 border-[#C9A94D] text-[#C9A94D] bg-transparent rounded-lg hover:bg-[#C9A94D] hover:text-white transition-colors" onClick={() => handleViewConversation(user?._id)}>
//                             View Conversations
//                         </button>

//                         <button className="px-6 py-2 bg-[#C9A94D] text-white rounded-lg hover:bg-[#af8d28] transition-colors" onClick={() => setOpen(false)}>
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
import { Eye, MessageCircle, UserCog, Trash2, Key, EyeOff } from "lucide-react"; // Added Key icon
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { IUser, useChangeUserRoleMutation, useDeleteUserMutation } from "@/redux/features/users/usersApi";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useCreateConversationMutation } from "@/redux/features/messages/messageApi";
import Swal from "sweetalert2";
import { useSetUserPasswordByAdminMutation } from "@/redux/features/auth/authApi";

function UserAction({ user }: { user: IUser }) {
    const [open, setOpen] = useState(false);
    const [isChatLoading, setIsChatLoading] = useState(false);
    const [isRoleChanging, setIsRoleChanging] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [showRoleSelector, setShowRoleSelector] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false); // New state for password modal
    const [newPassword, setNewPassword] = useState(""); // New state for password input
    const [confirmPassword, setConfirmPassword] = useState(""); // New state for confirm password
    const [isSettingPassword, setIsSettingPassword] = useState(false); // New state for loading
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const router = useRouter();

    const [createConversation] = useCreateConversationMutation();
    const [changeUserRole] = useChangeUserRoleMutation();
    const [deleteUser] = useDeleteUserMutation();
    const [setUserPasswordByAdmin] = useSetUserPasswordByAdminMutation();

    // Format date
    const formatDate = (dateString?: string) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString();
    };

    // Get status badge
    const getStatusBadge = (isActive: boolean) => {
        return isActive ? <span className="px-2 py-1 bg-green-500 text-white rounded-full text-xs">Active</span> : <span className="px-2 py-1 bg-red-500 text-white rounded-full text-xs">Deleted</span>;
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

    const handleChangeRole = async (newRole: "GUEST" | "HOST" | "ADMIN") => {
        if (!user?._id) {
            toast.error("User information not available");
            return;
        }

        // Don't change if same role
        if (user.role === newRole) {
            toast.info(`User is already ${newRole}`);
            setShowRoleSelector(false);
            return;
        }

        setIsRoleChanging(true);

        try {
            const result = await changeUserRole({
                userId: user._id,
                newRole: newRole,
            }).unwrap();

            console.log("✅ Role changed successfully:", result);
            toast.success(`User role changed to ${newRole} successfully`);

            // Close the dialog and refresh the page
            setOpen(false);
        } catch (error: any) {
            console.error("❌ Failed to change role:", error);
            toast.error(error?.data?.message || "Failed to change user role");
        } finally {
            setIsRoleChanging(false);
            setShowRoleSelector(false);
        }
    };

    const handleDeleteUser = async () => {
        if (!user?._id) {
            toast.error("User information not available");
            return;
        }

        setOpen(false);

        const result = await Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this! This user will be permanently deleted from the system.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "Cancel",
            background: "#2D3546",
            color: "#ffffff",
            iconColor: "#C9A94D",
            customClass: {
                confirmButton: "bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg",
                cancelButton: "bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg",
            },
        });

        if (!result.isConfirmed) {
            return;
        }
        setIsDeleting(true);
        try {
            const result = await deleteUser({
                userId: user._id,
            }).unwrap();

            console.log("✅ User deleted successfully:", result);

            // Show success SweetAlert
            await Swal.fire({
                title: "Deleted!",
                text: "User has been deleted successfully.",
                icon: "success",
                confirmButtonColor: "#C9A94D",
                background: "#2D3546",
                color: "#ffffff",
                iconColor: "#C9A94D",
            });

            setOpen(false);
        } catch (error: any) {
            console.error("❌ Failed to delete user:", error);

            // Show error SweetAlert
            await Swal.fire({
                title: "Error!",
                text: error?.data?.message || "Failed to delete user",
                icon: "error",
                confirmButtonColor: "#d33",
                background: "#2D3546",
                color: "#ffffff",
                iconColor: "#C9A94D",
            });
        } finally {
            setIsDeleting(false);
        }
    };

    // New function to handle setting password
    const handleSetPassword = async () => {
        if (!user?._id) {
            toast.error("User information not available");
            return;
        }

        // Validate passwords
        if (!newPassword.trim()) {
            toast.error("Please enter a new password");
            return;
        }

        if (newPassword.length < 6) {
            toast.error("Password must be at least 6 characters");
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        setIsSettingPassword(true);

        try {
            const result = await setUserPasswordByAdmin({
                userId: user._id,
                newPassword: newPassword,
            }).unwrap();

            console.log("✅ Password set successfully:", result);
            toast.success("Password has been set successfully");

            // Reset form and close modals
            setNewPassword("");
            setConfirmPassword("");
            setShowPasswordModal(false);
            setOpen(false);

            // Show success message
            Swal.fire({
                title: "Success!",
                text: "Password has been set successfully. The user will receive an email with the new password.",
                icon: "success",
                confirmButtonColor: "#C9A94D",
                background: "#2D3546",
                color: "#ffffff",
                iconColor: "#C9A94D",
            });
        } catch (error: any) {
            console.error("❌ Failed to set password:", error);
            toast.error(error?.data?.message || "Failed to set password");
        } finally {
            setIsSettingPassword(false);
        }
    };

    const handleViewConversation = (userId?: string) => {
        if (userId) {
            router.push(`/dashboard/user/${userId}`);
        } else {
            toast.error("No conversation available");
        }
    };

    return (
        <>
            <button className="text-white hover:text-[#C9A94D]" onClick={() => setOpen(true)}>
                <Eye className="h-5 w-5" />
            </button>

            {/* Main User Details Modal */}
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

                            <div className="text-[#C9A94D] font-medium break-words overflow-wrap-anywhere">Email:</div>
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
                        </div>

                        {/* Mutation Buttons */}
                        <div className="flex flex-col gap-3 mt-4 pt-4 border-t border-gray-600">
                            {!showRoleSelector ? (
                                <div className="flex gap-2 flex-wrap">
                                    <button onClick={() => setShowRoleSelector(true)} disabled={isRoleChanging} className="flex items-center gap-2 px-3 py-2 bg-[#C9A94D] text-white rounded-lg hover:bg-[#af8d28] transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium" title="Change user role">
                                        <UserCog className="h-4 w-4" />
                                        Change Role
                                    </button>

                                    <button
                                        onClick={() => setShowPasswordModal(true)} // Open password modal
                                        className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                                        title="Set new password for user"
                                    >
                                        <Key className="h-4 w-4" />
                                        Set New Password
                                    </button>

                                    <button onClick={handleDeleteUser} disabled={isDeleting} className="flex items-center gap-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium" title="Permanently delete user">
                                        <Trash2 className="h-4 w-4" />
                                        {isDeleting ? "Deleting..." : "Delete User"}
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    <div className="text-[#C9A94D] text-sm font-medium">Select New Role:</div>
                                    <div className="flex gap-2 flex-wrap">
                                        {(["GUEST", "HOST", "ADMIN"] as const).map((role) => (
                                            <button
                                                key={role}
                                                onClick={() => handleChangeRole(role)}
                                                disabled={isRoleChanging}
                                                className={`px-3 py-2 rounded-lg text-sm transition-colors font-medium ${user.role === role ? "bg-[#C9A94D] text-white cursor-not-allowed font-semibold" : "bg-[#3A4556] text-white hover:bg-[#4A5568] border border-[#C9A94D]"} disabled:opacity-50 disabled:cursor-not-allowed`}
                                            >
                                                {role}
                                                {isRoleChanging && "..."}
                                            </button>
                                        ))}
                                        <button onClick={() => setShowRoleSelector(false)} className="px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium border border-gray-500">
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="text-right p-4 border-t border-[#C9A94D] flex items-center justify-between">
                        <button className="px-6 py-2 border-2 border-[#C9A94D] text-[#C9A94D] bg-transparent rounded-lg hover:bg-[#C9A94D] hover:text-white transition-colors" onClick={() => handleViewConversation(user?._id)}>
                            View Conversations
                        </button>

                        <button className="px-6 py-2 bg-[#C9A94D] text-white rounded-lg hover:bg-[#af8d28] transition-colors" onClick={() => setOpen(false)}>
                            Close
                        </button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Password Set Modal */}
            <Dialog open={showPasswordModal} onOpenChange={setShowPasswordModal}>
                <DialogContent className="bg-[#2D3546] text-white border border-[#C9A94D] rounded-lg max-w-md p-0">
                    <DialogHeader className="border-b border-[#C9A94D] p-4">
                        <DialogTitle className="text-[#C9A94D] text-lg font-semibold flex items-center gap-2">
                            <Key className="h-5 w-5" />
                            Set New Password for {user.name}
                        </DialogTitle>
                    </DialogHeader>

                    <div className="p-6 space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm text-gray-300">New Password</label>
                            <div className="relative">
                                <input type={showNewPassword ? "text" : "password"} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Enter new password" className="w-full px-3 py-2 bg-[#1A202C] border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#C9A94D] focus:border-transparent pr-10" disabled={isSettingPassword} />
                                <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#D4BA71] hover:text-[#C9A94D]" disabled={isSettingPassword}>
                                    {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                            <p className="text-xs text-gray-400">Password must be at least 6 characters</p>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm text-gray-300">Confirm Password</label>
                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Confirm new password"
                                    className="w-full px-3 py-2 bg-[#1A202C] border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#C9A94D] focus:border-transparent pr-10"
                                    disabled={isSettingPassword}
                                />
                                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#D4BA71] hover:text-[#C9A94D]" disabled={isSettingPassword}>
                                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>

                        <div className="bg-yellow-900/20 border border-yellow-700/50 rounded-lg p-3">
                            <p className="text-sm text-yellow-200">⚠️ The user will receive an email with this new password. They should change it immediately after login.</p>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 p-4 border-t border-[#C9A94D]">
                        <button
                            onClick={() => {
                                setShowPasswordModal(false);
                                setNewPassword("");
                                setConfirmPassword("");
                                setShowNewPassword(false);
                                setShowConfirmPassword(false);
                            }}
                            className="px-4 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
                            disabled={isSettingPassword}
                        >
                            Cancel
                        </button>
                        <button onClick={handleSetPassword} disabled={isSettingPassword || !newPassword || !confirmPassword} className="px-4 py-2 bg-[#C9A94D] text-white rounded-lg hover:bg-[#af8d28] transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                            {isSettingPassword ? "Setting Password..." : "Set New Password"}
                        </button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}

export default UserAction;

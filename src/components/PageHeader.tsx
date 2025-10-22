"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useAppSelector } from "@/redux/hooks";
import { currentUser, logOut } from "@/redux/features/auth/authSlice";
import Avatar from "@/utils/Avatar";
import { useDispatch } from "react-redux";
import { useLogoutMutation } from "@/redux/features/auth/authApi";
import { toast } from "sonner";
import { useGetMyProfileQuery } from "@/redux/features/users/usersApi";

interface PageHeaderProps {
    title?: string;
    isUser?: boolean;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title = "Dashboard", isUser = true }) => {
    const router = useRouter();
    const user = useAppSelector(currentUser);
    const dispatch = useDispatch();
    const [logout] = useLogoutMutation();
    const { data: myprofile } = useGetMyProfileQuery();
    console.log(myprofile);

    const handleLogout = async () => {
        const loadingToast = toast.loading("Logging out...");
        try {
            await logout().unwrap(); // RTK Query mutation
            dispatch(logOut()); // use your slice's action
            toast.success("Logged out successfully!", { id: loadingToast });

            router.push("/"); // optional redirect
        } catch (err: any) {
            toast.error(err?.data?.message || "Logout failed", { id: loadingToast });
        }
    };

    return (
        <div className="p-5 border border-[#C9A94D] flex justify-between items-center mb-6 flex-col md:flex-row gap-4">
            <div className="text-[#C9A94D] flex items-center gap-3 text-[18px] cursor-pointer hover:underline" onClick={() => router.back()}>
                <ArrowLeft />
                <p>Back To Previous</p>
            </div>

            <h1 className="text-2xl text-[#C9A94D]">{title}</h1>

            {isUser && (
                <>
                    {user ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <div className="flex items-center gap-2 cursor-pointer">
                                    {user?.profileImg ? <Image src={`${process.env.NEXT_PUBLIC_BASE_API}${user.profileImg}`} alt={user.name || "User"} width={30} height={30} className="rounded-full border-[0.3px] border-[#C9A94D] object-cover h-[30px] w-[30px]" /> : <Avatar name={user?.name || "User"} size={30} />}
                                    <div className="flex flex-col items-start">
                                        <div className="text-[#C9A94D] text-[18px] leading-none">{user?.name || "User"}</div>
                                        {myprofile?.data.subscriptions.activeSubscriptions[0]?.subscription?.subscription?.badge && <button className="bg-[#C9A94D] text-white px-2 rounded-[20px] text-[12px] w-auto">{myprofile.data.subscriptions.activeSubscriptions[0].subscription.subscription.badge}</button>}
                                    </div>
                                </div>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent className="bg-[#14213D] text-white border border-[#C9A94D] w-48 p-0 rounded-none">
                                <Link href="/dashboard/profile">
                                    <DropdownMenuItem className="flex items-center gap-2 hover:bg-[#C9A94D]/30 focus:bg-[#C9A94D]/30 focus:text-white rounded-none border-b border-[#C9A94D]">
                                        <Image alt="Profile" src="/dashboard/user-eye.png" height={24} width={24} />
                                        View Profile
                                    </DropdownMenuItem>
                                </Link>
                                <DropdownMenuItem onClick={handleLogout} className="flex items-center gap-2 hover:bg-[#C9A94D]/30 focus:bg-[#C9A94D]/30 focus:text-white rounded-none">
                                    <Image alt="Logout" src="/dashboard/logout.png" height={24} width={24} />
                                    Logout
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <div className="flex items-center gap-2 cursor-pointer">
                            <Image src={"/home/avatar.jpg"} alt={"Guest"} width={30} height={30} className="rounded-full border-[0.3px] border-[#C9A94D] object-cover" />
                            <div className="text-[#C9A94D] text-[18px]">{"Guest"}</div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default PageHeader;

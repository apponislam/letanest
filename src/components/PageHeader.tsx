"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Host } from "@/types/host";

interface PageHeaderProps {
    title?: string;
    isHost?: boolean;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title = "Dashboard", isHost = true }) => {
    const router = useRouter();
    const [host, setHost] = useState<Host | null>(null);

    useEffect(() => {
        if (isHost) {
            const fetchHost = async () => {
                try {
                    const res = await fetch("/data/host.json");
                    const data: Host[] = await res.json();
                    setHost(data[0]);
                } catch (error) {
                    console.error("Failed to fetch host:", error);
                }
            };
            fetchHost();
        }
    }, [isHost]);

    return (
        <div className="p-5 border border-[#C9A94D] flex justify-between items-center mb-6 flex-col md:flex-row gap-4">
            <div className="text-[#C9A94D] flex items-center gap-3 text-[18px] cursor-pointer hover:underline" onClick={() => router.back()}>
                <ArrowLeft />
                <p>Back To Previous</p>
            </div>

            <h1 className="text-2xl text-[#C9A94D]">{title}</h1>

            {isHost && (
                <>
                    {host ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <div className="flex items-center gap-2 cursor-pointer">
                                    <Image
                                        src={host.image || "/home/avatar.jpg"} // fallback image
                                        alt={host.name || "Host"}
                                        width={30}
                                        height={30}
                                        className="rounded-full border-[0.3px] border-[#C9A94D] object-cover"
                                    />
                                    <div className="text-[#C9A94D] text-[18px]">{host.name || "Host"}</div>
                                </div>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent className="bg-[#14213D] text-white border border-[#C9A94D] w-48 p-0 rounded-none">
                                <Link href="/dashboard/profile">
                                    <DropdownMenuItem className="flex items-center gap-2 hover:bg-[#C9A94D]/30 focus:bg-[#C9A94D]/30 focus:text-white rounded-none border-b border-[#C9A94D]">
                                        <Image alt="Profile" src="/dashboard/user-eye.png" height={24} width={24} />
                                        View Profile
                                    </DropdownMenuItem>
                                </Link>
                                <DropdownMenuItem className="flex items-center gap-2 hover:bg-[#C9A94D]/30 focus:bg-[#C9A94D]/30 focus:text-white rounded-none">
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

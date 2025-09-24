"use client";
import React, { useEffect, useState } from "react";
import { Host } from "@/types/host";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import AddListingForm from "@/components/forms/listing/AddListingForm";

const AddListing = () => {
    const router = useRouter();

    const handleClick = () => {
        router.back();
    };

    const [host, setHost] = useState<Host | null>(null);

    useEffect(() => {
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
    }, []);

    if (!host) return <p>Loading...</p>;

    return (
        <div className="container mx-auto">
            <div className="p-5 border border-[#C9A94D] flex justify-between items-center mb-8 flex-col md:flex-row gap-4">
                <div className="text-[#C9A94D] flex items-center gap-3 text-[18px] cursor-pointer hover:underline" onClick={handleClick}>
                    <ArrowLeft />
                    <p>Back To Previous</p>
                </div>
                <h1 className="text-2xl text-[#C9A94D]">Dashboard</h1>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <div className="flex items-center gap-2 cursor-pointer">
                            <Image src={host.image} alt={host.name} width={30} height={30} className="rounded-full border-[0.3px] border-[#C9A94D] object-cover" />
                            <div className="text-[#C9A94D] text-[18px]">{host.role}</div>
                        </div>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent className="bg-[#14213D] text-white border border-[#C9A94D] w-48 p-0 rounded-none">
                        <Link href="/dashboard/profile">
                            <DropdownMenuItem className="flex items-center gap-2 hover:bg-[#C9A94D]/30 focus:bg-[#C9A94D]/30 focus:text-white rounded-none border-b border-[#C9A94D]">
                                <Image alt="Logout" src="/dashboard/user-eye.png" height={24} width={24}></Image>
                                View Profile
                            </DropdownMenuItem>
                        </Link>
                        <DropdownMenuItem className="flex items-center gap-2 hover:bg-[#C9A94D]/30 focus:bg-[#C9A94D]/30 focus:text-white rounded-none">
                            <Image alt="Logout" src="/dashboard/logout.png" height={24} width={24}></Image>
                            Logout
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <div>
                <AddListingForm></AddListingForm>
            </div>
        </div>
    );
};

export default AddListing;

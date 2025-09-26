"use client";
import React, { useEffect, useState } from "react";
import { Host } from "@/types/host";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { EllipsisVertical } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const PropertyManagement = () => {
    const router = useRouter();
    const [host, setHost] = useState<Host | null>(null);

    useEffect(() => {
        const fetchHost = async () => {
            try {
                const res = await fetch("/data/host.json");
                const data: Host[] = await res.json();
                setHost(data[0]);
            } catch (error) {
                console.error(error);
            }
        };
        fetchHost();
    }, []);

    if (!host) return <p>Loading...</p>;

    return (
        <div className="container mx-auto">
            <div className="p-5 border border-[#C9A94D] flex justify-between items-center mb-6 flex-col md:flex-row gap-4">
                <div className="text-[#C9A94D] flex items-center gap-3 text-[18px] cursor-pointer hover:underline" onClick={() => router.back()}>
                    <ArrowLeft />
                    <p>Back To Previous</p>
                </div>
                <h1 className="text-2xl text-[#C9A94D]">Dashboard</h1>
                <div className="flex items-center gap-2">
                    <Image src={host.image} alt={host.name} width={30} height={30} className="rounded-full border-[0.3px] border-[#C9A94D] object-cover" />
                    <div className="text-[#C9A94D] text-[18px]">{host.role}</div>
                </div>
            </div>

            <div className="w-full">
                <div className="bg-[#2D3546] border border-[#C9A94D] p-4 md:p-9 text-[#C9A94D] rounded-[20px] space-y-4">
                    <div className="flex justify-between items-center">
                        <span className=" text-[#C9A94D] text-[28px]">Review</span>

                        <div className="flex items-center gap-2">
                            <span className="text-[#C9A94D] text-[28px]">Sort By:</span>
                            <Select>
                                <SelectTrigger className="bg-[#434D64] border border-[#C9A94D] text-[#C9A94D] rounded-[10px] w-36">
                                    <SelectValue placeholder="Select" />
                                </SelectTrigger>

                                <SelectContent className="bg-[#2D3546] border border-[#C9A94D] text-white rounded-[10px]">
                                    <SelectItem value="date">Date</SelectItem>
                                    <SelectItem value="rating">Rating</SelectItem>
                                    <SelectItem value="price_low">Price: Low to High</SelectItem>
                                    <SelectItem value="price_high">Price: High to Low</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="p-3 rounded-[12px] flex justify-between items-center border border-[#C9A94D]">
                            <div className="flex items-center gap-4">
                                <Image src="/listing/bedroompic.png" alt="Bed Room Pic" width={116} height={92}></Image>
                                <div>
                                    <p className="font-semibold">Town City</p>
                                    <p className="text-sm">2024-01-01 - 2024-01-10</p>
                                    <p>2 Guest · $450</p>
                                </div>
                            </div>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button className="p-2 rounded-full bg-[#434D64]">
                                        <EllipsisVertical className="w-5 h-5 text-white" />
                                    </button>
                                </DropdownMenuTrigger>

                                <DropdownMenuContent className="bg-[#14213D] text-white rounded-[10px] w-48 flex flex-col gap-[14px] p-5 border-none">
                                    <DropdownMenuItem className="bg-[#D00000] text-white hover:bg-[#D00000] focus:bg-[#D00000] justify-center focus:text-white rounded-[20px]">
                                        <span className="w-full text-center">Cancel</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="bg-[#C9A94D] text-white hover:bg-[#C9A94D] focus:bg-[#C9A94D] justify-center focus:text-white rounded-[20px]">
                                        <span className="w-full text-center">Approve</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="bg-[#135E9A] text-white hover:bg-[#135E9A] focus:bg-[#135E9A] justify-center focus:text-white rounded-[20px]">
                                        <span className="w-full text-center">Hide / Hold</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                        <div className="p-3 rounded-[12px] flex justify-between items-center border border-[#C9A94D]">
                            <div className="flex items-center gap-4">
                                <Image src="/listing/bedroompic.png" alt="Bed Room Pic" width={116} height={92}></Image>
                                <div>
                                    <p className="font-semibold">Town City</p>
                                    <p className="text-sm">2024-01-01 - 2024-01-10</p>
                                    <p>2 Guest · $450</p>
                                </div>
                            </div>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button className="p-2 rounded-full bg-[#434D64]">
                                        <EllipsisVertical className="w-5 h-5 text-white" />
                                    </button>
                                </DropdownMenuTrigger>

                                <DropdownMenuContent className="bg-[#14213D] text-white rounded-[10px] w-48 flex flex-col gap-[14px] p-5 border-none">
                                    <DropdownMenuItem className="bg-[#D00000] text-white hover:bg-[#D00000] focus:bg-[#D00000] justify-center focus:text-white rounded-[20px]">
                                        <span className="w-full text-center">Cancel</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="bg-[#C9A94D] text-white hover:bg-[#C9A94D] focus:bg-[#C9A94D] justify-center focus:text-white rounded-[20px]">
                                        <span className="w-full text-center">Approve</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="bg-[#135E9A] text-white hover:bg-[#135E9A] focus:bg-[#135E9A] justify-center focus:text-white rounded-[20px]">
                                        <span className="w-full text-center">Hide / Hold</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                        <div className="p-3 rounded-[12px] flex justify-between items-center border border-[#C9A94D]">
                            <div className="flex items-center gap-4">
                                <Image src="/listing/bedroompic.png" alt="Bed Room Pic" width={116} height={92}></Image>
                                <div>
                                    <p className="font-semibold">Town City</p>
                                    <p className="text-sm">2024-01-01 - 2024-01-10</p>
                                    <p>2 Guest · $450</p>
                                </div>
                            </div>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button className="p-2 rounded-full bg-[#434D64]">
                                        <EllipsisVertical className="w-5 h-5 text-white" />
                                    </button>
                                </DropdownMenuTrigger>

                                <DropdownMenuContent className="bg-[#14213D] text-white rounded-[10px] w-48 flex flex-col gap-[14px] p-5 border-none">
                                    <DropdownMenuItem className="bg-[#D00000] text-white hover:bg-[#D00000] focus:bg-[#D00000] justify-center focus:text-white rounded-[20px]">
                                        <span className="w-full text-center">Cancel</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="bg-[#C9A94D] text-white hover:bg-[#C9A94D] focus:bg-[#C9A94D] justify-center focus:text-white rounded-[20px]">
                                        <span className="w-full text-center">Approve</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="bg-[#135E9A] text-white hover:bg-[#135E9A] focus:bg-[#135E9A] justify-center focus:text-white rounded-[20px]">
                                        <span className="w-full text-center">Hide / Hold</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PropertyManagement;

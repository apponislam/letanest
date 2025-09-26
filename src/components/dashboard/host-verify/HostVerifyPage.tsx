"use client";
import React, { useEffect, useState } from "react";
import { Host } from "@/types/host";
import { ArrowLeft, Star } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { EllipsisVertical } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const reviews = [
    {
        date: "12/01/2005",
        name: "John",
        mail: "john@gmail.com",
    },
    {
        date: "15/03/2010",
        name: "Alice",
        mail: "alice@gmail.com",
    },
    {
        date: "20/06/2015",
        name: "Bob",
        mail: "bob@gmail.com",
    },
];

const HostVerifyPage = () => {
    const router = useRouter();
    const [host, setHost] = useState<Host | null>(null);
    const [open, setOpen] = useState(false);
    const hostDetails = {
        name: "John Smith",
        email: "john@gmail.com",
        phone: "00000000000000",
        status: true,
    };

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
                    <div className="flex justify-between  md:items-center gap-3 flex-col md:flex-row">
                        <span className=" text-[#C9A94D] text-xl md:text-[28px]">Review</span>

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

                    <div className="space-y-3 ">
                        {reviews.map((row, i) => (
                            <div key={i} className="p-3 rounded-[12px] flex justify-between md:items-center border border-[#C9A94D] flex-col md:flex-row gap-3">
                                <div>
                                    <p className="font-bold text-2xl">Date</p>
                                    <span>{row.date}</span>
                                </div>
                                <div>
                                    <p className="font-bold text-2xl">Name</p>
                                    <span>{row.name}</span>
                                </div>
                                <div>
                                    <p className="font-bold text-2xl">Mail</p>
                                    <span>{row.mail}</span>
                                </div>
                                <div>
                                    <button
                                        className="bg-[#C9A94D] text-white rounded-[10px] font-bold text-[14px] py-1 px-3 w-full"
                                        onClick={(event) => {
                                            event.preventDefault();
                                            setOpen(true);
                                        }}
                                    >
                                        Host Details
                                    </button>

                                    <Dialog open={open} onOpenChange={setOpen}>
                                        <DialogHeader>
                                            <DialogTitle></DialogTitle>
                                        </DialogHeader>
                                        <DialogContent className="bg-[#14213D] border border-[#C9A94D] rounded-[10px] p-6 w-[320px]">
                                            <style jsx global>{`
                                                [data-slot="dialog-close"] {
                                                    color: white !important;
                                                    opacity: 1 !important;
                                                }
                                                [data-slot="dialog-close"]:hover {
                                                    color: #c9a94d !important;
                                                }
                                                [data-slot="dialog-close"] svg {
                                                    stroke: currentColor;
                                                }
                                            `}</style>
                                            <div className="mt-4 space-y-2 text-[#C9A94D]">
                                                <div className="flex items-center justify-center mb-4 flex-col">
                                                    <Image src="/listing/hostImage.png" alt="Host image" height={100} width={100} className="rounded-full mb-2 border border-[#C9A94D]"></Image>
                                                    <Image src="/listing/messages-dots.png" alt="Message" height={24} width={24}></Image>
                                                </div>
                                                <p className="font-bold text-xl md:text-[28px] text-white"> {hostDetails.name}</p>

                                                <div className="flex items-center gap-2 text-[18px] font-bold">
                                                    <Image src="/listing/mail.png" alt="Mail" height={24} width={24}></Image>
                                                    <p>{hostDetails.email}</p>
                                                </div>
                                                <div className="flex items-center gap-2 text-[18px] font-bold">
                                                    <Image src="/listing/phone.png" alt="Mail" height={24} width={24}></Image>
                                                    <p>{hostDetails.phone}</p>
                                                </div>
                                                <div className="flex items-center justify-center">
                                                    <button className={`flex items-center gap-1 px-7 py-1 rounded-[20px] text-base justify-center ${hostDetails.status ? "bg-[#135E9A] text-white" : "bg-red-600 text-white"}`}>
                                                        {hostDetails.status && <Star className="w-4 h-4" />}
                                                        {hostDetails.status ? "Verified" : "Unverified"}
                                                    </button>
                                                </div>
                                            </div>

                                            <DialogFooter></DialogFooter>
                                        </DialogContent>
                                    </Dialog>
                                </div>

                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <button className="p-2 rounded-full bg-[#434D64] w-9">
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
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HostVerifyPage;

"use client";
import React, { useEffect, useState } from "react";
import { Host } from "@/types/host";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { EllipsisVertical } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";

const reviews = [
    {
        property: "Mild town",
        date: "12/01/2005",
        name: "John",
        mail: "john@gmail.com",
    },
    {
        property: "Lake House",
        date: "15/03/2010",
        name: "Alice",
        mail: "alice@gmail.com",
    },
    {
        property: "Mountain View",
        date: "20/06/2015",
        name: "Bob",
        mail: "bob@gmail.com",
    },
];

const categories = ["Communication", "Accuracy of Listing", "Cleanliness", "Check-In Experience", "Overall Experience"];

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

    const [openRow, setOpenRow] = useState<number | null>(null);
    const [ratings, setRatings] = useState<Record<number, Record<string, number>>>({});

    const handleRating = (rowIndex: number, category: string, star: number) => {
        setRatings((prev) => ({
            ...prev,
            [rowIndex]: { ...prev[rowIndex], [category]: star },
        }));
    };

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
                    <div className="flex justify-between md:items-center flex-col md:flex-row gap-4">
                        <span className=" text-[#C9A94D] text-xl md:text-[28px]">Review</span>

                        <div className="flex items-center gap-2">
                            <span className="text-[#C9A94D] text-xl md:text-[28px]">Sort By:</span>
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
                                    <p className="font-bold text-2xl">Properties</p>
                                    <span>{row.property}</span>
                                </div>
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
                                    <Dialog open={openRow === i} onOpenChange={(isOpen) => setOpenRow(isOpen ? i : null)}>
                                        <DialogTrigger asChild>
                                            <button className="bg-[#C9A94D] text-white rounded-[10px] font-bold text-[14px] py-1 px-3 w-full">Review Details</button>
                                        </DialogTrigger>

                                        <DialogContent className="bg-[#14213D] border border-[#C9A94D] rounded-[10px] p-6 w-[420px]">
                                            <style jsx global>{`
                                                [data-slot="dialog-close"] {
                                                    color: white !important; /* make the X icon white */
                                                    opacity: 1 !important; /* fully visible */
                                                }
                                                [data-slot="dialog-close"]:hover {
                                                    color: #c9a94d !important; /* gold on hover */
                                                }
                                                [data-slot="dialog-close"] svg {
                                                    stroke: currentColor; /* make the X follow the color */
                                                }
                                            `}</style>
                                            <DialogHeader>
                                                <DialogTitle className="text-[#C9A94D] text-lg font-bold">Review Your Host</DialogTitle>
                                            </DialogHeader>

                                            <div className="space-y-5">
                                                {categories.map((category) => (
                                                    <div key={category} className="flex flex-col gap-2">
                                                        <span className="text-[#C9A94D]">{category}</span>
                                                        <div className="flex gap-2">
                                                            {[1, 2, 3, 4, 5].map((star) => (
                                                                <Star key={star} className={`w-6 h-6 cursor-pointer transition-colors ${ratings[i]?.[category] >= star ? "fill-[#C9A94D] text-[#C9A94D]" : "text-gray-500"}`} onClick={() => handleRating(i, category, star)} />
                                                            ))}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            <DialogFooter className="mt-6">
                                                <Button className="bg-[#C9A94D] text-white hover:bg-[#b8973e] rounded-[80px] w-full py-3 h-auto" onClick={() => setOpenRow(null)}>
                                                    Submit Review
                                                </Button>
                                            </DialogFooter>
                                        </DialogContent>
                                    </Dialog>
                                </div>

                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <button className="p-2 rounded-full bg-[#434D64] w-9 h-9">
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

export default PropertyManagement;

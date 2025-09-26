"use client";
import React, { useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { EllipsisVertical, Star } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import PageHeader from "@/components/PageHeader";

// Define categories as const for proper typing
const categories = ["Communication", "Accuracy of Listing", "Cleanliness", "Check-In Experience", "Overall Experience"] as const;
type Category = (typeof categories)[number]; // Union of category strings

// Sample reviews data with typed ratings
type Ratings = Record<Category, number>;

type Review = {
    property: string;
    date: string;
    name: string;
    mail: string;
    ratings: Ratings;
};

const reviews: Review[] = [
    {
        property: "Mild town",
        date: "12/01/2005",
        name: "John",
        mail: "john@gmail.com",
        ratings: { Communication: 5, "Accuracy of Listing": 4, Cleanliness: 5, "Check-In Experience": 4, "Overall Experience": 5 },
    },
    {
        property: "Lake House",
        date: "15/03/2010",
        name: "Alice",
        mail: "alice@gmail.com",
        ratings: { Communication: 4, "Accuracy of Listing": 4, Cleanliness: 3, "Check-In Experience": 5, "Overall Experience": 4 },
    },
    {
        property: "Mountain View",
        date: "20/06/2015",
        name: "Bob",
        mail: "bob@gmail.com",
        ratings: { Communication: 3, "Accuracy of Listing": 3, Cleanliness: 4, "Check-In Experience": 4, "Overall Experience": 3 },
    },
];

const PropertyManagement = () => {
    const [openRow, setOpenRow] = useState<number | null>(null);

    return (
        <div className="container mx-auto">
            <PageHeader title="Reviews" />

            <div className="w-full">
                <div className="bg-[#2D3546] border border-[#C9A94D] p-4 md:p-9 text-[#C9A94D] rounded-[20px] space-y-4">
                    {/* Header */}
                    <div className="flex justify-between md:items-center flex-col md:flex-row gap-4">
                        <span className="text-[#C9A94D] text-xl md:text-[28px]">Review</span>

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

                    {/* Review Rows */}
                    <div className="space-y-3">
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

                                {/* Review Details Dialog */}
                                <div>
                                    <Dialog open={openRow === i} onOpenChange={(isOpen) => setOpenRow(isOpen ? i : null)}>
                                        <DialogTrigger asChild>
                                            <button className="bg-[#C9A94D] text-white rounded-[10px] font-bold text-[14px] py-1 px-3 w-full">Review Details</button>
                                        </DialogTrigger>

                                        <DialogContent className="bg-[#14213D] border border-[#C9A94D] rounded-[10px] p-6 w-[420px]">
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
                                            <DialogHeader>
                                                <DialogTitle className="text-[#C9A94D] text-lg font-bold">Review Details</DialogTitle>
                                            </DialogHeader>

                                            <div className="space-y-5">
                                                {categories.map((category) => (
                                                    <div key={category} className="flex flex-col gap-2">
                                                        <span className="text-[#C9A94D]">{category}</span>
                                                        <div className="flex gap-2">
                                                            {[1, 2, 3, 4, 5].map((star) => (
                                                                <Star key={star} className={`w-6 h-6 ${row.ratings[category as Category] >= star ? "fill-[#C9A94D] text-[#C9A94D]" : "text-gray-500"}`} />
                                                            ))}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            <DialogFooter></DialogFooter>
                                        </DialogContent>
                                    </Dialog>
                                </div>

                                {/* Dropdown Menu */}
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

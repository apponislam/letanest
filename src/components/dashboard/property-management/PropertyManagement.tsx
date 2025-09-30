"use client";
import React, { useState } from "react";
import { Star } from "lucide-react";
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { EllipsisVertical } from "lucide-react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import PageHeader from "@/components/PageHeader";

const PropertyManagement = () => {
    const [open, setOpen] = useState(false);
    const hostDetails = {
        name: "John Smith",
        email: "john@gmail.com",
        phone: "00000000000000",
        status: true,
    };

    return (
        <div className="container mx-auto">
            <PageHeader title={"Property Management"}></PageHeader>

            <div className="w-full">
                <Tabs defaultValue="property" className="w-full">
                    {/* Tab Triggers */}
                    <TabsList className="flex h-auto overflow-hidden bg-transparent gap-3 mb-5 md:mb-10 w-full">
                        <TabsTrigger value="property" className="p-3 h-auto rounded-[10px] w-full  md:w-1/2 text-white data-[state=active]:bg-[#135E9A] data-[state=active]:border-[#C9A94D] data-[state=active]:text-white bg-[#434D64] border-r border-[#C9A94D] ">
                            Property Management
                        </TabsTrigger>
                        <TabsTrigger value="booking" className="p-3 h-auto rounded-[10px] w-full  md:w-1/2 text-white data-[state=active]:bg-[#135E9A] data-[state=active]:border-[#C9A94D] data-[state=active]:text-white bg-[#434D64]">
                            Booking Confirmed
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="property">
                        <div className="bg-[#2D3546] border border-[#C9A94D] p-4 md:p-9 text-[#C9A94D] rounded-[20px] space-y-4">
                            <div className="flex justify-between">
                                <span className="font-semibold">Home</span>
                                <span>Total: £2000</span>
                            </div>
                            <div className="space-y-3">
                                <div className="p-3 rounded-[12px] flex justify-between items-center border border-[#C9A94D]">
                                    <div className="flex items-center gap-4">
                                        <Image src="/listing/bedroompic.png" alt="Bed Room Pic" width={116} height={92}></Image>
                                        <div>
                                            <p className="font-semibold">Town City</p>
                                            <p className="text-sm">2024-01-01 - 2024-01-10</p>
                                            <p>2 Guest · £450</p>
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
                                            <p>2 Guest · £450</p>
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
                                            <p>2 Guest · £450</p>
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
                    </TabsContent>

                    <TabsContent value="booking">
                        <div className="bg-[#2D3546] border border-[#C9A94D] p-4 md:p-9 text-[#C9A94D] rounded-[20px] space-y-4">
                            <div className="flex justify-between">
                                <span className="font-semibold">Booking Summary</span>
                                <span>Total: £1350</span>
                            </div>
                            <div className="space-y-3">
                                <div className="p-3 rounded-[12px] flex justify-between items-center border border-[#C9A94D]">
                                    <div className="flex items-center gap-4">
                                        <Image src="/listing/bedroompic.png" alt="Bed Room Pic" width={116} height={92}></Image>
                                        <div>
                                            <p className="font-semibold">Town City</p>
                                            <p className="text-sm">2024-01-01 - 2024-01-10</p>
                                            <p>2 Guest · £450</p>
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
                                            <DropdownMenuItem className="bg-[#135E9A] text-white hover:bg-[#135E9A] focus:bg-[#135E9A] justify-center focus:text-white rounded-[20px]">
                                                <span className="w-full text-center">Hide</span>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                className="bg-[#C9A94D] text-white justify-center rounded-[20px] cursor-pointer"
                                                onSelect={(event) => {
                                                    event.preventDefault(); // prevent dropdown from closing
                                                    setOpen(true); // open the modal
                                                }}
                                            >
                                                <span className="w-full text-center">Host Details</span>
                                            </DropdownMenuItem>

                                            <Dialog open={open} onOpenChange={setOpen}>
                                                <DialogHeader>
                                                    <DialogTitle></DialogTitle>
                                                </DialogHeader>
                                                <DialogContent className="bg-[#14213D] border border-[#C9A94D] rounded-[10px] p-6 w-[320px]">
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
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                                <div className="p-3 rounded-[12px] flex justify-between items-center border border-[#C9A94D]">
                                    <div className="flex items-center gap-4">
                                        <Image src="/listing/bedroompic.png" alt="Bed Room Pic" width={116} height={92}></Image>
                                        <div>
                                            <p className="font-semibold">Town City</p>
                                            <p className="text-sm">2024-01-01 - 2024-01-10</p>
                                            <p>2 Guest · £450</p>
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
                                            <DropdownMenuItem className="bg-[#135E9A] text-white hover:bg-[#135E9A] focus:bg-[#135E9A] justify-center focus:text-white rounded-[20px]">
                                                <span className="w-full text-center">Hide</span>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                className="bg-[#C9A94D] text-white justify-center rounded-[20px] cursor-pointer"
                                                onSelect={(event) => {
                                                    event.preventDefault(); // prevent dropdown from closing
                                                    setOpen(true); // open the modal
                                                }}
                                            >
                                                <span className="w-full text-center">Host Details</span>
                                            </DropdownMenuItem>

                                            <Dialog open={open} onOpenChange={setOpen}>
                                                <DialogHeader>
                                                    <DialogTitle></DialogTitle>
                                                </DialogHeader>
                                                <DialogContent className="bg-[#14213D] border border-[#C9A94D] rounded-[10px] p-6 w-[320px]">
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
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                                <div className="p-3 rounded-[12px] flex justify-between items-center border border-[#C9A94D]">
                                    <div className="flex items-center gap-4">
                                        <Image src="/listing/bedroompic.png" alt="Bed Room Pic" width={116} height={92}></Image>
                                        <div>
                                            <p className="font-semibold">Town City</p>
                                            <p className="text-sm">2024-01-01 - 2024-01-10</p>
                                            <p>2 Guest · £450</p>
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
                                            <DropdownMenuItem className="bg-[#135E9A] text-white hover:bg-[#135E9A] focus:bg-[#135E9A] justify-center focus:text-white rounded-[20px]">
                                                <span className="w-full text-center">Hide</span>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                className="bg-[#C9A94D] text-white justify-center rounded-[20px] cursor-pointer"
                                                onSelect={(event) => {
                                                    event.preventDefault(); // prevent dropdown from closing
                                                    setOpen(true); // open the modal
                                                }}
                                            >
                                                <span className="w-full text-center">Host Details</span>
                                            </DropdownMenuItem>

                                            <Dialog open={open} onOpenChange={setOpen}>
                                                <DialogHeader>
                                                    <DialogTitle></DialogTitle>
                                                </DialogHeader>
                                                <DialogContent className="bg-[#14213D] border border-[#C9A94D] rounded-[10px] p-6 w-[320px]">
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
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
};

export default PropertyManagement;

"use client";
import { ArrowLeft, Mail, Star, UserPen } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import React from "react";

const UserProfileDetails = () => {
    const router = useRouter();

    const handleClick = () => {
        router.back();
    };

    const user = {
        firstName: "John",
        lastName: "Doe",
        fullName: "John Smith",
        email: "john@gmail.com",
        gender: "Male",
        contact: "000000000",
        address: "BLK208 L26 Manchester Street, Grand Broadmore, Antel Grand Village",
        country: "UK",
        city: "General Trias",
        zip: "4107",
        avatarUrl: "/dashboard/profile/profileimg.png",
        isVerified: true,
    };

    return (
        <div className="container mx-auto">
            <div className="p-5 border border-[#C9A94D] flex justify-between items-center mb-6 flex-col md:flex-row gap-4">
                <div className="text-[#C9A94D] flex items-center gap-3 text-[18px] cursor-pointer hover:underline" onClick={handleClick}>
                    <ArrowLeft />
                    <p>Back</p>
                </div>
                <h1 className="text-2xl text-[#C9A94D]">Personal Details</h1>
            </div>

            <div className="rounded-[10px] border border-[#C9A94D] py-[10px] px-5 ">
                <div className="flex items-start md:items-center justify-between flex-col md:flex-row gap-2 mb-5 md:mb-16">
                    <div className="flex items-center gap-5">
                        <Image alt="User Photo" src={user.avatarUrl} width={100} height={100} className="rounded-full" />
                        <div className="flex flex-col gap-2">
                            <h1 className="font-bold text-white">{user.fullName}</h1>
                            <div className="flex items-center gap-2">
                                <Mail className="w-6 h-6 text-[#C9A94D]" />
                                <p className="font-bold text-[#C9A94D]">{user.email}</p>
                            </div>
                            <div className="flex gap-2 flex-col md:flex-row">
                                {/* {user.isVerified && (
                                    <button className="bg-[#135E9A] text-white rounded-[20px] px-7 py-1 flex items-center gap-1 text-base justify-center">
                                        <Star className="w-4 h-4" />
                                        Verified
                                    </button>
                                )}
                                {!user.isVerified && <button className="bg-[#135E9A] text-white rounded-[20px] px-7 py-1 text-base">Add Verify</button>} */}
                                <button className="bg-[#135E9A] text-white rounded-[20px] px-7 py-1 flex items-center gap-1 text-base justify-center">
                                    <Star className="w-4 h-4" />
                                    Verified
                                </button>
                                <Link href="/dashboard/profile/verify">
                                    <button className="bg-[#135E9A] text-white rounded-[20px] px-7 py-1 text-base">Add Verify</button>
                                </Link>
                            </div>
                        </div>
                    </div>
                    <Link href="/dashboard/profile/edit">
                        <button className="bg-[#434D64] text-[#C9A94D] rounded-[10px] px-10 py-2 flex items-center gap-2 text-base">
                            <UserPen className="w-4 h-4" />
                            Edit Profile
                        </button>
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* First Name */}
                    <div className="flex flex-col md:gap-4">
                        <p className="text-[#C9A94D] text-[18px] font-medium">First Name</p>
                        <p className="text-[#9399A6] text-[14px] mt-1">{user.firstName}</p>
                    </div>

                    {/* Last Name */}
                    <div className="flex flex-col md:gap-4">
                        <p className="text-[#C9A94D] text-[18px] font-medium">Last Name</p>
                        <p className="text-[#9399A6] text-[14px] mt-1">{user.lastName}</p>
                    </div>

                    {/* Gender */}
                    <div className="flex flex-col md:gap-4">
                        <p className="text-[#C9A94D] text-[18px] font-medium">Gender</p>
                        <p className="text-[#9399A6] text-[14px] mt-1">{user.gender}</p>
                    </div>

                    {/* Contact */}
                    <div className="flex flex-col md:gap-4">
                        <p className="text-[#C9A94D] text-[18px] font-medium">Contact</p>
                        <p className="text-[#9399A6] text-[14px] mt-1">{user.contact}</p>
                    </div>

                    {/* Complete Address */}
                    <div className="md:col-span-2 flex flex-col md:gap-4">
                        <p className="text-[#C9A94D] text-[18px] font-medium">Complete Address</p>
                        <p className="text-[#9399A6] text-[14px] mt-1">{user.address}</p>
                    </div>

                    {/* Country */}
                    <div className="flex flex-col md:gap-4">
                        <p className="text-[#C9A94D] text-[18px] font-medium">Country</p>
                        <p className="text-[#9399A6] text-[14px] mt-1">{user.country}</p>
                    </div>

                    {/* City */}
                    <div className="flex flex-col md:gap-4">
                        <p className="text-[#C9A94D] text-[18px] font-medium">City</p>
                        <p className="text-[#9399A6] text-[14px] mt-1">{user.city}</p>
                    </div>

                    {/* Zip/Postal Code */}
                    <div className="flex flex-col md:gap-4">
                        <p className="text-[#C9A94D] text-[18px] font-medium">Zip/Postal Code</p>
                        <p className="text-[#9399A6] text-[14px] mt-1">{user.zip}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfileDetails;

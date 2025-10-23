"use client";

import PageHeader from "@/components/PageHeader";
import { currentUser } from "@/redux/features/auth/authSlice";
import { useAppSelector } from "@/redux/hooks";
import { useGetSingleUserQuery } from "@/redux/features/users/usersApi";
import { Clock, Mail, Star, UserPen } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { splitFullName } from "@/utils/splitFullName";

const UserProfileDetails = () => {
    const mainuser = useAppSelector(currentUser);
    const [showRules, setShowRules] = useState(false);

    const { data: userData, isLoading, error } = useGetSingleUserQuery(mainuser?._id!);

    if (isLoading) return <p className="text-[#C9A94D] text-center mt-10">Loading user details...</p>;

    if (error) return <p className="text-red-500 text-center mt-10">Failed to load user info.</p>;

    const user = userData?.data || {};
    console.log(user);

    const userName = user?.name; // user.name from API
    const { firstName, lastName } = splitFullName(userName);

    return (
        <div className="container mx-auto">
            <PageHeader title="Personal Details" isUser={false} />

            <div className="rounded-[10px] border border-[#C9A94D] py-[10px] px-5">
                <div className="flex items-start md:items-center justify-between flex-col md:flex-row gap-2 mb-5 md:mb-16">
                    <div className="flex items-center gap-5">
                        <Image alt="User Photo" src={user.profileImg ? `${process.env.NEXT_PUBLIC_BASE_API}${user.profileImg}` : "/dashboard/profile/profileimg.png"} width={100} height={100} className="rounded-full w-[100px] h-[100px] object-cover" />
                        <div className="flex flex-col gap-2">
                            <h1 className="font-bold text-white">{user.name || `${user.firstName || ""} ${user.lastName || ""}` || "N/A"}</h1>
                            <div className="flex items-center gap-2">
                                <Mail className="w-6 h-6 text-[#C9A94D]" />
                                <p className="font-bold text-[#C9A94D]">{user.email || "N/A"}</p>
                            </div>
                            {/* <div className="flex gap-2 flex-col md:flex-row">
                                {user.role === "HOST" && (
                                    <>
                                        {user.verificationStatus === "approved" ? (
                                            <button className="bg-[#135E9A] text-white rounded-[20px] px-7 py-1 flex items-center gap-1 text-base justify-center">
                                                <Star className="w-4 h-4" />
                                                Verified
                                            </button>
                                        ) : user.verificationStatus === "pending" ? (
                                            <button className="bg-yellow-500 text-white rounded-[20px] px-7 py-1 flex items-center gap-1 text-base justify-center">
                                                <Clock className="w-4 h-4" />
                                                Under Review
                                            </button>
                                        ) : user.verificationStatus === "rejected" ? (
                                            <Link href="/dashboard/profile/verify">
                                                <button className="bg-red-500 text-white rounded-[20px] px-7 py-1 text-base">Re-submit Verification</button>
                                            </Link>
                                        ) : (
                                            <Link href="/dashboard/profile/verify">
                                                <button className="bg-[#135E9A] text-white rounded-[20px] px-7 py-1 text-base cursor-pointer">Get Verified</button>
                                            </Link>
                                        )}
                                    </>
                                )}
                            </div> */}
                            <div className="flex gap-2 flex-col md:flex-row items-center">
                                {user.role === "HOST" && (
                                    <>
                                        {user.verificationStatus === "approved" ? (
                                            <button className="bg-[#135E9A] text-white rounded-[20px] px-7 py-1 flex items-center gap-1 text-base justify-center">
                                                <Star className="w-4 h-4" />
                                                Verified
                                            </button>
                                        ) : user.verificationStatus === "pending" ? (
                                            <button className="bg-yellow-500 text-white rounded-[20px] px-7 py-1 flex items-center gap-1 text-base justify-center">
                                                <Clock className="w-4 h-4" />
                                                Under Review
                                            </button>
                                        ) : user.verificationStatus === "rejected" ? (
                                            <div className="flex items-center gap-2">
                                                <Link href="/dashboard/profile/verify">
                                                    <button className="bg-red-500 text-white rounded-[20px] px-7 py-1 text-base">Re-submit Verification</button>
                                                </Link>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2">
                                                <Link href="/dashboard/profile/verify">
                                                    <button className="bg-[#135E9A] text-white rounded-[20px] px-7 py-1 text-base cursor-pointer">Get Verified</button>
                                                </Link>

                                                {/* Info Button with Tooltip */}
                                                <div className="relative inline-block" onMouseEnter={() => setShowRules(true)} onMouseLeave={() => setShowRules(false)} onClick={() => setShowRules(!showRules)}>
                                                    <button className="bg-[#C9A94D] text-white rounded-full w-6 h-6 flex items-center justify-center text-sm cursor-pointer">i</button>

                                                    {showRules && (
                                                        <div className="absolute -right-5 md:right-unset md:left-1/2 top-full mt-2 w-72 md:w-[520px] bg-[#14213D] text-white text-sm p-6 rounded-[10px] shadow-lg md:-translate-x-1/2 border border-[#C9A94D] z-50" style={{ maxHeight: "80vh", overflowY: "auto" }}>
                                                            <h2 className="font-bold mb-2 text-[14px]">Why Hosts Should Get Verified</h2>
                                                            <p className="mb-2">Getting verified helps build trust and confidence between hosts and guests on our platform. Verification shows that you're a genuine host who takes safety and transparency seriously - something that's increasingly important in today's online rental market.</p>
                                                            <p className="mb-2">
                                                                By completing our quick verification process, you not only protect yourself but also help protect the wider community. Verified profiles give guests peace of mind that they're booking with a legitimate host, helping to prevent scams and misunderstandings. In turn, verified hosts are more likely to receive bookings, better reviews, and
                                                                repeat guests who value that extra level of reassurance.
                                                            </p>

                                                            <h3 className="font-bold mt-4 mb-2 text-[14px]">Benefits of getting verified:</h3>
                                                            <ul className="list-disc list-outside ml-4 mb-2 text-[13px] space-y-1">
                                                                <li>Increases trust and credibility with potential guests</li>
                                                                <li>Helps your listing stand out and attract more bookings</li>
                                                                <li>Reduces the risk of fraud and fake listings</li>
                                                                <li>Builds confidence and better communication between hosts and guests</li>
                                                                <li>Creates a safer, more reliable community for everyone</li>
                                                            </ul>

                                                            <p className="mt-2 text-[13px]">Verification isn't just about safety - it's about setting a higher standard of trust and professionalism for all our hosts.</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    <Link href="/dashboard/profile/edit">
                        <button className="bg-[#434D64] text-[#C9A94D] rounded-[10px] px-10 py-2 flex items-center gap-2 text-base cursor-pointer">
                            <UserPen className="w-4 h-4" />
                            Edit Profile
                        </button>
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* First Name */}
                    <div className="flex flex-col md:gap-4">
                        <p className="text-[#C9A94D] text-[18px] font-medium">First Name</p>
                        <p className="text-[#9399A6] text-[14px] mt-1">{firstName || "N/A"}</p>
                    </div>

                    {/* Last Name */}
                    <div className="flex flex-col md:gap-4">
                        <p className="text-[#C9A94D] text-[18px] font-medium">Last Name</p>
                        <p className="text-[#9399A6] text-[14px] mt-1">{lastName || "N/A"}</p>
                    </div>

                    {/* Gender */}
                    <div className="flex flex-col md:gap-4">
                        <p className="text-[#C9A94D] text-[18px] font-medium">Gender</p>
                        <p className="text-[#9399A6] text-[14px] mt-1">{user.gender || "N/A"}</p>
                    </div>

                    {/* Contact */}
                    <div className="flex flex-col md:gap-4">
                        <p className="text-[#C9A94D] text-[18px] font-medium">Contact</p>
                        <p className="text-[#9399A6] text-[14px] mt-1">{user.phone || "N/A"}</p>
                    </div>

                    {/* Complete Address */}
                    <div className="md:col-span-2 flex flex-col md:gap-4">
                        <p className="text-[#C9A94D] text-[18px] font-medium">Complete Address</p>
                        <p className="text-[#9399A6] text-[14px] mt-1">{user?.address?.street || "N/A"}</p>
                    </div>

                    {/* Country */}
                    <div className="flex flex-col md:gap-4">
                        <p className="text-[#C9A94D] text-[18px] font-medium">Country</p>
                        <p className="text-[#9399A6] text-[14px] mt-1">{user?.address?.country || "N/A"}</p>
                    </div>

                    {/* City */}
                    <div className="flex flex-col md:gap-4">
                        <p className="text-[#C9A94D] text-[18px] font-medium">City</p>
                        <p className="text-[#9399A6] text-[14px] mt-1">{user?.address?.city || "N/A"}</p>
                    </div>

                    {/* Zip/Postal Code */}
                    {/* <div className="flex flex-col md:gap-4">
                        <p className="text-[#C9A94D] text-[18px] font-medium">Zip/Postal Code</p>
                        <p className="text-[#9399A6] text-[14px] mt-1">{user?.address?.zip || "N/A"}</p>
                    </div> */}
                </div>
            </div>
        </div>
    );
};

export default UserProfileDetails;

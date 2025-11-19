"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import PageHeader from "../PageHeader";
import { useAppSelector } from "@/redux/hooks";
import { currentUser } from "@/redux/features/auth/authSlice";
import { useGetTermsByTargetQuery } from "@/redux/features/public/publicApi";

const TermsCondition = () => {
    const user = useAppSelector(currentUser);
    const searchParams = useSearchParams();
    const [activeTab, setActiveTab] = useState<"GUEST" | "HOST">("GUEST");

    useEffect(() => {
        const roleParam = searchParams.get("role");
        if (roleParam === "host" || user?.role === "HOST") {
            setActiveTab("HOST");
        } else {
            setActiveTab("GUEST");
        }
    }, [searchParams, user]);

    // Fetch both guest and host terms
    const { data: guestTermsData, isLoading: guestLoading } = useGetTermsByTargetQuery("GUEST");
    const { data: hostTermsData, isLoading: hostLoading } = useGetTermsByTargetQuery("HOST");

    console.log("User:", user);
    console.log("Active Tab:", activeTab);
    console.log("Guest Terms Data:", guestTermsData);
    console.log("Host Terms Data:", hostTermsData);

    // Get the appropriate terms content
    const getTermsContent = (target: "GUEST" | "HOST") => {
        const termsData = target === "GUEST" ? guestTermsData : hostTermsData;
        const isLoading = target === "GUEST" ? guestLoading : hostLoading;

        if (isLoading) {
            return "<p>Loading terms and conditions...</p>";
        }

        const termsArray = termsData?.data || [];

        // Look for ADMIN-created terms for the current target
        const relevantTerm = termsArray.find((t) => t.creatorType === "ADMIN" && t.target === target);

        return relevantTerm?.content || `<p>No terms and conditions available for ${target.toLowerCase()}s.</p>`;
    };

    const guestContent = getTermsContent("GUEST");
    const hostContent = getTermsContent("HOST");

    return (
        <>
            <div className="container mx-auto">
                <div className="mx-4 md:mx-0">
                    <PageHeader title={"Terms & Conditions"} />

                    {/* Tabs */}
                    <div className="flex border-b border-[#C9A94D] mb-6">
                        <button onClick={() => setActiveTab("GUEST")} className={`px-6 py-3 font-semibold text-lg ${activeTab === "GUEST" ? "bg-[#C9A94D] text-white border-b-2 border-[#C9A94D]" : "text-[#C9A94D] hover:bg-[#C9A94D] hover:text-white transition-colors"}`}>
                            For Guests
                        </button>
                        <button onClick={() => setActiveTab("HOST")} className={`px-6 py-3 font-semibold text-lg ${activeTab === "HOST" ? "bg-[#C9A94D] text-white border-b-2 border-[#C9A94D]" : "text-[#C9A94D] hover:bg-[#C9A94D] hover:text-white transition-colors"}`}>
                            For Hosts
                        </button>
                    </div>

                    <div className="text-[#C9A94D]">
                        <h1 className="text-[32px] mb-4">Terms & Conditions {activeTab === "HOST" ? "for Hosts" : "for Guests"}</h1>

                        {/* Guest Terms */}
                        {activeTab === "GUEST" && <div className="rich-text-content text-[#C9A94D]" dangerouslySetInnerHTML={{ __html: guestContent }} />}

                        {/* Host Terms */}
                        {activeTab === "HOST" && <div className="rich-text-content text-[#C9A94D]" dangerouslySetInnerHTML={{ __html: hostContent }} />}
                    </div>
                </div>
            </div>
        </>
    );
};

export default TermsCondition;

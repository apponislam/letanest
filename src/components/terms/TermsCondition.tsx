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
    const [target, setTarget] = useState<"GUEST" | "HOST">("GUEST");

    // Check URL params for role AND user role
    useEffect(() => {
        const roleParam = searchParams.get("role");

        // Priority: URL param > User role > Default GUEST
        if (roleParam === "host" || user?.role === "HOST") {
            setTarget("HOST"); // Show HOST terms for host users OR ?role=host
        } else {
            setTarget("GUEST"); // Default to GUEST for everyone else
        }
    }, [searchParams, user]);

    // Fetch terms based on target
    const { data: termsData, isLoading, error } = useGetTermsByTargetQuery(target);

    console.log("User:", user);
    console.log("Target:", target);
    console.log("Terms Data:", termsData);

    // Get the appropriate terms content
    const getTermsContent = () => {
        if (isLoading) {
            return "<p>Loading terms and conditions...</p>";
        }

        if (error) {
            return "<p>Failed to load terms and conditions.</p>";
        }

        const termsArray = termsData?.data || [];

        // Look for ADMIN-created terms for the current target
        const relevantTerm = termsArray.find((t) => t.creatorType === "ADMIN" && t.target === target);

        return relevantTerm?.content || "<p>No terms and conditions available.</p>";
    };

    const termsContent = getTermsContent();

    return (
        <>
            <div className="container mx-auto">
                <div className="mx-4 md:mx-0">
                    <PageHeader title={"Terms & Conditions"} />

                    <div className="text-[#C9A94D]">
                        <h1 className="text-[32px] mb-4">Terms & Conditions {target === "HOST" ? "for Hosts" : "for Guests"}</h1>

                        {isLoading ? <p className="mb-3">Loading terms and conditions...</p> : <div className="rich-text-content text-[#C9A94D]" dangerouslySetInnerHTML={{ __html: termsContent }} />}
                    </div>
                </div>
            </div>
        </>
    );
};

export default TermsCondition;

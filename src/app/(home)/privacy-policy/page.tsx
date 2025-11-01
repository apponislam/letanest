"use client";
import React from "react";
import PageHeader from "@/components/PageHeader";
import { useGetPrivacyPolicyQuery } from "@/redux/features/PrivacyPolicy/privacyPolicyApi";

const PrivacyPolicy = () => {
    // Fetch privacy policy from backend
    const { data, isLoading, error } = useGetPrivacyPolicyQuery({});
    console.log(data);

    // Handle loading and error states
    if (isLoading) {
        return (
            <div className="container mx-auto">
                <PageHeader title="Privacy Policy" />
                <p className="text-[#C9A94D] mx-4 md:mx-0">Loading privacy policy...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto">
                <PageHeader title="Privacy Policy" />
                <p className="text-red-500 mx-4 md:mx-0">Failed to load privacy policy.</p>
            </div>
        );
    }

    const policy = data?.data;
    const content = policy?.content || "<p>No privacy policy available.</p>";
    const effectiveDate = policy?.effectiveDate ? new Date(policy.effectiveDate).toLocaleDateString() : null;

    return (
        <div className="container mx-auto">
            <div className="mx-4 md:mx-0">
                <PageHeader title="Privacy Policy" />
                <div className="text-[#C9A94D]">
                    <h1 className="text-[32px] mb-4">Privacy Policy</h1>

                    {effectiveDate && <p className="mb-4 text-sm text-[#C9A94D]/70">Last Updated: {effectiveDate}</p>}

                    <div className="rich-text-content text-[#C9A94D]" dangerouslySetInnerHTML={{ __html: content }} />
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;

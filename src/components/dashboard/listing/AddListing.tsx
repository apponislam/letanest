"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/redux/hooks";
import { currentUser } from "@/redux/features/auth/authSlice";
import { toast } from "sonner";
import PageHeader from "@/components/PageHeader";
import AddListingForm from "@/components/forms/listing/AddListingForm";

const AddListing = () => {
    const router = useRouter();
    const user = useAppSelector(currentUser);

    useEffect(() => {
        if (user?.role === "GUEST") {
            toast.error("Guest users cannot add properties");
            router.push("/");
        }
    }, [user, router]);

    if (user?.role === "GUEST") {
        return (
            <div className="container mx-auto">
                <PageHeader title={"Access Denied"}></PageHeader>
                <div className="text-center py-10">
                    <p className="text-[#C9A94D] text-lg">Redirecting...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto">
            <PageHeader title={"Add Listing"}></PageHeader>
            <div>
                <AddListingForm></AddListingForm>
            </div>
        </div>
    );
};

export default AddListing;

"use client";

import React from "react";
import MemberShip from "@/components/dashboard/memberships/MemberShip";
import { currentUser } from "@/redux/features/auth/authSlice";
import { useAppSelector } from "@/redux/hooks";
import GuestPlansPage from "@/components/dashboard/memberships/GuestPlansPage";
import HostPlansPage from "@/components/dashboard/memberships/HostPlansPage";

const Page = () => {
    const mainuser = useAppSelector(currentUser);

    console.log("Logged-in user:", mainuser);

    if (mainuser?.role === "ADMIN") {
        return <MemberShip />;
    }

    if (mainuser?.role === "HOST") {
        return <HostPlansPage />;
    }

    if (mainuser?.role === "GUEST") {
        return <GuestPlansPage />;
    }

    // Fallback (no user or unknown role)
    return (
        <div className="flex flex-col items-center justify-center h-screen text-center">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">No Role Detected</h2>
            <p className="text-gray-500">Please log in or contact admin for access.</p>
        </div>
    );
};

export default Page;

"use client";
import EditTermsCondition from "@/components/dashboard/terms-conditions/EditTerms&Condition";
import EditTermsConditionForHost from "@/components/dashboard/terms-conditions/EditTerms&ConditionForHost";
import { currentUser } from "@/redux/features/auth/authSlice";
import React from "react";
import { useSelector } from "react-redux";

const Page = () => {
    const user = useSelector(currentUser);

    if (user?.role === "ADMIN") {
        return <EditTermsCondition />;
    } else if (user?.role === "HOST") {
        return <EditTermsConditionForHost />;
    } else {
        return <EditTermsCondition />;
    }
};

export default Page;
